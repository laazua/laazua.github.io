##### 权限系统

<pre>
  文件默认权限为: 0777 - 当前umask值(umask)
  目录默认权限为: 0666 - 当前umask值(umask)
</pre>

* **权限位**
```bash
权限位示意图：
[文件类型][所有者权限][组权限][其他用户权限] [特殊权限]
-   rwx     r-x      r-x        . (无特殊权限)
d   rwx     r-x      ---        . (无特殊权限)

文件类型：
- : 普通文件
d : 目录
l : 符号链接
b : 块设备文件
c : 字符设备文件
p : 命名管道
s : 套接字文件

权限位细分：
r : 读权限 (4)
w : 写权限 (2)
x : 执行权限 (1)
- : 无权限 (0)

特殊权限位：
SUID: s或S (用户执行位)
SGID: s或S (组执行位)
Sticky: t或T (其他用户执行位)
大写字母表示该位没有执行权限
```
---

* **用户和组**
    - 组操作
    ```bash
    ## 相关命令: 
    groupadd  
    groupdel   
    groupmems  
    groupmod  
    groups  
    chgpasswd  
    chgrp
    ```
    - 用户操作
    ```bash
    ## 相关命令: 
    useradd  
    userdel  
    usermod  
    users  
    passwd
    ```
    - 基础权限操作
    ```bash
    ## chmod
    ## augo: 
    ##     u -> 用户
    ##     g -> 组
    ##     o -> 其他
    ##     a -> 所有
    chmod 0755 test.txt
    chmod u+r+w-x,g+r-x,o+r-x test.txt

    ## chown
    ## chown username:groupname text.txt
    chown root:root text.txt

    ## lsattr chattr
    ## 查看和修改文件属性
    lsattr text.txt
    chattr +i text.txt
    ```
---

* **文件系统ACL**
    - 相关命令
    ```bash
    getfacl

    setfacl
    ```
---

* **SELinux策略**