##### [Prometheus](https://github.com/prometheus)

* exporter
    + node_exporter
        - 选择性采集:  
          --collector.disable-defaults  
          --collector.cpu  
          --collector.meminfo  
          --collector.filesystem  
    + [nginx指标收集](https://github.com/nginx/nginx-prometheus-exporter)
    + [blackbox指标收集](https://github.com/prometheus/blackbox_exporter)