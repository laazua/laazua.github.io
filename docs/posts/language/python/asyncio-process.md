#####

```python
import asyncio

async def run_ls():
    proc = await asyncio.create_subprocess_exec(
        'ls', '-la',
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    print("stdout:", stdout.decode())
    print("returncode:", proc.returncode)

asyncio.run(run_ls())

# 也可使用 create_subprocess_shell() 来运行 shell 命令。注意安全性（避免 shell 注入）
```