##### uv项目管理工具

<pre>
  uv 是一款 python 项目依赖管理工具.
  不仅可以管理项目依赖包,还能管理项目依赖的 python 版本.
  并且 uv 在卸载包时,会连同对应包及其依赖一起卸载掉, 使项目的依赖极其清晰.
</pre>

- **使用示例**
```bash
# 初始化项目名为: demo
uv init demo && cd demo

# 添加依赖包
uv add flask

# 移除依赖包
uv remove flask

# 安装开发相关依赖
uv add mypy --dev

# 协作者使用以下命令同步环境,保持环境一致
uv sync

# uv run 可以运行当前项目上下文中包含的执行命令(包括依赖包中可以执行的命令)
# 使用依赖命令来运行已安装包中的可执行命令,django-admin是django包中的可执行命令
uv run django-admin startapp app_name
```

- **开发项目**
```bash
# 在实际开发项目中, 加入创建了app模块
# 当遇到开发的模块在本项目中导入报错: ModuleNotFoundError: No module named 'app'
## 解决方案
uv pip install -e .
```

- **部署项目**
```bash
# 1. 使用uv进行部署(需要安装uv)
uv sync --frozen --no-dev
uv run python -m app

# 2. 使用传统 pip 安装依赖进行部署
uv pip compile pyproject.toml -o requirements.txt     # 导出项目依赖
python -m pip install -r requirements.txt -t vendor   # 传统方式安装依赖
export PYTHONPATH=vendor && python -m app             # 设置依赖路径并运行
```