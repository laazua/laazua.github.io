##### Docker基础

- **指令语法**
> 构建阶段  

| 指令             | 语法                                                                        | 说明                                                     |
| -------------- | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| **FROM**       | `FROM <image>[:<tag>] [AS <name>]`<br>`FROM <image>@<digest> [AS <name>]` | 指定基础镜像，可命名为阶段别名以支持多阶段构建。                               |
| **ARG**        | `ARG <name>[=<default>]`                                                  | 定义构建时变量。若在 `FROM` 之前声明，可用于动态选择基础镜像。                    |
| **RUN**        | `RUN <command>` 或 `RUN ["executable","param1",...]`                       | 执行命令并创建新层。建议使用 `&&` 合并命令并清理缓存文件。                       |
| **SHELL**      | `SHELL ["executable","parameters"]`                                       | 定义 RUN、CMD、ENTRYPOINT 的默认 shell。Linux 默认 `/bin/sh -c`。 |
| **ONBUILD**    | `ONBUILD <INSTRUCTION>`                                                   | 为派生镜像设置“触发指令”。仅在基础镜像被继承时触发。                            |
| **COPY**       | `COPY [--chown=<user>:<group>] [--from=<stage>] <src>... <dest>`          | 从构建上下文或其他阶段复制文件。`--from` 可跨阶段取文件。                      |
| **ADD**        | `ADD [--chown=<user>:<group>] <src>... <dest>`                            | 功能类似 COPY，但支持压缩包自动解压及远程 URL 下载。                        |
| **LABEL**      | `LABEL <key>=<value> [<key>=<value> ...]`                                 | 添加元数据（镜像作者、版本、描述等）。取代旧版 `MAINTAINER`。                  |
| **MAINTAINER** | `MAINTAINER <name>`                                                       | 已废弃，建议使用 `LABEL maintainer=...` 替代。                    |

> 上下文配置  

| 指令             | 语法                                             | 说明                             |
| -------------- | ---------------------------------------------- | ------------------------------ |
| **ENV**        | `ENV <key>=<value> [<key>=<value> ...]`        | 设置环境变量。可用于后续指令与容器运行时。          |
| **WORKDIR**    | `WORKDIR <path>`                               | 设置工作目录，不存在时自动创建。支持多次嵌套使用。      |
| **USER**       | `USER <user>[:<group>]` 或 `USER <uid>[:<gid>]` | 指定后续命令与容器运行时使用的用户。             |
| **VOLUME**     | `VOLUME ["/path"]` 或 `VOLUME <path>`           | 声明挂载点（数据卷）。容器运行时自动创建卷。         |
| **EXPOSE**     | `EXPOSE <port>[/<protocol>]`                   | 声明容器监听的端口（仅文档用途，不实际绑定）。        |
| **ARG**        | `ARG <name>[=<default>]`                       | 构建时变量，也可用于条件性控制逻辑。             |
| **STOPSIGNAL** | `STOPSIGNAL <signal>`                          | 设置容器接收停止请求时使用的信号（如 `SIGTERM`）。 |

> 运行时行为  

| 指令              | 语法                                                                                | 说明                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **CMD**         | `CMD ["executable","param1",...]`<br>`CMD ["param1",...]`<br>`CMD command param1` | 定义容器启动时默认命令或参数。仅最后一个 CMD 生效。                                                                                                          |
| **ENTRYPOINT**  | `ENTRYPOINT ["executable","param1",...]`<br>`ENTRYPOINT command param1`           | 设置容器主命令。可与 CMD 联合使用（CMD 提供默认参数）。                                                                                                      |
| **HEALTHCHECK** | `HEALTHCHECK [OPTIONS] CMD <command>`<br>`HEALTHCHECK NONE`                       | 设置健康检查命令。`OPTIONS` 支持：<br>• `--interval=<duration>`<br>• `--timeout=<duration>`<br>• `--start-period=<duration>`<br>• `--retries=<n>` |
| **STOP SIGNAL** | `STOPSIGNAL SIGTERM`                                                              | 定义容器终止信号（默认 SIGTERM）。                                                                                                                 |
| **SHELL**       | `SHELL ["executable","param1","param2"]`                                          | 定义容器内部默认命令解释器。                                                                                                                        |
