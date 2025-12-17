##### exporter

+ node_exporter
    - 选择性采集:  
        --collector.disable-defaults  
        --collector.cpu  
        --collector.meminfo  
        --collector.filesystem  
    - 运行示例:  
        ./node_exporter --collector.disable-defaults --collector.time --collector.vmstat --collector.xfs --collector.swap --collector.stat --collector.softnet --collector.sockstat --collector.netstat --collector.cpu --collector.meminfo --collector.loadavg --collector.cpufreq --collector.diskstats --collector.mountstats --collector.filesystem
+ [nginx指标数据收集](https://github.com/nginx/nginx-prometheus-exporter)
+ [blackbox指标数据收集](https://github.com/prometheus/blackbox_exporter)
