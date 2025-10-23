#####

- asyncio.gather
```python
# asyncio.gather

import asyncio

async def a(i):
    await asyncio.sleep(0.1*i)
    return f"done {i}"

async def main():
    results = await asyncio.gather(a(1), a(2), a(3))
    print(results)  # ['done 1', 'done 2', 'done 3']
    # 参数 return_exceptions=True 会返回异常对象而不是抛出
    results2 = await asyncio.gather(a(1), a(2), a(3), return_exceptions=True)
```

- asyncio.wait / asyncio.as_completed
```python
# asyncio.wait / asyncio.as_completed

import asyncio

async def task(i):
    await asyncio.sleep(0.2*i)
    return i

async def main():
    tasks = [asyncio.create_task(task(i)) for i in range(1,4)]

    # as_completed: 按完成顺序迭代
    for coro in asyncio.as_completed(tasks):
        result = await coro
        print("as_completed got", result)

    # wait: 可以等待全部或任意一个完成
    tasks = [asyncio.create_task(task(i)) for i in range(1,4)]
    done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    print("first completed:", [d.result() for d in done])
```

- asyncio.shield / asyncio.wait_for
```python
# asyncio.shield, asyncio.wait_for

import asyncio

async def slow():
    await asyncio.sleep(5)
    return "slow done"

async def main():
    # timeout wrapping
    try:
        print(await asyncio.wait_for(slow(), timeout=0.5))
    except asyncio.TimeoutError:
        print("timeout")

    # shield 防止被外部取消
    task = asyncio.create_task(slow())
    try:
        print(await asyncio.wait_for(asyncio.shield(task), timeout=0.5))
    except asyncio.TimeoutError:
        print("shielded timeout but task still running")
        # task 仍在运行
        await asyncio.sleep(5)
        print("now finished:", task.result())
```