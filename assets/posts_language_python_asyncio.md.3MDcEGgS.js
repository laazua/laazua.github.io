import{_ as a,c as i,o as n,af as p}from"./chunks/framework.BKhkn9_V.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"posts/language/python/asyncio.md","filePath":"posts/language/python/asyncio.md"}'),l={name:"posts/language/python/asyncio.md"};function t(e,s,h,k,r,o){return n(),i("div",null,[...s[0]||(s[0]=[p(`<h5 id="标准库-asyncio" tabindex="-1">标准库 asyncio <a class="header-anchor" href="#标准库-asyncio" aria-label="Permalink to “标准库 asyncio”">​</a></h5><p><strong>概念速览</strong></p><ul><li>事件循环（Event Loop）：asyncio 的核心，负责调度协程、回调、I/O 事件、定时器等。通常用 asyncio.run() 来启动顶层事件循环。也可手动创建/控制 loop</li><li>协程（Coroutine）：用 async def 定义，返回一个 coroutine 对象；必须交给事件循环执行（await / Task / gather 等）</li><li>Task：事件循环中调度运行协程的包装器（asyncio.Task），可以取消、查询状态、捕获异常。通过 asyncio.create_task() 或 asyncio.ensure_future() 创建</li><li>Future：表示尚未完成的结果。Task 是 Future 的子类。一般自己只在低层或与回调交互时创建 Future()</li><li>同步原语：Lock, Event, Condition, Semaphore，用于协程之间的同步</li><li>Streams（高层网络 API）：asyncio.open_connection()、asyncio.start_server() 基于 StreamReader/StreamWriter 提供易用的网络 I/O</li><li>Transports/Protocols：更底层的 API，用于高性能或定制协议实现（Protocol 类、create_datagram_endpoint 等）</li><li>子进程：通过 asyncio.create_subprocess_exec 并配合 await 获取输出</li><li>线程执行：run_in_executor() 或 Python 3.9+ 的 asyncio.to_thread() 把阻塞函数移到线程池</li></ul><hr><p><strong>示例代码</strong></p><ul><li><a href="./asyncio-defined.html">协程定义与启动</a></li><li><a href="./asyncio-create-cancel-exception.html">协程与任务(创建,取消，异常)</a></li><li><a href="./asyncio-future.html">Future (自建 Future 场景)</a></li><li><a href="./asyncio-gather.html">并发组合工具</a></li><li><a href="./asyncio-queue.html">同步原语与队列</a></li><li><a href="./asyncio-callback.html">调度回调 / 计时器（loop 的回调式 API）</a></li><li><a href="./asyncio-stream.html">高层网络流（Streams）</a></li><li><a href="./asyncio-transports.html">低层 transports/protocols（当需要高性能或精细控制时）</a></li><li><a href="./asyncio-process.html">子进程 API（异步子进程）</a></li><li><a href="./asyncio-cpu-bound.html">与线程 / CPU-bound 整合</a></li></ul><hr><p><strong>取消、超时与错误处理</strong></p><ul><li>取消：task.cancel() -&gt; 协程内会收到 CancelledError，应在需要时捕获以做清理，并可选择重新抛出保持取消语义</li><li>超时：asyncio.wait_for(coro, timeout) 抛 asyncio.TimeoutError；默认会取消被包装的协程（除非用 shield）</li><li>未检索的 Task 异常：如果创建了 task 但从未 await 它或处理异常，loop 会在 task 结束时记录异常。要么 await 要么用 add_done_callback 来处理</li><li>get_event_loop() 在不同 Python 版本语义有差异，推荐 asyncio.run() 和 asyncio.get_running_loop() 在协程内使用</li></ul><hr><p><strong>综合示例：Echo Server + 管理后台任务 + 优雅关闭</strong></p><div class="language-python"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> signal</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> handle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(reader, writer):</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    addr </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> writer.get_extra_info(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;peername&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;conn&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, addr)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        while</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            data </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.wait_for(reader.readline(), </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timeout</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">                break</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            writer.write(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">b</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;echo: &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> writer.drain()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    except</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.TimeoutError:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;client timeout&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, addr)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    finally</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        writer.close()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> writer.wait_closed()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> periodic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    while</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;heartbeat&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.sleep(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    server </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.start_server(handle, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;127.0.0.1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8888</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    periodic_task </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.create_task(periodic())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loop </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.get_running_loop()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    stop </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.Event()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    def</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> _signal_handler</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">():</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;got stop signal&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        stop.set()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loop.add_signal_handler(signal.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SIGINT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, _signal_handler)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loop.add_signal_handler(signal.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">SIGTERM</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, _signal_handler)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> with</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> server:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> stop.wait()</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        print</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;shutting down...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        periodic_task.cancel()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asyncio.gather(periodic_task, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">return_exceptions</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">True</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        server.close()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> server.wait_closed()</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> __name__</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ==</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;__main__&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    asyncio.run(main())</span></span></code></pre></div><p><strong>常用接口</strong></p><div class="language-text"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>asyncio.run(coro)：启动事件循环并运行协程直到完成（推荐入口）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.create_task(coro)：把协程封装成 Task 并调度在后台运行。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.ensure_future()：与 create_task 类似（兼容旧代码）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.get_running_loop()：在协程内获取当前运行的 loop。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.get_event_loop()：获取/创建 loop（历史遗留，使用需注意版本差异）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.call_soon(cb, *args)：安排立即执行的回调。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.call_later(delay, cb, *args) / call_at(when, cb)：安排延迟回调。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.call_soon_threadsafe(cb, *args)：线程安全地安排回调到 loop。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.sleep(secs)：异步睡眠。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.gather(*coros)：并行聚合多个 coroutine/Task。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.wait(tasks, return_when=...)：等待一组 futures/tasks（FIRST_COMPLETED 等）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.as_completed(iterable)：按完成顺序迭代 futures。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.shield(coro_or_future)：防止被外部取消。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.wait_for(coro, timeout)：给协程设置超时。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.Queue()：异步队列。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.Lock(), Event(), Condition(), Semaphore(), BoundedSemaphore()。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.open_connection(host, port)：返回 (StreamReader, StreamWriter)。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.start_server(client_connected_cb, host, port)：创建 TCP server（高层）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.create_server(Protocol, ...)：底层 server。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.create_datagram_endpoint(...)：创建 UDP endpoint。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.create_subprocess_exec(...) / create_subprocess_shell(...)：异步子进程。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>loop.run_in_executor(executor, func, *args) / asyncio.to_thread(func, *args)：运行阻塞任务到线程池。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>asyncio.Task / asyncio.Future：任务与 future 类型</span></span></code></pre></div>`,14)])])}const d=a(l,[["render",t]]);export{E as __pageData,d as default};
