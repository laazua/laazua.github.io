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

- **定义实现**
```rust
// 定义
trait Action {
    fn speak(&self);
    fn is_run(&self) -> bool {  // 默认实现
        false
    }
}

struct Cat;

struct Dog {
    name: String,
}

// Cat 实现 Action
impl Action for Cat {
    fn speak(&self) {
        println!("{} meow ...", self.name);
    }
    // is_run  默认实现
}

// Dog 实现 Action
impl Action for Dog {
    fn speak(&self) {
        println!("{} woof ...", self.name);
    }

    fn is_run(&self) -> bool {
        true
    }
}
```

- **trait参数**
```rust
/// - 多种语法形式

// 方式1: impl Trait (适用于简单情况)
fn make_sound(animal: &impl Speak) {
    animal.speak();
}

// 方式2: Trait Bound 语法
fn make_sound<T: Speak>(animal: &T) {
    animal.speak();
}

// 方式3: where 子句 (推荐用于复杂情况)
fn complex_function<T, U>(item1: &T, item2: &U) -> String
where
    T: Speak + Clone,
    U: Speak + std::fmt::Debug,
{
    item1.speak();
    format!("{:?}", item2)
}

// 方式4: 多个 trait bounds
fn multiple_traits<T: Speak + Clone + std::fmt::Display>(item: &T) {
    println!("{}", item);
    item.speak();
}
```

- **返回trait实现**
```rust
// 返回具体类型
fn get_dog() -> impl Speak {
    Dog { name: "Buddy".to_string() }
}

// 在条件中返回
fn get_animal(is_dog: bool) -> impl Speak {
    if is_dog {
        Dog { name: "Rex".to_string() }
    } else {
        Cat
    }
}

// 闭包实现 trait
fn create_speaker() -> impl Speak {
    struct Whisperer;
    
    impl Speak for Whisperer {
        fn speak(&self) {
            println!("...whispering...");
        }
    }
    
    Whisperer
}
```

- **trait对象(动态分发)**
```rust
// 使用 dyn Trait 进行动态分发
fn process_animals(animals: &[&dyn Speak]) {
    for animal in animals {
        animal.speak();
    }
}

// 在集合中使用
fn create_zoo() -> Vec<Box<dyn Speak>> {
    vec![
        Box::new(Dog { name: "Max".to_string() }),
        Box::new(Cat),
    ]
}

// 带有生命周期的 trait 对象
trait Processor<'a> {
    fn process(&self, data: &'a str) -> &'a str;
}

struct StringProcessor;

impl<'a> Processor<'a> for StringProcessor {
    fn process(&self, data: &'a str) -> &'a str {
        data.trim()
    }
}
```

- **关联类型**
```rust
trait Container {
    type Item;  // 关联类型
    
    fn add(&mut self, item: Self::Item);
    fn get(&self, index: usize) -> Option<&Self::Item>;
}

struct MyVec<T> {
    items: Vec<T>,
}

impl<T> Container for MyVec<T> {
    type Item = T;
    
    fn add(&mut self, item: T) {
        self.items.push(item);
    }
    
    fn get(&self, index: usize) -> Option<&T> {
        self.items.get(index)
    }
}
```

- **泛型trait和trait继承**
```rust
// Trait 继承
trait Animal: Speak {  // Animal 需要实现 Speak
    fn move_(&self);
}

trait Fly: Animal {
    fn fly(&self);
}

struct Bird;

impl Speak for Bird {
    fn speak(&self) {
        println!("Chirp!");
    }
}

impl Animal for Bird {
    fn move_(&self) {
        println!("Flying or walking");
    }
}

impl Fly for Bird {
    fn fly(&self) {
        println!("Flying high!");
    }
}
```

- **完全限定语法**
```rust
trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        println!("*waving arms furiously*");
    }
}

fn main() {
    let person = Human;
    
    person.fly();                   // 调用 Human 的 fly
    Pilot::fly(&person);            // 调用 Pilot 的 fly
    Wizard::fly(&person);           // 调用 Wizard 的 fly
    <Human as Pilot>::fly(&person); // 完全限定语法
}
```

- **条件trait实现**
```rust
use std::fmt::Display;

// 为所有实现了 Display 的类型实现 Summary trait
trait Summary {
    fn summarize(&self) -> String;
}

impl<T: Display> Summary for T {
    fn summarize(&self) -> String {
        format!("({})", self)
    }
}

// 泛型结构体的条件实现
struct Wrapper<T> {
    value: T,
}

impl<T> Wrapper<T> {
    fn new(value: T) -> Self {
        Self { value }
    }
}

// 只有 T 实现了 Display 时，Wrapper<T> 才实现 Display
impl<T: Display> Display for Wrapper<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Wrapper[{}]", self.value)
    }
}
```
- **trait实用模式**
```rust
/// - 构造器模式
trait Builder {
    type Output;
    
    fn new() -> Self;
    fn build(self) -> Self::Output;
}

struct Config {
    host: String,
    port: u16,
}

struct ConfigBuilder {
    host: Option<String>,
    port: Option<u16>,
}

impl Builder for ConfigBuilder {
    type Output = Config;
    
    fn new() -> Self {
        Self {
            host: None,
            port: None,
        }
    }
    
    fn build(self) -> Config {
        Config {
            host: self.host.unwrap_or("localhost".to_string()),
            port: self.port.unwrap_or(8080),
        }
    }
}

impl ConfigBuilder {
    fn host(mut self, host: &str) -> Self {
        self.host = Some(host.to_string());
        self
    }
    
    fn port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }
}
```

- **标准库常用trait**
```rust
// 自动派生
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct User {
    id: u64,
    name: String,
}

// 手动实现重要的 trait
impl std::fmt::Display for User {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "User {}: {}", self.id, self.name)
    }
}

impl From<String> for User {
    fn from(name: String) -> Self {
        User {
            id: 1, // 简化示例
            name,
        }
    }
}
```