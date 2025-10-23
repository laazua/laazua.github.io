#####

```python
import asyncio

async def worker(n):
    try:
        print(f"worker {n} started")
        await asyncio.sleep(2)
        print(f"worker {n} finished")
        return n * 10
    except asyncio.CancelledError:
        print(f"worker {n} was cancelled")
        raise

async def main():
    # create_task 返回 Task，并立即调度
    t1 = asyncio.create_task(worker(1))
    t2 = asyncio.create_task(worker(2))

    await asyncio.sleep(0.5)
    # 取消其中一个
    t2.cancel()
    try:
        r1 = await t1
        r2 = await t2
    except asyncio.CancelledError:
        # 如果你 await 已取消的 task，会在这里收到异常
        pass

asyncio.run(main())
```