##### 项目组织

<pre>
  根据具体情况使用 go mod & go work 组合方式来组织代码
</pre>


- **示例**

```bash
# 创建项目sds并初始化
mkdir sds && cd sds && go work init

# 创建模块所需的目录
mkdir {user,order,payment}

# 初始化用户模块
cd user/ && go mod init user
# 初始化订单模块
cd order/ && go mod init order
# 初始化支付模块
cd payment/ && go mod init payment

# 将模块添加到workspace
go work use ./user ./order ./payment

# 如果 order模块 依赖 user模块; 则使用如下命令进行依赖设置
# cd order && go mod edit -require user@v0.0.0 && go mod tidy
```

- **项目结构**
```text
sds/
├── go.work
├── order
│   └── go.mod
├── payment
│   └── go.mod
└── user
    └── go.mod
```

- **升级项目GO版本**
```shell
# 1. 更新go版本
# 2. vscode 更新 go tools: ctrl + shift + p && Go Install && Update Tools
# 3. 重启vscode
# 4. 更新 go.mod 文件: go mod edit -go=1.25.3
```