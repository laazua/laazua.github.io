##### 加密配置文件字段

- **流程**

```text
+-----------------------------+
|   程序启动 (main.py)         |
+-----------------------------+
                |
                v
+-----------------------------+
|   加载 YAML (config_loader) |
+-----------------------------+
                |
                v
+----------------------------------------------+
| 递归遍历配置树：发现 !enc 字段 → 进入解密流程      |
+----------------------------------------------+
                |
                v
+----------------------------------------------------+
| 根据 key_id 找到 master key（环境变量/KMS/Vault）     |
+----------------------------------------------------+
                |
                v
+-----------------------------+
|       执行解密（AES-GCM）    |
+-----------------------------+
                |
                v
+--------------------------------------------------------+
|   将该字段替换成解密后的明文，例如 "ProdDB_Password123!"    |
+--------------------------------------------------------+
                |
                v
+----------------------------+
|   返回完整配置 dict 给应用    |
+----------------------------+
                |
                v
      应用像平常一样使用配置
```

- **实现**
    + > 依赖: uv add PyYAML cryptography  
    + 配置文件
    ```yaml
    # 配置 config/app.yaml
    database:
      host: "10.0.0.1"
      port: 5432
      username: "appuser"
      password:
        alg: AES-256-GCM
        ciphertext: QeegGkeZ60ZHzLgD7bebbKwO7A==
        key_id: local-master-v1
        nonce: 2GKhoAPzWIL4pYqL
        tag: 88Ufi1Slxv8Itg3OoYax4g==
        version: 1
    ```
    + 生成加密文字段内容,将输出配置到config/app.yaml
    ```python
    # scripts/encrypt_field.py
    import os, base64, yaml
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    def b64(x): return base64.b64encode(x).decode()
    def unb64(x): return base64.b64decode(x)

    # master key（必须通过环境变量提供）
    MASTER_KEY = unb64(os.environ["MASTER_KEY_B64"])

    def encrypt_value(plaintext: str):
        aes = AESGCM(MASTER_KEY)
        nonce = os.urandom(12)
        ct = aes.encrypt(nonce, plaintext.encode(), None)

        return {
            "alg": "AES-256-GCM",
            "nonce": b64(nonce),
            "ciphertext": b64(ct[:-16]),  # cryptography 把 tag 拼在 ct 末尾
            "tag": b64(ct[-16:]),
            "key_id": "local-master-v1",
            "version": 1
        }

    if __name__ == "__main__":
        plaintext = input("请输入要加密的字段内容: ").strip()
        encrypted = encrypt_value(plaintext)
        print(yaml.dump({"password": encrypted}, allow_unicode=True))


    # 运行脚本 scripts/encrypt_field.py 将输出的内容替换config/app.yaml需要加密的字段
    # export MASTER_KEY_B64=$(openssl rand -base64 32)  这个环境变量解密时需要用到
    # python scripts/encrypt_field.py
    # 请输入要加密的字段内容: ProdDB_Password123!
    # password:
    #   alg: AES-256-GCM
    #   ciphertext: ZKjSvsbKstcP7dXqyq12nTgGXg==
    #   key_id: local-master-v1
    #   nonce: Ev3Ccy6E5yZ7MdhO7rVllQ==
    #   tag: SSgmrduEqKbvfj9t2XTMFQ==
    #   version: 1

    ## 这里的 password 字段为配置中需要加密的字段
    ```
    + 程序中解密配置文件中的加密字段
    ```python
    # 这是生产级的“读取加密配置”逻辑，启动时运行解密
    # app/config_loader.py
    import os, base64, yaml
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM

    def unb64(s): return base64.b64decode(s)

    # 这里的环境变量与上面生成加密文本时使用的环境变量一致
    # master key 必须来自运行时环境变量（不能写在代码里）
    MASTER_KEY = unb64(os.environ["MASTER_KEY_B64"])

    def decrypt_field(node: dict):
        nonce = unb64(node["nonce"])
        ct = unb64(node["ciphertext"])
        tag = unb64(node["tag"])

        aes = AESGCM(MASTER_KEY)
        plaintext = aes.decrypt(nonce, ct + tag, None)
        return plaintext.decode()

    def traverse(obj):
        """遍历配置树，遇到 !enc 节点时执行解密"""
        if isinstance(obj, dict):
            # 是否为加密字段
            if set(obj.keys()) >= {"alg", "nonce", "ciphertext", "tag"}:
                return decrypt_field(obj)

            # 遍历普通 dict
            return {k: traverse(v) for k, v in obj.items()}

        if isinstance(obj, list):
            return [traverse(v) for v in obj]

        return obj

    def load_config(path):
        with open(path, "r", encoding="utf8") as f:
            raw = yaml.safe_load(f)
        return traverse(raw)
    ```
    + 主程序使用加密配置
    ```python
    from app.config_loader import load_config

    config = load_config("config/app.yaml")

    print("最终配置：")
    print(config)

    print("数据库密码 = ", config["database"]["password"])
    
    # 输出如下

    ## 最终配置：
    ## {'database': {'host': '10.0.0.1', 'port': 5432, 'username': 'appuser', 'password': 'ProdDB_Password123!'}}
    ## 数据库密码 = ProdDB_Password123!
    ```
