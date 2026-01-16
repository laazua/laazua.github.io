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