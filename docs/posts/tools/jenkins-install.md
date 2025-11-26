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
#!/bin/bash

### run.sh
### Jenkins 服务运行管理脚本

set -e

http_port=8080


cd "$(dirname $0)" || exit

_start() {
  if [ -f pid.txt ];then
    echo 'Jenkins 服务已经启动 ...'
    exit
  fi

  export JENKINS_HOME=/opt/app/jenkins

  nohup java -jar jenkins.war \
	-Djava.awt.headless=true \
	--javaHome=/usr/local/jdk-21.0.9 \
	--prefix=/jenkins \
	--httpPort=$http_port \
	--webroot=./war >jenkins.log 2>&1 &
  
  echo "服务启动中 ..." && sleep 5

  ps aux|grep jenkins.war| grep -v grep|awk '{print $2}' >./pid.txt
}

_shutdown() {
  if [ ! -f pid.txt ];then
    echo "Jenkins 服务已经关闭 ..."
    exit
  fi

  local pid=$(cat pid.txt)
  echo "$pid" | grep -qE '^[0-9]+$' && kill $pid && sleep 3 && rm pid.txt && echo "关闭 Jenkins 服务成功"
}

_check() {
  if [ -f pid.txt ];then
    echo 'Jenkins 服务运行中 ...'
  else
    echo 'Jenkins 服务已关闭 ...'
  fi
}

case $1 in
  'start')
    _start
    ;;
  'shutdown')
    _shutdown
    ;;
  'check')
    _check
    ;;
  *)
    echo "Usage: $0 [start|shutdown|check]"
    echo "        start    启动"
    echo "        shutdown 关闭"
    echo "        check    检查"
esac
```
---

- **防火墙规则**
1. 放行端口规则