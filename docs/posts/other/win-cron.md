### windown 定时重启

- **重启脚本示例**
```bat
@echo off
title 重启wps-tool进程脚本

echo 正在结束进程...
taskkill /f /im wps-tool.exe

echo 等待 3 秒...
timeout /t 3 /nobreak >nul

echo 正在重新启动进程...
start "" "D:\Project\wps-prod\wps-tool.exe"

exit
```

- **任务计划配置**
> + `Win + R 输入 taskschd.msc`  
> + `创建基本任务`  
> + `名称：输入“自动重启某软件”，点击下一步`  
> + `触发器：设置时间（例如“每天”或“一次”），点击下一步，设定具体时间（如 03:00）`  
> + `操作：选择“启动程序”，点击下一步`  
> + `程序或脚本：点击浏览，选择你刚刚创建的那个 RestartTask.bat 文件`  
