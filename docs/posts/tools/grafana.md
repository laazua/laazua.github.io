### Grafana

* [下载软件包](https://github.com/grafana/grafana/releases)

* 配置文件修改
    - cp conf/defaults.ini conf/grafana.ini
    - 根据实际情况修改配置,如: default_language = zh-Hans
    - 启动服务: bin/grafana-server --config conf/grafana.ini

* 仪表盘操作示例
    - ![图示](./grafana-dashboard.png)
    - 点击上图示例右上角可视化：**添加面板(panel)**
    - 点击上图示例右上角行: **添加行**
    - 添加的 **面板(panel)** 可在仪表盘中进行拖动
    - 添加的 **行** 可将相关联的面板(panel)进行组织

* panel操作示例
    - 如下图
    - ![图示](./grafana-panel.png)