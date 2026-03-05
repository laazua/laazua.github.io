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

- **uv下载和安装离线包**
    + uv python 安装 pip 包: 
    ```bash
    uv run python -m ensurepip
    ```
    + 使用 uv 生成 requirements.txt(或者requirements.lock):
    ```bash
    uv pip freeze > requirements.txt
    # 生成精准依赖锁文件: 
    # uv pip compile pyproject.toml -o requirements.lock
    ```
    + 下载依赖包到离线依赖包路径(deps/)：
    ```bash
    uv run python -m pip download -d deps/ -r requirements.txt
    # 或者使用精准依赖锁文件: 
    # uv run python -m pip download -d deps/ -r requirements.lock
    ```
    + 安装离线目录依赖到指定的路径：
    ```bash
    uv run python -m pip install --no-index --find-links deps/ -t vendor -r requirements.txt
    # 或者使用精准依赖锁文件: 
    # uv run python -m pip install --no-index --find-links deps/ -t vendor -r requirements.lock
    ```

---

- **[astral-sh/ty](https://github.com/astral-sh/ty)**
    + VScode插件市场安装

- **[astral-sh/ruff](https://github.com/astral-sh/ruff)**
    + uv add ruff --dev

---

### uv workspace示例

- **项目初始化**
```bash
# 创建项目
mkdir monorepo && cd monorepo
# 初始化项目
uv init --python 3.12
```

- **项目布局**
```bash
# 第一步: 修改根目录: monorepo/pyproject.toml
: <'EOF'

[project]
name = "monorepo"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.12"
dependencies = []


[tool.uv.workspace]
# 正确格式：使用数组的数组
members = [
    "apps/*",
    "libs/*",
]

EOF

# 第二步: 项目模块布局, 与上面 members 对应
uv init --app apps/web-app
uv init --app apps/cli-tool
uv init --lib libs/shared-utils
```

- **项目模块添加依赖**
```bash
# workspace 成员: web-app 添加 fastapi,uvicorn 依赖
uv add fastapi uvicorn --package web-app
# workspace 成员: cli-tool 添加 click 依赖
uv add click --package cli-tool

# 建立内部库的依赖关系：假设 web-app 需要使用我们刚刚创建的 shared-utils 库
# 可以像添加外部依赖一样添加它
uv add shared-utils --package web-app
```

- **workspace其他操作**
```bash
# 同步环境：在项目根目录运行以下命令，uv 会创建一个全局的虚拟环境 (.venv)，并根据 uv.lock 文件安装所有成员的所有依赖
uv sync --all-packages

# 运行特定应用：使用 uv run 加上 --package 参数来执行某个应用的入口文件
# 假设 web-app 的入口文件是 apps/web-app/src/web_app/main.py
uv run --package web-app python -m web_app.main

# 构建 shared-utils 库
uv build --package shared-utils

# 构建 web-app 应用
uv build --package web-app
```

- **项目最终结构**
```text
monorepo/
├── apps
│   ├── cli-tool
│   │   ├── main.py
│   │   ├── pyproject.toml
│   │   └── README.md
│   └── web-app
│       ├── main.py
│       ├── pyproject.toml
│       └── README.md
├── libs
│   └── shared-utils
│       ├── pyproject.toml
│       ├── README.md
│       └── src
│           └── shared_utils
│               ├── __init__.py
│               └── py.typed
├── main.py
├── pyproject.toml
├── README.md
└── uv.lock
```