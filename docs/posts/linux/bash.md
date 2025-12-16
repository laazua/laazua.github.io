##### bash语法(man bash)

- **文档注释**
```bash
: '
多行注释 ...
文档注释 ...
'

# 单行注释
```
---



- **文件描述符**
```bash
#!/bin/bash

# 自动分配文件描述符并写入
exec {file1}> file1.txt
exec {file2}> file2.txt

echo "FD for file1: $file1"
echo "FD for file2: $file2"

echo "写入文件1" >&$file1
echo "写入文件2" >&$file2

# 关闭文件描述符
exec {file1}>&-
exec {file2}>&-
```
---



- **定制命令行编辑行为**
```shell
# 编辑 vim ~/.inputrc

# 基础设置
set editing-mode emacs
set bell-style none
set blink-matching-paren on

# 补全设置
set completion-ignore-case on
set show-all-if-ambiguous on
set mark-directories on
set mark-symlinked-directories on

# 彩色显示
set colored-stats on
set colored-completion-prefix on

# 历史设置
set history-size 10000

# 输入输出
set input-meta on
set output-meta on
set convert-meta off

# 键盘绑定
"\C-p": history-search-backward
"\C-n": history-search-forward
"\C-a": beginning-of-line
"\C-e": end-of-line
"\C-w": unix-word-rubout

# 8-bit 字符支持
set meta-flag on
set convert-meta off

# 添加配置后，重新登录或重新读取配置 bind -f ~/.inputrc
```
---

- **脚本调用**
    + 本地调用: bash test.sh 1 2 或者 cat test.sh|bash -s 1 2
    + 远程调用: curl -fsSL https://github.com/laazua/scripts/test.sh | bash -s 1 2


- **日志函数**
```bash
#!/bin/bash

xlog() {
    local message="$1"
    local level="${2:-INFO}"
    
    # 获取调用者信息
    local call_info
    if call_info=$(caller 0); then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $call_info - $message"
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] - $message"
    fi
}

process_data() {
    xlog "开始处理数据" "DEBUG"
    # 处理逻辑...
    xlog "数据处理完成" "DEBUG"
}

main() {
    xlog "程序启动"
    process_data
    xlog "程序结束"
}

main
```
---


- **字典模拟**
```bash
#!/bin/bash
#

## 方式一
ips=(
  "1 10.8.0.1"
  "2 10.8.0.2"  
)

for ip in "${ips[@]}";do
    set -- $ip
    echo key: $1 ++++ value: $2
done

## 方式二
declare -A hosts=(
  ["test"]="10.8.0.1"
  ["prod"]="10.8.0.2"
)
# 获取所有键
#echo "${!hosts[@]}"
# 获取所有值
#echo "${hosts[@]}"
for key in "${!hosts[@]}";do
    echo key: $key ++++ value: ${hosts[$key]}
done
```

- **bash常用参数**
```bash
## -c 执行字符串参数
bash -c "echo hello"
bash -c 'echo $1 $2' -- "12 58"
bash -c '
echo 123
echo 456
echo 789
'

## -x 调试模式
bash -x test.sh

## -n 脚本语法检查
bash -n test.sh

## -i 交互模式: bash -i

## -l | --login 登录shell: bash -l

## --posix POSIX模式
## POSIX模式下，bash会禁用一些扩展特性以符合标准

## --restricted 或 -r 受限模式
## 在受限模式下，某些操作如cd、修改环境变量等会被禁止
```

- **引号与数组**
```bash
# 数组和引号
files=("file1.txt" "file with spaces.txt" "file2.txt")

# 错误：不引用数组元素
for file in ${files[@]}; do
    echo "处理: $file"  # file with spaces.txt 会被分成三个词
done

# 正确：引用数组元素
for file in "${files[@]}"; do
    echo "处理: $file"  # 正确处理带空格的文件名
done

# 特殊参数在引号中的行为
set -- "arg one" "arg two" "arg three"
echo "所有参数 (@):"
printf '"%s"\n' "$@"
echo -e "\n所有参数 (*):"
printf '"%s"\n' "$*"
```
