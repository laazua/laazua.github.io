##### python项目启动设置

- **源码部署**
1. 将源码部署到指定服务器上
2. 根据项目依赖文件将三方库安装到项目根目录的vendor目录(如: python -m pip install -r requirements.txt -t vendor)

- **启动项目**
1. 环境变量设置
```shell
export PYTHONOPTIMIZE=1
export PYTHONDONTWRITEBYTECODE=1
export PYTHONNOUSERSITE=1
export PYTHONUTF8=1
export PYTHONHASHSEED=0
export PYTHONWARNINGS=ignore
export PYTHONPATH=vendor/
# python --help-all 查看所有启动优化配置
```
2. python -m app