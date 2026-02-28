---
title: Rust构建打包
prev:
    text: Rust
    link:  /posts/language/rust
next:
    text: Rust基础语法
    link: /posts/language/rust/syntax
---

##### 构建独立目标二进制文件

- 打包
```bash
# 查看支持的平台架构: rustup target list 或者 rustc --print target-list
# linux 安装 musl 目标(其他平台安装对应的musl： *-unknown-linux-musl)
rustup target add x86_64-unknown-linux-musl
# 生成目标文件: target/x86_64-unknown-linux-musl/release/binName
cargo build --release --target x86_64-unknown-linux-musl
# 验证: ldd target/x86_64-unknown-linux-musl/release/show
```

- Cargo.toml 生产级优化配置
```toml
[profile.release]
opt-level = "z"        # 或 3，z 更小，3 更快
lto = true             # 链接期优化
codegen-units = 1      # 提升性能
panic = "abort"        # 去掉 unwinding，减小体积
strip = true           # Rust 1.70+ 支持
```