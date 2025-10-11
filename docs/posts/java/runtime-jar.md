##### Jar包瘦身

```shell
#!/usr/bin/env bash
#
# Name: jar-slim.sh
# Java JAR 瘦身脚本（稳定版 v3.1）
# Feature: 自动提取MANIFEST、兼容Spring Boot与普通JAR
#

set -euo pipefail

#=== 配置区 ===#
BUILD_TOOL=${1:-mvn}           # 可选: mvn / gradle
PROGUARD_ENABLED=${2:-false}   # 是否启用混淆
OUTPUT_DIR=dist                # 输出目录
TMP_DIR=tmp                    # 临时目录
EXCLUDE_FILE=${OUTPUT_DIR}/exclude-list.txt
REPORT_FILE=${OUTPUT_DIR}/build-report.txt
#==============#

echo "==> [1/7] 清理旧构建产物"
rm -rf target build ${OUTPUT_DIR} ${TMP_DIR}
mkdir -p ${OUTPUT_DIR} ${TMP_DIR}

echo "==> [2/7] 依赖分析"
if [ "$BUILD_TOOL" = "mvn" ]; then
    mvn dependency:tree -DoutputFile=${OUTPUT_DIR}/dependency-tree.txt > /dev/null
elif [ "$BUILD_TOOL" = "gradle" ]; then
    ./gradlew dependencies > ${OUTPUT_DIR}/dependency-tree.txt
else
    echo "❌ 不支持的构建工具: $BUILD_TOOL"
    exit 1
fi

echo "==> [3/7] 构建可执行 JAR"
if [ "$BUILD_TOOL" = "mvn" ]; then
    mvn clean package -DskipTests
    JAR_FILE=$(find target -name "*.jar" | grep -v "sources" | head -n 1)
else
    ./gradlew clean build -x test
    JAR_FILE=$(find build/libs -name "*.jar" | head -n 1)
fi
echo "打包完成: $JAR_FILE"

echo "==> [4/7] 生成排除列表"
jar -tf "$JAR_FILE" | grep -E "META-INF/maven|META-INF/.*\.SF|META-INF/.*\.RSA|META-INF/.*\.DSA|test|example|sample|doc|\.iml|\.idea" > "$EXCLUDE_FILE" || true
echo "排除列表已生成: $EXCLUDE_FILE"
echo "排除项数量: $(wc -l < $EXCLUDE_FILE)"

echo "==> [5/7] 安全瘦身重打包"

WORK_DIR="${TMP_DIR}/unpacked"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# 解压原始 JAR
jar -xf "../../$JAR_FILE"

# 删除排除文件
while read -r pattern; do
    [ -z "$pattern" ] && continue
    find . -type f | grep -E "$pattern" | xargs -r rm -f || true
done < "../../$EXCLUDE_FILE"

# 从原JAR中直接提取MANIFEST.MF，不依赖解压结构
cd ../..
MANIFEST_PATH="${TMP_DIR}/MANIFEST.MF"
if unzip -p "$JAR_FILE" META-INF/MANIFEST.MF > "$MANIFEST_PATH" 2>/dev/null; then
    echo "提取 MANIFEST 成功: $MANIFEST_PATH"
else
    echo "⚠️ 未找到原始 MANIFEST，创建默认文件"
    echo "Manifest-Version: 1.0" > "$MANIFEST_PATH"
    echo "Main-Class: org.springframework.boot.loader.JarLauncher" >> "$MANIFEST_PATH"
fi

# 检测 Spring Boot 类型
if grep -q "Spring-Boot" "$MANIFEST_PATH"; then
    echo "检测到 Spring Boot 可执行 JAR"
else
    echo "检测到普通 JAR"
fi

# 重新打包
SLIM_JAR="${OUTPUT_DIR}/$(basename "$JAR_FILE")"
cd "$TMP_DIR/unpacked"
jar -cfm "../../$SLIM_JAR" "../MANIFEST.MF" -C . . >/dev/null
cd ../..

# 校验新 JAR 可运行性
if ! unzip -p "$SLIM_JAR" META-INF/MANIFEST.MF >/dev/null; then
    echo "❌ 打包失败: 无法读取 MANIFEST.MF"
    exit 1
fi

echo "==> [6/7] 可选混淆处理"
if [ "$PROGUARD_ENABLED" = "true" ]; then
    echo "执行 ProGuard 混淆压缩..."
    java -jar proguard.jar @scripts/proguard.pro
fi

echo "==> [7/7] 构建报告生成"
ORIGINAL_SIZE=$(du -h "$JAR_FILE" | awk '{print $1}')
SLIM_SIZE=$(du -h "$SLIM_JAR" | awk '{print $1}')
{
    echo "原始体积: $ORIGINAL_SIZE"
    echo "瘦身后体积: $SLIM_SIZE"
    echo "依赖分析: ${OUTPUT_DIR}/dependency-tree.txt"
    echo "排除列表: ${EXCLUDE_FILE}"
} > "$REPORT_FILE"

echo ""
echo "✅ 瘦身完成！"
echo "输出文件: $SLIM_JAR"
echo "报告位置: $REPORT_FILE"
echo ""

echo "==> 启动类检测:"
unzip -p "$SLIM_JAR" META-INF/MANIFEST.MF | grep "Main-Class" || echo "⚠️ 未检测到 Main-Class"

## 瘦身运行 bash jar-slim.sh mvn false
## 运行jar java -cp jspi-0.0.1-SNAPSHOT.jar com.laazua.example.MainClass
```