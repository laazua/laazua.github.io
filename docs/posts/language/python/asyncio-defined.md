##### 

```python
# 协程定义与启动
import asyncio

async def hello():
    print("hello")
    await asyncio.sleep(0.1)
    print("world")
    return 123

def main():
    # 推荐：自 Python 3.7+，用 asyncio.run 启动
    # 创建事件循环、运行直到 coroutine 完成、关闭 loop 并返回结果
    result = asyncio.run(hello())
    print("result:", result)

if __name__ == "__main__":
    main()
```