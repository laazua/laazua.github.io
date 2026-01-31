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