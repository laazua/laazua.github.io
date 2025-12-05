##### 网络模型

- **四层模型**

| 层级    | 名称              | 对应 OSI 层            | 典型协议                  |
| ----- | --------------- | ------------------- | --------------------- |
| **4** | 应用层 Application | OSI 5-7 层（会话/表示/应用） | HTTP、DNS、SSH、FTP      |
| **3** | 传输层 Transport   | OSI 4 层             | TCP、UDP               |
| **2** | 网络层 Internet    | OSI 3 层             | IP、ICMP、ARP、BGP、OSPF  |
| **1** | 网络接口层 Link      | OSI 1-2 层           | Ethernet、WIFI、MAC、PPP |


- **七层模型**

| 层级    | 名称               | 主要职责                     | 常见协议 / 设备                   |
| ----- | ---------------- | ------------------------ | --------------------------- |
| **7** | 应用层 Application  | 面向用户的应用能力，例如文件传输、邮件、HTTP | HTTP、HTTPS、FTP、SMTP、DNS、SSH |
| **6** | 表示层 Presentation | 数据格式转换、加密解密、压缩           | TLS/SSL、MIME、JPEG           |
| **5** | 会话层 Session      | 会话建立/维护/终止               | RPC、NetBIOS、gRPC            |
| **4** | 传输层 Transport    | 端到端通信、可靠/不可靠传输           | TCP、UDP                     |
| **3** | 网络层 Network      | 路由与寻址                    | IP、ICMP、ARP、OSPF、BGP、NAT    |
| **2** | 数据链路层 Data Link  | 物理寻址、帧传输                 | Ethernet、VLAN、PPP、MAC       |
| **1** | 物理层 Physical     | 物理比特流、电气特性               | 光纤、网线、无线信号、网卡 PHY           |

