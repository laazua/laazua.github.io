---
prev: false
next: false
---

##### [asdf](https://github.com/asdf-vm/asdf)

<pre>
  asdf 是一个工具版本管理器
</pre>

- [asdf工具文档](https://asdf-vm.com/zh-hans/guide/introduction.html)

---
- **安装**
```bash
# 下载
curl -LjO https://github.com/asdf-vm/asdf/releases/download/v0.18.1/asdf-v0.18.1-linux-amd64.tar.gz

# 解压
tar -xf asdf-v0.18.1-linux-amd64.tar.gz
sudo mv asdf /usr/local/bin/
```

- **配置**
```bash
# 将垫片目录添加到路径（必须）
export ASDF_DIR="$HOME/.asdf"
export PATH="${ASDF_DIR:-$HOME/.asdf}/shims:$PATH"

# 自定义数据目录（可选）
# export ASDF_DATA_DIR="/your/custom/data/dir"
```

- **插件安装使用示例**
```bash
asdf plugin add golang https://github.com/asdf-community/asdf-golang.git
asdf list all golang
asdf install golang 1.26.1
asdf set  golang 1.26.1
go version
```