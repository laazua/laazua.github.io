##### 守护进程

- **示例一**
```go
package main

import (
    "fmt"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "runtime"
)

func main() {
    // 检查是否是子进程
    if os.Getenv("DAEMON") != "1" {
        // 获取当前可执行文件路径
        execPath, _ := filepath.Abs(os.Args[0])
        
        cmd := exec.Command(execPath, os.Args[1:]...)
        cmd.Env = append(os.Environ(), "DAEMON=1")
        
        // 重定向输出到文件
        logFile, _ := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
        cmd.Stdout = logFile
        cmd.Stderr = logFile
        
        // 启动进程但不等待
        err := cmd.Start()
        if err != nil {
            fmt.Printf("启动后台进程失败: %v\n", err)
            os.Exit(1)
        }
        
        fmt.Printf("服务已在后台运行，PID: %d\n", cmd.Process.Pid)
        os.Exit(0)
    }
    
    // 这里是实际的HTTP服务代码
    startHTTPServer()
}

func startHTTPServer() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, 后台服务!")
    })
    
    fmt.Println("HTTP服务启动在 :8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Printf("服务启动失败: %v\n", err)
    }
}
```

- **示例二**
```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"
)

func daemonize() bool {
	if os.Getenv("DAEMON") == "1" {
		return false // 已经是守护进程
	}

	execPath, err := filepath.Abs(os.Args[0])
	if err != nil {
		log.Fatal("获取可执行文件路径失败:", err)
	}

	cmd := exec.Command(execPath, os.Args[1:]...)
	cmd.Env = append(os.Environ(), "DAEMON=1")

	logFile, err := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("创建日志文件失败:", err)
	}
	defer logFile.Close()

	cmd.Stdout = logFile
	cmd.Stderr = logFile
	cmd.Stdin = nil

	// 设置进程属性
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setsid: true,
	}

	err = cmd.Start()
	if err != nil {
		log.Fatalf("启动后台进程失败: %v\n", err)
	}

	fmt.Printf("服务已在后台运行，PID: %d\n", cmd.Process.Pid)
	fmt.Printf("日志文件: %s\n", "server.log")
	return true
}

func startHTTPServer(ctx context.Context) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, 后台服务! 时间: %s", time.Now().Format(time.RFC3339))
	})

	server := &http.Server{
		Addr:    ":8085",
		Handler: nil,
	}

	// 在goroutine中启动服务器
	go func() {
		log.Println("HTTP服务启动在 :8085")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("服务启动失败: %v\n", err)
		}
	}()

	// 等待上下文取消信号
	<-ctx.Done()

	// 优雅关闭
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("服务关闭失败: %v\n", err)
	}

	log.Println("服务已优雅关闭")
}

func main() {
	// 如果指定了后台运行参数，则创建守护进程
	if len(os.Args) > 1 && os.Args[1] == "-d" {
		if daemonize() {
			return // 父进程退出
		}
	}

	// 创建带有取消功能的上下文
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 设置信号监听
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	// 在goroutine中监听信号
	go func() {
		sig := <-signalChan
		log.Printf("接收到信号: %v\n", sig)
		cancel()
	}()

	// 启动HTTP服务
	startHTTPServer(ctx)
}
```

- **示例三**
```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"syscall"
)

func daemonize() {
	// 创建子进程
	pid, _, err := syscall.Syscall(syscall.SYS_FORK, 0, 0, 0)
	if err != 0 {
		fmt.Printf("fork失败: %v\n", err)
		os.Exit(1)
	}

	// 父进程退出
	if pid > 0 {
		fmt.Printf("服务在后台运行，PID: %d\n", pid)
		os.Exit(0)
	}

	// 子进程创建新的会话
	_, errno := syscall.Setsid()
	if errno != nil {
		log.Fatalf("创建新会话失败: %v", errno)
	}

	// 重定向标准输入输出到 /dev/null
	devNull, errr := os.OpenFile("/dev/null", os.O_RDWR, 0)
	if errr != nil {
		log.Fatalf("无法打开 /dev/null: %v", err)
	}
	defer devNull.Close()

	// 使用 syscall.Dup2 复制文件描述符
	syscall.Dup2(int(devNull.Fd()), int(os.Stdin.Fd()))
	syscall.Dup2(int(devNull.Fd()), int(os.Stdout.Fd()))
	syscall.Dup2(int(devNull.Fd()), int(os.Stderr.Fd()))
}

func main() {
	// 如果不是守护进程模式，则创建守护进程
	if len(os.Args) > 1 && os.Args[1] == "-d" {
		daemonize()
	}

	startHTTPServer()
}

func startHTTPServer() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, 守护进程!")
	})

	log.Println("HTTP守护进程服务启动在 :8085")
	err := http.ListenAndServe(":8085", nil)
	if err != nil {
		log.Printf("服务启动失败: %v\n", err)
	}
}
```

- **示例四**
```go
// go get github.com/takama/daemon
package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    
    "github.com/takama/daemon"
)

const (
    name        = "myhttpservice"
    description = "My HTTP Service"
)

var stdlog, errlog *log.Logger

type Service struct {
    daemon.Daemon
}

func (service *Service) Manage() (string, error) {
    usage := "Usage: myservice install | remove | start | stop | status"
    
    if len(os.Args) > 1 {
        command := os.Args[1]
        switch command {
        case "install":
            return service.Install()
        case "remove":
            return service.Remove()
        case "start":
            return service.Start()
        case "stop":
            return service.Stop()
        case "status":
            return service.Status()
        default:
            return usage, nil
        }
    }
    
    // 启动HTTP服务
    go startHTTPServer()
    
    // 等待中断信号
    <-waitForSignal()
    return "服务已停止", nil
}

func startHTTPServer() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, 系统服务!")
    })
    
    stdlog.Println("HTTP服务启动在 :8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        errlog.Printf("服务启动失败: %v\n", err)
    }
}

func main() {
    stdlog = log.New(os.Stdout, "", log.Ldate|log.Ltime)
    errlog = log.New(os.Stderr, "", log.Ldate|log.Ltime)
    
    srv, err := daemon.New(name, description, daemon.SystemDaemon)
    if err != nil {
        errlog.Println("Error: ", err)
        os.Exit(1)
    }
    
    service := &Service{srv}
    status, err := service.Manage()
    if err != nil {
        errlog.Println(status, "\nError: ", err)
        os.Exit(1)
    }
    fmt.Println(status)
}

// 简单的信号等待函数
func waitForSignal() chan os.Signal {
    signalChan := make(chan os.Signal, 1)
    // 这里可以添加信号处理
    return signalChan
}
```
