---
title: 模块化编程
prev:
    text: Springboot初始化项目
    link:  /posts/language/java/springboot
next:
    text: 运行时优化
    link: /posts/language/java/runtime
---

##### 模块化编程


- **module-info.java**
```java
module com.example.app {
    requires com.example.api;                   // 普通依赖
    requires transitive java.sql;               // 传递依赖
    requires static lombok;                     // 编译期依赖

    exports com.example.app.api;                // 导出包
    exports com.example.app.internal to com.example.test; // 仅导出给指定模块

    opens com.example.app.model;                // 允许反射
    opens com.example.app.entity to spring.core, jackson.databind; // 有选择地开放反射

    uses com.example.api.HelloService;          // 使用服务接口
    provides com.example.api.HelloService       // 提供服务实现
        with com.example.impl.HelloServiceImpl;
}
```

- **常用指令**

| 指令                    | 作用                 | 基本语法                          | 说明                                                         | 示例                                                                              |
| --------------------- | ------------------ | ----------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `module`            | 定义模块名              | `module <模块名> { ... }`        | 声明当前源代码属于哪个模块。模块名通常与包名类似（反向域名规则）。                          | `module com.example.app {}`                                                     |
| `open module`         | 定义**开放模块**         | `open module <模块名> { ... }`   | 将模块中的所有包都默认对**反射访问**开放（如 JSON 序列化、Spring、JPA 反射）。          | `open module com.example.model {}`                                              |
| `requires`            | 声明模块依赖             | `requires <模块名>;`             | 表示当前模块依赖另一个模块的导出包。                                         | `requires com.example.api;`                                                     |
| `requires transitive` | 传递依赖               | `requires transitive <模块名>;`  | 如果模块 A `requires transitive B`，那么依赖 A 的模块也自动依赖 B。          | `requires transitive java.sql;`                                                 |
| `requires static`     | 可选依赖（编译时可用，运行时可缺失） | `requires static <模块名>;`      | 用于编译时引用但运行时非必须的模块（常见于注解或日志框架）。                             | `requires static lombok;`                                                       |
| `exports`             | 导出包（供其他模块使用）       | `exports <包名>;`               | 允许其他模块访问该包内公开类。                                            | `exports com.example.api;`                                                      |
| `exports ... to`      | 有选择地导出包            | `exports <包名> to <模块名列表>;`    | 仅允许指定模块访问此包。                                               | `exports com.example.internal to com.example.test;`                             |
| `opens`               | 打开包供反射访问           | `opens <包名>;`                 | 允许反射（如 `Class.forName()` 或 Jackson）访问该包内成员，但不等于 `exports`。 | `opens com.example.entity;`                                                     |
| `opens ... to`        | 有选择地开放反射访问         | `opens <包名> to <模块名列表>;`      | 仅对指定模块开放反射访问。                                              | `opens com.example.entity to spring.core,hibernate.core;`                       |
| `uses`                | 声明当前模块使用某个服务接口     | `uses <服务接口全名>;`              | 用于 `ServiceLoader` 发现服务实现。                                 | `uses com.example.api.HelloService;`                                            |
| `provides ... with`   | 注册服务实现             | `provides <接口> with <实现类列表>;` | 声明该模块提供某接口的实现。                                             | `provides com.example.api.HelloService with com.example.impl.HelloServiceImpl;` |


- **[封装示例](./module-code.md)**