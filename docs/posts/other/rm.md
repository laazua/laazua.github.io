---
prev: false
next: false
---

### 删除需要管理源权限的文件


1. 管理员身份打开cmd

2. 强制夺取文件夹及其所有内容的所有权
```cmd
takeown /f "C:\Program Files\WireGuard" /r /d y
```

3. 授予管理员组完全控制权限
```cmd
icacls "C:\Program Files\WireGuard" /grant administrators:F /t
```

4. 删除文件夹
```cmd
rd "C:\Program Files\WireGuard" /s /q
```