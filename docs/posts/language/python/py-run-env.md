##### Python 项目启动设置

- **源码部署**
1. 将源码部署到指定服务器上
2. 根据项目依赖文件将三方库安装到项目根目录的vendor目录(如: python -m pip install -r requirements.txt -t vendor)

- **启动项目**
1. 环境变量设置
```shell
### 开发时保持默认即可,也可以根据情况进行调整

# 性能优化类
export PYTHONOPTIMIZE=1           # (-O|-OO)启用基本优化,移除assert语句,可进一步设置为 2
export PYTHONDONTWRITEBYTECODE=1  # (-B)不生成.pyc文件,减少磁盘IO
export PYTHONNOUSERSITE=1         # (-s)忽略用户site-packages,确保环境一致性

# 编码与IO
export PYTHONUTF8=1               # 强制使用UTF-8编码
export PYTHONUNBUFFERED=1         # (-u)无缓冲输出，便于日志收集
export PYTHONIOENCODING=UTF-8

# 安全与稳定性
export PYTHONHASHSEED=random      # 使用随机哈希种子，提高安全性
export PYTHONWARNINGS=ignore      # (-W)忽略警告，减少日志噪音
export PYTHONFAULTHANDLER=1       # 崩溃时打印堆栈跟踪，便于调试

# 内存与资源管理
export PYTHONMALLOC=malloc        # 使用系统malloc，避免内存碎片

# 路径隔离, 应根据实际项目结构调整
export PYTHONPATH="/app/vendor:/app/src"

# python --help-all 查看所有启动优化配置
```
2. > python -m app 根据模块启动项目(实现app/__main__.py模块)