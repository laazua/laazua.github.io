#### trait

- **孤儿原则**
```rust
// 假设我们有一些外部定义（不在当前 crate）
extern crate other_crate;
use other_crate::{ExternalTrait, ExternalType};

// 情况 1: 为本地类型实现本地 trait ✅ 允许
pub trait LocalTrait { fn method(&self); }
pub struct LocalType;
impl LocalTrait for LocalType { fn method(&self) {} }

// 情况 2: 为本地类型实现外部 trait ✅ 允许  
impl ExternalTrait for LocalType {
    // 实现 ExternalTrait 的方法
}

// 情况 3: 为外部类型实现本地 trait ✅ 允许
impl LocalTrait for ExternalType {
    fn method(&self) {}
}

// 情况 4: 为外部类型实现外部 trait ❌ 禁止！
// impl ExternalTrait for ExternalType { ... }
// 编译错误：不能为外部类型实现外部 trait
```