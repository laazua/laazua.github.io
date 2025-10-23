#####


```python
import asyncio
import time

def blocking_io(x):
    time.sleep(1)
    return x * 2

async def main():
    # run_in_executor 把阻塞函数放到线程池 / 进程池
    loop = asyncio.get_running_loop()
    res = await loop.run_in_executor(None, blocking_io, 10)  # None => 默认线程池
    print(res)

    # Python 3.9+ 提供 asyncio.to_thread（更语义化）
    res2 = await asyncio.to_thread(blocking_io, 20)
    print(res2)

asyncio.run(main())

# 对 CPU 密集型任务，考虑 ProcessPoolExecutor 或使用多进程（asyncio 仍然适合 I/O-bound）
```