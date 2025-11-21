##### 一些系统配置

- **history配置**
```sh
# 配置在: ~/.bashrc

# 保留历史记录命令条数
HISTFILESIZE=2000
# 历史命令输出格式
HISTTIMEFORMAT="%F %T "
```
---


- **crontab配置**
```text
- **定时任务**
1. 配置目录: /etc/cron.d/
2. 配置任务: /etc/cron.d/filename
3. 配置格式: 参考文件 => /etc/crontab
4. 配置示例: * * * * * zhangsan echo 'hello world'
5. 执行的日志查询: sudo journalctl -u cron -S '2025-08-20 14:00:00' -U '2025-08-20 14:25:00' -g 'zhangsan'
```
