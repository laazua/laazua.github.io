##### 

- TCP Server（高层 streams）

```python
# echo_server_streams.py
import asyncio

async def handle(reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
    addr = writer.get_extra_info('peername')
    print("conn from", addr)
    while True:
        data = await reader.readline()
        if not data:
            break
        writer.write(b"echo: " + data)
        await writer.drain()
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle, '127.0.0.1', 8888)
    addrs = ", ".join(str(sock.getsockname()) for sock in server.sockets)
    print("Serving on", addrs)
    async with server:
        await server.serve_forever()

# 运行: asyncio.run(main())
```

- TCP Client（高层 streams）

```python
import asyncio

async def client():
    reader, writer = await asyncio.open_connection('127.0.0.1', 8888)
    writer.write(b"hello\n")
    await writer.drain()
    data = await reader.readline()
    print("got:", data)
    writer.close()
    await writer.wait_closed()

asyncio.run(client())
```