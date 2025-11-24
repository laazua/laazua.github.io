##### 共享库

- **[代码结构](https://gitee.com/laazua/sharedlibs.git)**
```text
sharedlib/
├── entrypoint                           # 流水线入口文件目录
│   └── show.jenkinsfile
├── README.md
├── resources                            # 配置以及shell和python脚本目录
│   ├── config.yaml
│   ├── scripts
│   │   ├── build.sh
│   │   └── request.py
│   └── show.properties
├── src                                  # 共享库源码目录,可以复用的代码逻辑
│   └── com
│       └── laazua
│           └── lib
│               └── Properties.groovy
└── vars                                 # 全局变量与步骤（无需类即可直接被 Pipeline 调用）
    └── LoadPipeline.groovy

```

- **所需插件**
  + gitee
  + Global Pipeline Libraries
  + pipeline stage view
  + Pipeline Utility Steps
  + AnsiColor

- **系统配置**
  + [全局共享库配置](https://www.jenkins.io/zh/doc/book/pipeline/shared-libraries/)
  + 配置共享库认证密钥,用于拉取共享库代码
  + 安装jenkins服务的主机要安装git

- **仓库分支**
  + 共享库的仓库代码需要一个分支(如： test)
  + git switch -c BranchName
  + git push --set-upstream origin BranchName
  