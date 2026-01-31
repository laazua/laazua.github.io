---
title: 一般编程范式
prev:
    text: 项目代码组织
    link:  /posts/language/golang/project
next:
    text: 守护进程启动
    link: /posts/language/golang/daemon
---

##### 面向接口编程

<pre>
  在编码过程中功能边界之间使用接口进行交互！！！
</pre>

- **示例**
```go
// 在消费方代码中定义接口
package service

type UserStorage interface {
    GetUser(id int) (*User, error)
    SaveUser(user *User) error
}

type UserService struct {
    storage UserStorage
}

func NewUserService(storage UserStorage) *UserService {
    return &UserService{storage: storage}
}

// 具体实现在其他地方
package mysql

type UserRepository struct {
    db *sql.DB
}

func (r *UserRepository) GetUser(id int) (*User, error) {
    // 具体实现
}

func (r *UserRepository) SaveUser(user *User) error {
    // 具体实现
}
/*
优点:
1. 解耦性强，消费方只依赖自己定义的接口
2. 易于测试，可以轻松创建 mock
3. 符合依赖倒置原则
*/
```