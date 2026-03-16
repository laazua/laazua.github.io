---
prev: false
next: false
---
### [airflow](https://github.com/apache/airflow)

- **描述**
> `DAG有向无环图`任务流调度工具.

- **单实例安装运行**
```bash
# 安装
export AIRFLOW_HOME="/opt/app/airflow"
mkdir -p ${AIRFLOW_HOME} 
python -m pip install apache-airflow==3.0.0 -t ${AIRFLOW_HOME}/.venv
# 运行
export PYTHONPATH="${AIRFLOW_HOME}/.venv"
export PATH=$PATH:${PYTHONPATH}/bin

# port = 8069
# simple_auth_manager_all_admins = True
airflow standalone
```