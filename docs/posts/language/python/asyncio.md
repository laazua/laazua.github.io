##### 标准库 asyncio

**概念速览**
- 事件循环（Event Loop）：asyncio 的核心，负责调度协程、回调、I/O 事件、定时器等。通常用 asyncio.run() 来启动顶层事件循环。也可手动创建/控制 loop
- 协程（Coroutine）：用 async def 定义，返回一个 coroutine 对象；必须交给事件循环执行（await / Task / gather 等）
- Task：事件循环中调度运行协程的包装器（asyncio.Task），可以取消、查询状态、捕获异常。通过 asyncio.create_task() 或 asyncio.ensure_future() 创建
- Future：表示尚未完成的结果。Task 是 Future 的子类。一般自己只在低层或与回调交互时创建 Future()
- 同步原语：Lock, Event, Condition, Semaphore，用于协程之间的同步
- Streams（高层网络 API）：asyncio.open_connection()、asyncio.start_server() 基于 StreamReader/StreamWriter 提供易用的网络 I/O
- Transports/Protocols：更底层的 API，用于高性能或定制协议实现（Protocol 类、create_datagram_endpoint 等）
- 子进程：通过 asyncio.create_subprocess_exec 并配合 await 获取输出
- 线程执行：run_in_executor() 或 Python 3.9+ 的 asyncio.to_thread() 把阻塞函数移到线程池

---
**示例代码**
- [协程定义与启动](./asyncio-defined.md)  
- [协程与任务(创建,取消，异常)](./asyncio-create-cancel-exception.md)  
- [Future (自建 Future 场景)](./asyncio-future.md)
- [并发组合工具](./asyncio-gather.md)
- [同步原语与队列](./asyncio-queue.md)
- [调度回调 / 计时器（loop 的回调式 API）](./async-callback.md)
- [高层网络流（Streams）](./asyncio-stream.md)
- [低层 transports/protocols（当需要高性能或精细控制时）](./asyncio-transports.md)
- [子进程 API（异步子进程）](./asyncio-process.md)
- [与线程 / CPU-bound 整合](./asyncio-cpu-bound.md)

---
**取消、超时与错误处理**
- 取消：task.cancel() -> 协程内会收到 CancelledError，应在需要时捕获以做清理，并可选择重新抛出保持取消语义
- 超时：asyncio.wait_for(coro, timeout) 抛 asyncio.TimeoutError；默认会取消被包装的协程（除非用 shield）
- 未检索的 Task 异常：如果创建了 task 但从未 await 它或处理异常，loop 会在 task 结束时记录异常。要么 await 要么用 add_done_callback 来处理
- get_event_loop() 在不同 Python 版本语义有差异，推荐 asyncio.run() 和 asyncio.get_running_loop() 在协程内使用

---

**综合示例：Echo Server + 管理后台任务 + 优雅关闭**
```python
import asyncio
import signal

async def handle(reader, writer):
    addr = writer.get_extra_info('peername')
    print("conn", addr)
    try:
        while True:
            data = await asyncio.wait_for(reader.readline(), timeout=30.0)
            if not data:
                break
            writer.write(b"echo: " + data)
            await writer.drain()
    except asyncio.TimeoutError:
        print("client timeout", addr)
    finally:
        writer.close()
        await writer.wait_closed()

async def periodic():
    while True:
        print("heartbeat")
        await asyncio.sleep(5)

async def main():
    server = await asyncio.start_server(handle, '127.0.0.1', 8888)
    periodic_task = asyncio.create_task(periodic())

    loop = asyncio.get_running_loop()
    stop = asyncio.Event()

    def _signal_handler():
        print("got stop signal")
        stop.set()

    loop.add_signal_handler(signal.SIGINT, _signal_handler)
    loop.add_signal_handler(signal.SIGTERM, _signal_handler)

    async with server:
        await stop.wait()
        print("shutting down...")
        periodic_task.cancel()
        await asyncio.gather(periodic_task, return_exceptions=True)
        server.close()
        await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
```

**常用接口**
```text
asyncio.run(coro)：启动事件循环并运行协程直到完成（推荐入口）。

asyncio.create_task(coro)：把协程封装成 Task 并调度在后台运行。

asyncio.ensure_future()：与 create_task 类似（兼容旧代码）。

asyncio.get_running_loop()：在协程内获取当前运行的 loop。

asyncio.get_event_loop()：获取/创建 loop（历史遗留，使用需注意版本差异）。

loop.call_soon(cb, *args)：安排立即执行的回调。

loop.call_later(delay, cb, *args) / call_at(when, cb)：安排延迟回调。

loop.call_soon_threadsafe(cb, *args)：线程安全地安排回调到 loop。

asyncio.sleep(secs)：异步睡眠。

asyncio.gather(*coros)：并行聚合多个 coroutine/Task。

asyncio.wait(tasks, return_when=...)：等待一组 futures/tasks（FIRST_COMPLETED 等）。

asyncio.as_completed(iterable)：按完成顺序迭代 futures。

asyncio.shield(coro_or_future)：防止被外部取消。

asyncio.wait_for(coro, timeout)：给协程设置超时。

asyncio.Queue()：异步队列。

asyncio.Lock(), Event(), Condition(), Semaphore(), BoundedSemaphore()。

asyncio.open_connection(host, port)：返回 (StreamReader, StreamWriter)。

asyncio.start_server(client_connected_cb, host, port)：创建 TCP server（高层）。

loop.create_server(Protocol, ...)：底层 server。

loop.create_datagram_endpoint(...)：创建 UDP endpoint。

asyncio.create_subprocess_exec(...) / create_subprocess_shell(...)：异步子进程。

loop.run_in_executor(executor, func, *args) / asyncio.to_thread(func, *args)：运行阻塞任务到线程池。

asyncio.Task / asyncio.Future：任务与 future 类型
```