---
title: C/C++ 开发与运行
prev:
    text: C/C++
    link:  /posts/language/cc/index
next:
    text: 网络相关
    link: /posts/network/index
---


##### 编码事项

- hello world
```c
#include <stdio.h>

typedef struct obj_t
{
    /* data */
    int a;
    char b;
} obj_t;

void show(obj_t *obj) {
    printf("obj => { a: %d, b: %c }\n", obj->a, obj->b);
}

int main() {
    obj_t obj = {.a = 12, .b =  'c'};
    show(&obj);
    return 0;
}
```

- 常量&指针
::: code-group
```C [常量指针]
/*
* 语法
*
*/
const int *ptr;   // 或 int const *ptr;

/*
* 特点:
*   ptr 是只读的（不能修改指向的内容）
*   ptr 可以改变（可以指向其他变量）
*/

/*
* 示例
*
*/
int a = 10, b = 20;
const int *p = &a;  // p指向a

*p = 30;  // 错误！不能通过p修改a的值
p = &b;   // 正确！p可以指向其他地址
```
```C [指针常量]
/*
* 语法
*
*/
int *const ptr;  // 注意const的位置

/*
* 特点:
*   ptr 是只读的（不能改变指向）
*   ptr 可以修改（除非指向的内容本身是常量）
*
*/

/*
* 示例
*
*/
int a = 10, b = 20;
int *const p = &a;  // p必须初始化，且始终指向a

*p = 30;   // 正确！可以通过p修改a的值
p = &b;    // 错误！p是常量，不能改变指向
```
:::