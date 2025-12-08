##### 安装

* **[主机初始化](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/important-system-configuration)**
    - /etc/security/limits.conf
    ```bash
    *    soft nofile  65536
    *    hard nofile  65536

    *    soft nproc   65536
    root soft nproc   unlimited
    ```
    - /etc/sysctl.d/99-sysctl.conf
    ```bash
    vm.max_map_count = 655360
    # 
    ```
    - 关闭交换分区

* **PEM模式 证书生成**
```bash
bin/elasticsearch-certutil ca --pem --out config/certs/ca.zip
unzip config/certs/ca.zip -d config/certs/
bin/elasticsearch-certutil cert --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key --ip nodeIp --dns localhost --out config/certs/node.zip --pem
unzip config/certs/node.zip -d config/certs/
bin/elasticsearch-certutil cert --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key --name client --pem --out config/certs/client.zip
unzip config/certs/client.zip -d config/certs
```

* **PEM模式 证书配置(ES 节点)**
```yaml
# 传输层SSL配置
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.key: /usr/local/elasticsearch-9.1.1/config/certs/instance/instance.key
xpack.security.transport.ssl.certificate: /usr/local/elasticsearch-9.1.1/config/certs/instance/instance.crt
xpack.security.transport.ssl.certificate_authorities: [/usr/local/elasticsearch-9.1.1/config/certs/ca/ca.crt]

### HTTP层SSL(可选,但推荐)
# 调试时,设置为false,生产环境请设置为true
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.key: /usr/local/elasticsearch-9.1.1/config/certs/instance/instance.key
xpack.security.http.ssl.certificate: /usr/local/elasticsearch-9.1.1/config/certs/instance/instance.crt
xpack.security.http.ssl.certificate_authorities: [/usr/local/elasticsearch-9.1.1/config/certs/ca/ca.crt]
```

* **PEM模式 证书配置(Kibana)**
```yaml
elasticsearch.username: "kibana_system"
elasticsearch.password: "t0EbTrroBKzIsbytd8C4"
elasticsearch.ssl.certificate: config/certs/client.crt
elasticsearch.ssl.key: config/certs/client.key
elasticsearch.ssl.certificateAuthorities: [ "config/certs/ca.pem" ]
```

* **PKCS#12 证书生成**
```bash
# ca 证书
bin/elasticsearch-certutil ca --out config/certs/ca.p12 --pass 123456
# 集群节点证书
bin/elasticsearch-certutil cert --ca config/certs/ca.p12 --ip nodeIP --dns localhost --out config/certs/node.p12
# 客户端证书
bin/elasticsearch-certutil cert --ca config/certs/ca.p12 --name client --out config/certs/client.p12
```
* **PKCS#12 证书配置(ES 节点)**
```yaml
# 集群节点配置
# 安全功能
xpack.security.enabled: true

# Transport 层 (节点间通信加密)
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: /usr/local/elasticsearch-9.1.1/config/certs/node.p12
xpack.security.transport.ssl.keystore.password: 123456
xpack.security.transport.ssl.truststore.path: /usr/local/elasticsearch-9.1.1/config/certs/ca.p12
xpack.security.transport.ssl.truststore.password: 123456

# HTTP 层 (客户端访问加密)
xpack.security.http.ssl.enabled: true
xpack.security.http.ssl.keystore.path: /usr/local/elasticsearch-9.1.1/config/certs/node.p12
xpack.security.http.ssl.keystore.password: 123456
xpack.security.http.ssl.truststore.path: /usr/local/elasticsearch-9.1.1/config/certs/ca.p12
xpack.security.http.ssl.truststore.password: 123456

# 客户端双向认证 (可选)
# xpack.security.http.ssl.client_authentication: required
```

* **PKCS#12 证书配置(Kibana)**
```yaml
elasticsearch.username: "kibana_system"
elasticsearch.password: "t0EbTrroBKzIsbytd8C4"
elasticsearch.ssl.certificateAuthorities: ["/config/certs/ca.p12"]
```

* **验证集群状态**
```bash
# 生成集群用户(记录输出的用户和密码)
bin/elasticsearch-setup-passwords auto
# 验证集群状态
curl -u elastic:RpXIqhQk3LF7wnFX0BYk 'https://192.168.165.84:9200/_cluster/health?pretty' -k config/certs/ca/ca.crt
```
