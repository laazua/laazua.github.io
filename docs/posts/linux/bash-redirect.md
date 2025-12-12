##### 重定向

* **重定向输入**
```bash
## 将文件内容作为命令输入
cat < input.txt

## 指定文件描述符3作为输入
exec 3< input.txt
read line <&3

## 使用特殊文件名/dev/stdin
cat < /dev/stdin
# pid=$(ps aux|grep cat|grep -v grep)|awk '{print $2}')
# echo 'hello' >/proc/${pid}/fd/0
```

* **重定向输出**
```bash
## 重定向标准输出到文件
ls >output.txt

## 重定向到文件描述符3
ls 3> output.txt

## 演示noclobber选项
set -o noclobber
echo "test" > existing.txt  # 失败，文件已存在
echo "test" >| existing.txt  # 成功，强制覆盖

## 使用特殊文件名/dev/stdout
echo "Hello" > /dev/stdout

## 追加
echo 'hello' >> existing.txt
echo 'world' 4>> existing.txt
```

* **同时重定向标准输出和标准错误**
```bash
## 推荐形式
ls nonexistent.txt existing.txt &> output.txt
## 旧形式
ls nonexistent.txt existing.txt >& output.txt
## 等效形式
ls nonexistent.txt existing.txt > output.txt 2>&1
## 顺序的重要性
# 这个只重定向标准输出到文件
ls nonexistent.txt existing.txt 2>&1 > output.txt


## 追加
echo "开始操作..." &>> output.txt
## 等效形式
ls nonexistent.txt existing.txt >> log.txt 2>&1
```

* **文档内嵌**
```bash
## 基本的here document
cat << END
第一行文本
第二行文本
变量扩展：$HOME
END

## 带引号的分隔符（禁止扩展）
cat << 'EOF'
第一行文本
第二行文本
变量不会扩展：$HOME
EOF

## 使用<<-去除前导制表符
cat <<- INDENT
    第一行（制表符会被移除）
    第二行（制表符会被移除）
    END  # 注意：这个END必须有前导制表符
INDENT

## 重定向到文件描述符3
cat 3<< DOC > output.txt
这是here document的内容
DOC
```

* **字符串内嵌**
```bash
## 基本用法
tr 'a-z' 'A-Z' <<< "hello world"

## 使用变量
name="John"
grep "John" <<< "$name Doe, Jane Smith"

## 执行命令替换
wc -w <<< "$(echo one two three)"

## 重定向到文件描述符
cat 3<<< "Hello to fd 3"
```

* **复制文件描述符**
```bash
## 复制标准输入
exec 3<&0  # 将fd 3作为标准输入的副本
read -u 3 line

## 复制标准输出
exec 4>&1  # 将fd 4作为标准输出的副本
echo "到fd 4" >&4

## 复制标准错误
exec 5>&2  # 将fd 5作为标准错误的副本
echo "错误信息" >&5

## 关闭文件描述符
exec 3>&-  # 关闭fd 3
exec 4<&-  # 关闭fd 4
```

* **移动文件描述符**
```bash
## 移动文件描述符
exec 3> file.txt
echo "测试" >&3
exec 4>&3-  # 将fd 3移动到fd 4，然后关闭fd 3
echo "现在到fd 4" >&4

## 移动输入描述符
exec 3< input.txt
exec 4<&3-  # 移动后，fd 3被关闭
read -u 4 line
```

* **读写打开文件描述符**
```bash
## 以读写模式打开文件
exec 3<> tempfile.txt
echo "写入内容" >&3
read -u 3 line
echo "读取的内容: $line"

## 使用读写模式进行简单编辑
{
    echo "第一行"
    echo "第二行"
} > testfile.txt

exec 3<> testfile.txt
read -u 3 line1
echo "修改的第二行" >&3
exec 3>&-
cat testfile.txt
```

* **使用{varname}语法管理文件描述符**
```bash
## 使用变量名分配文件描述符
{myfd}> output.txt
echo "使用变量fd" >&"$myfd"
exec {myfd}>&-  # 关闭

## 使用变量名关闭文件描述符
exec 10> file.txt
fdname=10
exec {fdname}>&-  # 关闭fd 10
```

* **综合示例**
```bash
#!/bin/bash

# 综合示例：记录脚本执行的完整日志
log_file="script.log"

# 备份原始文件描述符
exec 3>&1 4>&2

# 重定向所有输出到日志文件和屏幕
exec 1> >(tee -a "$log_file" >&3)
exec 2> >(tee -a "$log_file" >&4)

echo "脚本开始执行：$(date)"
echo "当前用户：$USER"

# 执行一些命令
ls -l
ls nonexistentfile  # 这个会产生错误

echo "脚本结束：$(date)"

# 恢复原始文件描述符
exec 1>&3 2>&4
exec 3>&- 4>&-

echo "日志已保存到: $log_file"
```
