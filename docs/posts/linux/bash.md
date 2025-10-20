##### bash语法

- **文档注释**
```bash
: << DOC
文档注释
DOC
```

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