##### module 代码示例

- **项目结构**
```text
hello/
├── pom.xml                        # 父 POM
├── hello-api/
│   ├── pom.xml
│   └── src/main/java/
│       ├── module-info.java
│       └── com/example/api/HelloService.java
│
├── hello-impl/
│   ├── pom.xml
│   └── src/main/java/
│       ├── module-info.java
│       └── com/example/impl/HelloServiceImpl.java
│
└── hello-app/
    ├── pom.xml
    └── src/main/java/
        ├── module-info.java
        └── com/example/app/AppMain.java
```
---
- **父模块 pom.xml**
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>hello</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <modules>
        <module>hello-api</module>
        <module>hello-impl</module>
        <module>hello-app</module>
    </modules>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

</project>
```
---
- **API 模块：hello-api/pom.xml**
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>hello</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>hello-api</artifactId>
</project>
```

- src/main/java/com/example/api/HelloService.java
```java
package com.example.api;

public interface HelloService {
    String sayHello(String name);
}
```

- src/main/java/module-info.java
```java
module com.example.api {
    exports com.example.api;
}
```

---

- **实现模块：hello-impl/pom.xml**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>hello</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>hello-impl</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>hello-api</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>
</project>
```

- src/main/java/com/example/impl/HelloServiceImpl.java
```java
package com.example.impl;

import com.example.api.HelloService;

public class HelloServiceImpl implements HelloService {
    @Override
    public String sayHello(String name) {
        return "Hello, " + name + " (from Impl)";
    }
}
```

- src/main/java/module-info.java
```java
module com.example.impl {
    requires com.example.api;
    provides com.example.api.HelloService with com.example.impl.HelloServiceImpl;
}
```

---

- **应用模块：hello-app/pom.xml**
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.example</groupId>
        <artifactId>hello</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>hello-app</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>hello-api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.example</groupId>
            <artifactId>hello-impl</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- 用 exec 插件运行主类 -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.2.0</version>
                <configuration>
                    <mainClass>com.example.app.AppMain</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

- src/main/java/com/example/app/AppMain.java
```java
package com.example.app;

import com.example.api.HelloService;
import java.util.ServiceLoader;

public class AppMain {
    public static void main(String[] args) {
        ServiceLoader<HelloService> loader = ServiceLoader.load(HelloService.class);
        for (HelloService service : loader) {
            System.out.println(service.sayHello("World"));
        }
    }
}
```

- src/main/java/module-info.java
```java
module com.example.app {
    requires com.example.api;
    uses com.example.api.HelloService;
}
```
