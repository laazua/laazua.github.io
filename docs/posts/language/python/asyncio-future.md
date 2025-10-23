#####

```python
import asyncio

async def waiter(fut: asyncio.Future):
    print("waiting for future result...")
    result = await fut
    print("future done with:", result)

async def main():
    loop = asyncio.get_running_loop()
    fut = loop.create_future()  # 或 asyncio.Future()
    task = asyncio.create_task(waiter(fut))

    # 模拟在另一个地方完成 future
    await asyncio.sleep(0.5)
    fut.set_result("OK")
    await task

asyncio.run(main())

# Future 适合与回调/第三方 I/O 桥接时使用
# 通常不建议在普通业务逻辑频繁使用 Future()，而是使用 async/await + Task
```