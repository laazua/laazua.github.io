---
prev: false
next: false
---

### saltstack
---

##### 源码安装
```bash
# 安装依赖
dnf install -y gcc git python3-devel

# 下载源码
git clone --depth https://github.com/saltstack/salt.git

# 安装到指定路径
## master节点
cd salt
python3 -m pip install . -t /opt/app/salt-master/lib
python3 -m pip install -r requirements/zeromq.txt -t /opt/app/salt-master/lib
cp conf/master /opt/app/salt-master/master.yml
SALTHOME=/opt/app/salt-master; export PATH=$PATH:$SALTHOME/lib/bin
## 安装minion节点
python3 -m pip install . -t /opt/app/salt-minion/lib
python3 -m pip install -r requirements/zeromq.txt -t /opt/app/salt-minion/lib
mkdir /opt/app/salt-minion/confgs && cp conf/minion /opt/app/salt-minion/configs/minion
SALTHOME=/opt/app/salt-minion; export PATH=$PATH:$SALTHOME/lib/bin

# 修改 master 配置: /opt/app/salt-master/master.yml
# 修改 minion 配置： /opt/app/salt-minion/configs/minion
```

##### systemd 配置
::: code-group
```bash [master]
[Unit]
Description=The Salt Master Server
Documentation=man:salt-master(1) file:///usr/share/doc/salt/html/contents.html https://docs.saltproject.io/en/latest/contents.html
After=network.target

[Service]
LimitNOFILE=100000
Type=notify
NotifyAccess=all
User=root
Group=root
Environment="SALTHOME=/opt/app/salt-master"
Environment="PYTHONPATH=/opt/app/salt-master/lib"
ExecStart=/usr/bin/salt-master -c ${SALTHOME}/master.yml

[Install]
WantedBy=multi-user.target
```
``` bash [minion]
[Unit]
Description=The Salt Minion
Documentation=man:salt-minion(1) file:///usr/share/doc/salt/html/contents.html https://docs.saltproject.io/en/latest/contents.html
After=network.target salt-master.service

[Service]
KillMode=process
Type=notify
NotifyAccess=all
LimitNOFILE=8192
User=root
Group=root
Environment="PYTHONPATH=/opt/app/salt-minion/lib"
ExecStart=/opt/app/salt-minion/lib/bin/salt-minion -c /opt/app/salt-minion/configs

[Install]
WantedBy=multi-user.target
```
:::