##### bash语法(man bash)

- **文档注释**
```bash
: '
文档注释
'
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



- **日志函数**
```bash
#!/bin/bash

log() {
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
    log "开始处理数据" "DEBUG"
    # 处理逻辑...
    log "数据处理完成" "DEBUG"
}

main() {
    log "程序启动"
    process_data
    log "程序结束"
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


