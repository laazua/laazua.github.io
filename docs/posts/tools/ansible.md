---
title: Ansible
prev:
    text: RockyLinux
    link:  /posts/linux/rocky
next:
    text: Pyinfra
    link: /posts/tools/pyinfra
---

##### ansible

<pre>
  一款声明式配置管理工具, 提供强大的配置管理能力.
</pre>

- **主要组成**

| 组件              | 描述                            |
| --------------- | ----------------------------- |
| **[Inventory](./ansible-inventory.md)**   | 定义主机、组、变量                     |
| **Modules**     | 完成实际操作的逻辑单元（如 yum、copy、user ） |
| **Tasks**       | 调用模块的最小操作步骤                   |
| **Play**        | 一组任务作用于一组主机                   |
| **Playbook**    | 多个 play 的集合                   |
| **Facts**       | 主机系统信息，自动收集                   |
| **Roles**       | 可复用的结构化目录                     |
| **Plugins**     | 功能扩展                          |
| **Collections** | Ansible 的包管理单元                |
| **Jinja2 模板核心语法**| 模板支持复杂逻辑，但应保持轻量，复杂逻辑放 role|

- **变量系统<变量层级从低到高>**
  + Role defaults
  + Inventory group vars
  + Inventory host vars
  + Play vars
  + Task vars
  + Extra vars（优先级最高）