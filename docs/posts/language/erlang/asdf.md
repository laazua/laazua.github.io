#### [asdf](https://github.com/asdf-vm/asdf)

- 安装
```bash
go install github.com/asdf-vm/asdf/cmd/asdf@v0.18.0
```

- 安装erlang
```bash
asdf plugin add erlang
asdf install erlang 28.3.1
# 设置全局默认
asdf set global erlang 28.3.1
# 设置当前项目
asdf set local erlang 28.3.1
```

- 安装elixir
```bash
asdf plugin add elixir
asdf install elixir 1.19.5
# 设置全局
asdf set global elixir 1.19.5
# 设置当前项目
asdf set local elixir 1.19.5
```

- 添加 shims 路径
```bash
# 添加 asdf shims 路径
cat >>~/.profile <<EOF
# ASDF_DATA_DIR 设置asdf数据目录
export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"
EOF
```