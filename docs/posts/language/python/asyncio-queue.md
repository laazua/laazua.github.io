#####

- asyncio.Queue

```python
# asyncio.Queue

import asyncio

async def producer(q):
    for i in range(3):
        await q.put(i)
        print("produced", i)
    await q.put(None)  # sentinel

async def consumer(q):
    while True:
        item = await q.get()
        if item is None:
            break
        print("consumed", item)
        q.task_done()

async def main():
    q = asyncio.Queue()
    await asyncio.gather(producer(q), consumer(q))
asyncio.run(main())
```

- Lock / Event / Semaphore
```python
import asyncio

lock = asyncio.Lock()
event = asyncio.Event()
sem = asyncio.Semaphore(2)  # 最多两个并发

# async with lock:，await event.wait()，event.set()。
# BoundedSemaphore 用于检测释放超过上限的错误。
```