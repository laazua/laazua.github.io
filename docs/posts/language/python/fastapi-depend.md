##### 依赖注入

- **示例代码**
::: code-group
```python [api层]
"""
app/api/v1/user_api.py
"""
from fastapi import APIRouter

from app.service.user_service import UserServiceDeps

user_router = APIRouter(tags=['用户接口'])


@user_router.post('/create')
async def creat(service: UserServiceDeps):
    return await service.add_user()

```
```python [service层]
"""
app/service/user_service.py
"""
from typing import Annotated

from fastapi import Depends

from app.repository.user_repository import UserRepository


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def add_user(self):
        pass
    # 增删改查

    def __call(self, *args, **kwargs):
        """依赖注入使用"""
        return self


UserServiceDeps = Annotated[UserService, Depends(UserService)]
```
```python [repository层]
"""
app/repository/user_repository.py
"""
from typing import Annotated

from fastapi import Depends

from app.shared.db import DBSession


class UserRepository:
    def __init__(self, session: DBSession):
        self.session = session

    # 增删改查 ...

    def __call__(self, *args, **kwargs):
        """依赖注入使用"""
        return self


UserRepositoryDeps = Annotated[UserRepository, Depends[UserRepository]]
```
```python [db操作]
"""
app/shared/db.py
"""
from typing import Annotated

from fastapi import Depends

from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncSession


class Base(DeclarativeBase):
    """异步数据库模型基类"""


class SessionManager:
    """异步数据库连接管理类"""
    # 实现...


def get_db():
    """获取会话逻辑"""


DBSession = Annotated[AsyncSession, Depends(get_db)]
``` 
```bash [README]
# 项目结构:
.
├── app
│   ├── api
│   │   ├── mws
│   │   └── v1
│   │       └── user_api.py
│   ├── config.py
│   ├── __main__.py
│   ├── main.py
│   ├── model
│   │   ├── user_model.py
│   │   └── user_schema.py
│   ├── repository
│   │   └── user_repository.py
│   ├── service
│   │   └── user_service.py
│   └── shared
│       ├── db.py
│       └── redis.py
├── config.example.yaml
├── config.yaml
├── pyproject.toml
├── README.md
└── uv.lock


```
:::