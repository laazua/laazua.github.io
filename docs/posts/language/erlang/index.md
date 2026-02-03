---
title: Erlang语言
prev:
    text: 
    link:
next:
    text:
    link:
---

##### Erlang

- otp安装
```bash
## 直接下载预编译包: wget https://erlang.org/download/otp_src_28.3.tar.gz
## 解压设置PATH即可使用erlang

# 下载 otp源码
wget https://github.com/erlang/otp/archive/refs/tags/OTP-28.3.tar.gz
# 源码安装otp
tar -xf OTP-28.3.tar.gz -C /opt/
cd /opt/otp-OTP-28.3/
export ERL_TOP=`pwd`
./configure   --prefix=/usr/local/erlang-28.3-min   --without-wx   --without-observer   --without-debugger   --without-et   --without-termcap
make -j$(nproc)
make install
```

- [asdf安装](./asdf.md)

- rebar3安装
```bash
wget https://s3.amazonaws.com/rebar3/rebar3
mv rebar3 /usr/local/bin/
chmod +x /usr/local/bin/rebar3
```

- rebar3初始化项目
```bash
## 新建项目 hello
rebar3 new app hello
## 项目结构如下:
# hello/
# ├── LICENSE.md
# ├── README.md
# ├── rebar.config
# └── src
#     ├── hello_app.erl
#     ├── hello.app.src
#     └── hello_sup.erl
```

- 配置独立部署属性
```erlang
%% hello/rebar.config
{erl_opts, [debug_info]}.
{deps, []}.

{shell, [
    %% {config, "config/sys.config"},
    {apps, [hello]}
]}.
%% 配置后目标机器不需要erlang虚拟机
{relx, [
  {release, {hello, "0.1.0"}, [hello]},
  {include_erts, true},
  {extended_start_script, true}
]}.
```