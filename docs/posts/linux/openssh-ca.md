#####

- SSH CA
    - 服务端配置
    ```bash
    # 信任 Host CA（客户端校验服务端）
    HostCertificate /etc/ssh/trusted-user-ca-keys.pem

    # 信任 User CA（服务端校验客户端）
    TrustedUserCAKeys /etc/ssh/ssh_host_rsa_key-cert.pub

    # 强化安全
    PubkeyAuthentication yes
    PasswordAuthentication no
    PermitRootLogin no
    UsePAM yes
    ```
