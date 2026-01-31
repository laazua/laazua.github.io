---
title: 其他示例代码
prev:
    text: 守护进程启动
    link:  /posts/language/golang/daemon
next:
    text: C/C++
    link: /posts/language/cc/index
---


##### 示例代码

- Linux远程执行命名
```go
package main

import (
	"fmt"
	"os"
	"os/exec"
)

const (
	hostIp   = "192.168.165.71"
	HostName = "ca-server" // 主机配置了/etc/hosts 才能使用
	sshUser  = "zhangsan"
)

func main() {
	sshConfig := fmt.Sprintf(`
Host %s
    HostName %s
    User %s
    StrictHostKeyChecking no
`, hostIp, hostIp, sshUser)
	tmpConfig := "/tmp/ssh_onfig"
	err := os.WriteFile(tmpConfig, []byte(sshConfig), 0600)
	if err != nil {
		fmt.Printf("Error writing SSH config: %v\n", err)
		return
	}
	// 远程执行命令(scp命令同理)
	sshCmd := exec.Command("ssh", "-F", tmpConfig, hostIp, "touch ~/testssh.txt")
	sshCmd.Stdout = os.Stdout
	sshCmd.Stderr = os.Stderr

	err = sshCmd.Run()
	if err != nil {
		fmt.Printf("run ssh command error: %v\n", err.Error())
		return
	}
	fmt.Println("run ssh command success")
	if err := os.Remove(tmpConfig); err != nil {
		fmt.Printf("清理： %v 失败\n", tmpConfig)
		return
	}
}
```