##### springboot

- **命令行初始化项目**
    1. 配置项目(config.json)
    ```json
    {
        "groupId": "com.mycompany",
        "artifactId": "auth-service",
        "name": "auth-service",
        "description": "Authentication Service",
        "packageName": "com.mycompany.auth",
        "dependencies": ["web", "security", "data-redis", "validation"],
        "type": "gradle-project-kotlin",  // 支持: maven-project,gradle-project
        "javaVersion": "17",
        "version": "1.0.0"
    }
    ```
    2. 初始化项目
    ```bash
    curl -H "Content-Type: application/json" \
         -X POST \
         -d @config.json \
         https://start.spring.io/starter.zip \
         -o auth-service.zip
    ```
    3. 可用配置查询
    ```bash
    # 查看所有可用选项
    curl -H 'Accept: application/json' https://start.spring.io|jq
    # 查看依赖列表
    curl -H 'Accept: application/json' https://start.spring.io/dependencies|jq
    # 查看支持的Spring Boot版本
    curl -H 'Accept: application/json' https://start.spring.io/boot-versionsjq
    ```

- **gradle初始化项目**
    1. 初始化项目
    ```bash
    gradle init --type java-application --dsl kotlin --package cn.company.order
    ```
    2. 添加依赖
    ```kotlin
    // build.gradle.kts
    dependencies {
        implementation("org.apache.commons:commons-lang3:3.14.0")
    }
    // gradle build
    ```
    3. 锁定版本
    ```bash
    gradle dependencies --write-locks
    ```
    4. 清理未使用的依赖
    ```bash
    gradle buildHealth
    ```
    配合配置
    ```kotlin
    plugins {
        id("com.autonomousapps.dependency-analysis") version "1.29.0"
    }
    ```
    4. 配置仓库
    ```kotlin
    repositories {
        maven("https://maven.aliyun.com/repository/public")
        mavenCentral()
    }
    ```
