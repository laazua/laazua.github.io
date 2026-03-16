---
prev: false
next: false
---
### kubeadm安装集群

---
##### 说明
> 具体安装细则参考官网

---
##### 实际安装的大致过程如下(rockylinux为例)
> 节点初始化

- *安装必要软件*
```bash
sudo dnf install -y tar.x86_64 wget.x86_64
```

---
- *设置节点 hostname*
```bash
# master节点: 192.168.165.80
sudo hostnamectl set-hostname k8s-master

# worker节点: 192.168.165.81
sudo hostnamectl set-hostname k8s-node-01
# worker节点: 192.168.165.82
sudo hostnamectl set-hostname k8s-node-02
```

---
- *配置节点 /etc/hosts*
```text
182.168.165.80 k8s-master
192.168.165.81 k8s-node-01
192.168.165.82 k8s-node-02
```

---
- *关闭节点交换分区*
```bash
# 临时关闭
sudo swapoff -a

# 永久关闭
# sudo vim /etc/fstab
# 注释 交换分区
```

---
- *关闭节点SELINUX*
```bash
# 临时关闭
sudo setenforce 0

# 永久关闭
sudo sed -i 's|SELINUX=enforcing|SELINUX=disable|g' /etc/selinux/config
```

---
 *节点安装 kubeadm kubelet kubectl*
```bash
# 配置源
sudo cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.35/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
EOF

# 配置yum代理(配置自己的代理)
echo "proxy=http://192.168.165.89:8080" >>/etc/yum.conf

# 安装: kubeadm kubelet kubectl
sudo dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
sudo systemctl enable --now kubelet
```

---
- *安装容器运行时 containerd*
```bash
# 启用 IPv4 数据包转发
sudo cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF
sudo sysctl --system
sysctl net.ipv4.ip_forward

# 下载containerd安装包
wget https://github.com/containerd/containerd/releases/download/v2.2.2/containerd-2.2.2-linux-amd64.tar.gz 
sudo tar -xf containerd-2.2.2-linux-amd64.tar.gz -C /usr/local/

# 添加service配置
sudo cat <<EOF | sudo tee /usr/lib/systemd/system/containerd.service
# Copyright The containerd Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

[Unit]
Description=containerd container runtime
Documentation=https://containerd.io
After=network.target dbus.service

[Service]
ExecStartPre=-/sbin/modprobe overlay
ExecStart=/usr/local/bin/containerd

Type=notify
Delegate=yes
KillMode=process
Restart=always
RestartSec=5

# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNPROC=infinity
LimitCORE=infinity

# Comment TasksMax if your systemd version does not supports it.
# Only systemd 226 and above support this version.
TasksMax=infinity
OOMScoreAdjust=-999

[Install]
WantedBy=multi-user.target
EOF

# 安装 runc
wget -O https://github.com/opencontainers/runc/releases/download/v1.4.1/runc.amd64
sudo install -m 755 runc.amd64 /usr/local/sbin/runc

# 安装 cni
mkdir -p /opt/cni/bin
wget https://github.com/containernetworking/plugins/releases/download/v1.9.0/cni-plugins-linux-amd64-v1.9.0.tgz
sudo tar -xvf cni-plugins-linux-amd64-v1.9.0.tgz -C /opt/cni/bin/
```

---
- *根据官网配置 containerd*
```bash 
sudo mkdir /etc/containerd
sudo containerd config default >/etc/containerd/config.toml
```

---
- *修改 /etc/containerd/config.toml*
```text
Containerd 1.x 版本：

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
Containerd versions 2.x 版本：

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true

重载沙箱（pause）镜像:

[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
  ...
```

---
- *重启 containerd*
```bash
sudo systemctl enable containerd
sudo systemctl restart containerd
```

---
- *初始化 master 节点*
```bash
# 在其中一台master节点上执行(lb.controller.plane.cn为负载均衡的地址)
sudo kubeadm init \
  # 这里设置集群入口负载均衡(高可用master节点使用)
  # --control-plane-endpoint "lb.controller.plane.cn:8443"  \
  --upload-certs \
  --pod-network-cidr=10.244.0.0/16 \
  --cri-socket unix:///run/containerd/containerd.sock \
  --image-repository registry.aliyuncs.com/google_containers
```

---
- *新增 worker 节点*
```bash
# 获取加入节点命令
sduo kubeadm token create --print-join-command

# 在worker节点执行上面加入节点命令的输出
sudo kubeadm join 192.168.165.80:6443 --token kdlzmi.x5gzuqz04ysv6a7r --discovery-token-ca-cert-hash sha256:06f709aca33059b440e136966048a28cf807b13afd2b32f031f29b25766dea2b
```

---
- *重置节点重新初始化*
```bash
# 重置节点
sudo kubeadm reset

# master节点获取加入节点命令
sduo kubeadm token create --print-join-command

# 在重置节点上执行上面加入节点命令
sudo kubeadm join 192.168.165.80:6443 --token gq1kor.upo4txcr12koq8w1 --discovery-token-ca-cert-hash sha256:06f709aca33059b440e136966048a28cf807b13afd2b32f031f29b25766dea2b
```

---
- *安装 cilium*
```bash
# 在操作节点上配置$HOME/.kube/confg后安装helm

# 先安装openssl
sudo dnf search openssl

# 安装 helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash
helm repo add cilium https://helm.cilium.io
helm pull cilium/cilium

# 安装 CRD 参考: https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/#gs-gateway-api
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.4.1/config/crd/standard/gateway.networking.k8s.io_gatewayclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.4.1/config/crd/standard/gateway.networking.k8s.io_gateways.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.4.1/config/crd/standard/gateway.networking.k8s.io_httproutes.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.4.1/config/crd/standard/gateway.networking.k8s.io_referencegrants.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/gateway-api/v1.4.1/config/crd/standard/gateway.networking.k8s.io_grpcroutes.yaml

# 安装 cilium
helm install cilium cilium/cilium -n kube-system
```

---
- *查看集群状态*
```bash
kubectl get node
```

---
- *部署 nginx-gateway*
```bash
# https://github.com/nginx/nginx-gateway-fabric
helm install ngf oci://ghcr.io/nginx/charts/nginx-gateway-fabric --create-namespace -n nginx-gateway --set nginx.service.type=NodePort
```

---
- *k8s集群部署应用示例*
::: code-group
```yaml [资源清单]
---
# Pod
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
  namespace: default
  labels:
    app: my-app
    version: v1
spec:
  containers:
  - name: app-container
    image: confucuis/app:v1
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 8088
      name: http
    env:
    - name: APP_VERSION
      value: "v1"
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
    livenessProbe:
      httpGet:
        path: /api/hello
        port: 8088
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /api/hello
        port: 8088
      initialDelaySeconds: 20
      periodSeconds: 5

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: app-service
  namespace: default
  labels:
    app: my-app
spec:
  selector:
    app: my-app
    version: v1
  ports:
  - name: http
    port: 80
    targetPort: 8088
    protocol: TCP
  type: ClusterIP

---
# Gateway
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: app-gateway
  namespace: default
spec:
  gatewayClassName: nginx
  listeners:
  - name: http
    protocol: HTTP
    port: 80
    allowedRoutes:
      namespaces:
        from: Same

---
# HTTPRoute
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: app-http-route
  namespace: default
spec:
  parentRefs:
  - name: app-gateway
    namespace: default
  hostnames:
  - "app.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: app-service
      port: 80
```

```bash [部署验证]
# 部署应用
kubectl apply -f example.yaml

# 查看应用网关入口
kubectl get gateway app-gateway

# 集群节点执行并验证
curl -H "Host: app.example.com" http://<ADDRESS>/api/hello
curl -XPOST -H "Host: app.example.com" http://<ADDRESS>/api/say/zhangsan
```