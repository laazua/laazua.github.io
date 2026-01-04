#### [FastDepends](https://github.com/Lancetnik/FastDepends)


- **代码示例**
::: code-group
```python [类依赖]
## uv add fast-depends

from typing import Annotated
from fast_depends import Depends, inject


class A:
    """
    A class
    """
    def __init__(self):
        self.desc = "Class A instance"

    def __call__(self, *args, **kwds):
        return self


ADeps = Annotated[A, Depends(A)]


@inject
def main(a: ADeps):
    """main
    """
    print(a.desc)


if __name__ == "__main__":
    main(ADeps)
```
```python [方法依赖]
from typing import Annotated, Callable
from fast_depends import Depends, inject


def greet(name):
    """greet
    """
    return f"Hello, {name}!"


FunDeps = Annotated[Callable[[str], None], Depends(lambda: greet)]


@inject
def main(greeting: FunDeps):
    """main
    """
    print(greeting("zhangsan"))


if __name__ == "__main__":
    main(FunDeps)

```
:::