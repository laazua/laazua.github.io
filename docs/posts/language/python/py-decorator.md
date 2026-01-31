---
title: Python 装饰器
prev:
    text: Python项目环境差异化配置
    link:  /posts/language/python/py-config
next:
    text: 加密配置文件字段通过环境变量进行解密
    link: /posts/language/python/py-enc-config
---

##### 装饰器

- 被装饰函数带参数
```python
import time
import functools


def timer(func):
    """装饰器函数timer"""

    @functools.wraps(func)
    def wrapper(*args, **kwargs):

        start_time = time.time()
        func(*args, **kwargs)
        end_time = time.time()
        print(f"Function '{func.__name__}' executed in {end_time - start_time:.4f} seconds")
        # return 是否有返回值,取决于被装饰函数(func)是否有返回值
    return wrapper


@timer
def foo(second):
    time.sleep(second)


if __name__ == "__main__":
    foo(2)
```


- 装饰器函数带参数
```python
import time
import functools


def timer(threshold: int=None):   # threshold 装饰器timer的参数
    print(f"Threshold set to: {threshold}")
    def outer_wrapper(func):  # func被装饰的函数

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            func(*args, **kwargs)
            end_time = time.time()
            print(f"Function {func.__name__} executed in {end_time - start_time:.4f} seconds")
            # return 是否有返回值,取决于被装饰函数(func)是否有返回值

        return wrapper
    return outer_wrapper


@timer(10)    # foo = timer(10)(foo)
def foo(name: str, age: int) -> None:
    time.sleep(2)
    print(f"Name: {name}, Age: {age}")


if __name__ == "__main__":
    foo("Alice", 30)    # foo = timer(10)(foo) => foo = outer_wrapper(foo) => foo = wrapper
```

