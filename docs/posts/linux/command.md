##### 命令用法

- **getent**
```bash
# 查询Linux系统数据库条目信息
# 用法: getent database key
# 查看可用的database: getent --help
```

- **rsync**
```bash
rsync -av --exclude-from='exclude.txt' srcDir destDir
# 将 srcDir 路径中的文件同步到 destDir; 同步过程中排除exclude.txt中列出的文件或目录
```