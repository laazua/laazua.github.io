#####

```python
import asyncio
import time

def cb(msg):
    print("callback:", msg)

async def main():
    loop = asyncio.get_running_loop()
    loop.call_soon(cb, "soon")
    handle = loop.call_later(1.0, cb, "later 1s")
    # 取消定时器
    handle.cancel()

    # call_at: 使用 loop.time() + offset 计算
    loop.call_at(loop.time() + 2.0, cb, "at time 2s")
    await asyncio.sleep(2.5)

asyncio.run(main())

# loop.call_soon_threadsafe(callback, *args)：允许从其他线程安全地向 loop 安排回调
```