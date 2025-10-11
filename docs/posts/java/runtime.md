##### Runtime

- **定制jre**
```shell
# JDK8 以后使用下面命令定制jre
someone@debian:~$ $JAVA_HOME/bin/jlink \
  --module-path $JAVA_HOME/jmods \
  --add-modules java.base,java.logging,java.sql \
  --output jre
## 其中 --add-modules 可以添加需要的模块
```

- **瘦身jar**
> 分析jar文件内容: jar tf target/app.jar  
> 整理jar包中不需要的内容(参考:jar-slim.sh)

| 类型         | 示例                                         | 是否排除      |
| ---------- | ------------------------------------------ | --------- |
| 测试类        | `*Test.class`, `*Tests.class`              | ✅         |
| 示例包        | `**/example/**`, `**/samples/**`           | ✅         |
| IDE配置      | `.idea/`, `*.iml`                          | ✅         |
| Maven 元数据  | `META-INF/maven/**`                        | ✅（非运行时必要） |
| 签名文件       | `META-INF/*.RSA`, `META-INF/*.SF`          | ✅         |
| 配置文件（开发环境） | `application-dev.yml`, `logback-test.xml`  | ✅         |
| 构建元数据      | `META-INF/INDEX.LIST`, `LICENSE`, `NOTICE` | 可选排除      |

> [瘦身脚本jar-slim.sh](runtime-jar.md)  

- **启动参数**
> [启动参数优化](runtime-optimized.md)