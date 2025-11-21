##### 安装

- **依赖库**
1. sudo dnf install freetype
2. sudo dnf install fontconfig
---

- **jdk安装**
1. curl -O https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz
2. tar -xf jdk-21_linux-x64_bin.tar.gz  -C /usr/local
3. jdk环境变量配置: vim /etc/profile.d/java21.sh
```bash
JAVA_HOME=/usr/local/jdk-21.0.9/
export CLASSPATH=.:$JAVA_HOME/lib
export PATH=$PATH:$JAVA_HOME/bin
```
---

- **jenkins.war安装**
1. 官网下载jenkins.war
2. java -jar jenkins.war --help 查看帮助信息
3. 运行jenkins.war
```bash
java -jar jenkins.war -Djava.awt.headless=true -DJENKINS_HOME=/opt/app/jenkins --javaHome=/usr/local/jdk-21.0.9 --prefix=/jenkins --webroot=./war
```
---

- **防火墙规则**
1. 放行端口规则