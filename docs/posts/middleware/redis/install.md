##### [Redis安装](https://redis.io/docs/latest/operate/oss_and_stack/install/build-stack/almalinux-rocky-9/)


* **源码安装**
```bash
# 最新稳定版本: curl -O https://download.redis.io/redis-stable.tar.gz
# 指定稳定版本: curl -O https://github.com/redis/redis/archive/refs/tags/<version>.tar.gz


### 安装依赖
sudo dnf install -y --nobest --skip-broken \
    pkg-config \
    xz \
    wget \
    which \
    gcc-toolset-13-gcc \
    gcc-toolset-13-gcc-c++ \
    git \
    make \
    openssl \
    openssl-devel \
    python3 \
    python3-pip \
    python3-devel \
    unzip \
    rsync \
    clang \
    curl \
    libtool \
    automake \
    autoconf \
    jq \
    systemd-devel

### 开始编译redis
# 1. 创建安装目录
sudo mkdir -p /usr/local/redis
# 2. 解压安装包
tar -xzf redis-stable.tar.gz && cd redis-stable
# 3. 设置环境变量
export BUILD_TLS=yes
export BUILD_WITH_MODULES=yes
export INSTALL_RUST_TOOLCHAIN=yes
export DISABLE_WERRORS=yes
# 4. 开始编译
sudo make -j "$(nproc)" all
# 5. 编译打包
sudo make PREFIX=/usr/local/redis install
```