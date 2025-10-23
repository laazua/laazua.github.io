#####

- tcp

```python
import asyncio

class EchoProtocol(asyncio.Protocol):
    def connection_made(self, transport):
        self.transport = transport
        peer = transport.get_extra_info('peername')
        print("Connection from", peer)

    def data_received(self, data):
        print("received:", data)
        self.transport.write(b"echo: " + data)

async def main():
    loop = asyncio.get_running_loop()
    server = await loop.create_server(EchoProtocol, '127.0.0.1', 9999)
    async with server:
        await server.serve_forever()

# asyncio.run(main())
```

- udp

```python
class EchoDatagramProtocol(asyncio.DatagramProtocol):
    def datagram_received(self, data, addr):
        print("UDP recv from", addr, data)
        self.transport.sendto(b"echo:" + data, addr)

async def udp_main():
    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: EchoDatagramProtocol(),
        local_addr=('127.0.0.1', 9998))
    # ... keep running
```