##### Inventory

- **ini风格**
```ini
[web]
192.168.1.10
192.168.1.11 ansible_user=deploy

[db]
10.0.0.3

[all:vars]
ansible_port=22
ansible_python_interpreter=/usr/bin/python3
```

- **ymal风格**
```yaml
all:
  children:
    web:
      hosts:
        web1:
          ansible_host: 192.168.1.10
        web2:
          ansible_host: 192.168.1.11
    db:
      hosts:
        db1:
          ansible_host: 10.0.0.3
  vars:
    ansible_user: deploy
```
---

- **inventory分层**
```bash
ansible-project/
├── inventory/
│   ├── dev/
│   │   ├── hosts.yml
│   │   ├── group_vars/
│   │   │   ├── all.yml
│   │   │   ├── web.yml
│   │   │   └── db.yml
│   │   └── host_vars/
│   │       ├── web1.yml
│   │       ├── web2.yml
│   │       └── db1.yml
│   ├── test/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   ├── prod/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   │       ├── all.yml
│   │       ├── web.yml
│   │       ├── db.yml
│   │       ├── secrets.yml  (ansible-vault 加密)
│   │       └── monitoring.yml
│   │   └── host_vars/
│   │       ├── db-master.yml
│   │       └── db-slave.yml
│
├── group_vars/
│   ├── all.yml        # 全局基础变量
│   ├── sysctl.yml     # 系统调优公共变量
│
├── roles/
│   ├── nginx/
│   ├── mysql/
│   ├── base/
│   └── deploy/
│
└── playbooks/
    ├── site.yml
    ├── web.yml
    ├── db.yml
    └── deploy.yml

# 执行: ansible-playbook -i inventory/dev/hosts playbooks/site.yml
# 指定: -i inventory/dev/hosts.yml时, 自动扫描 dev/ 下面定义的变量
```
  