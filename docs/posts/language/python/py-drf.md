##### Django-drf

- **面向资源**
```text
# restful api
# 面向资源进行增删改查,如下说明

方法      资源             返回
POST     /api/books      : 返回添加了什么资源       create
DELETE   /api/books/<id> : 返回删除了什么资源       delete
PUT      /api/books/<id> : 返回更新了什么资源       update
GET      /api/books/<id> : 返回单个资源            retrieve
GET      /api/books      : 返回所有资源(列表)       list
```

- **创建项目**
> mkdir drfdemo && cd dirdemo  
> python -m venv .venv && source .venv/bin/activate  
> python -m pip install djangorestframework  
> django-admin startproject drfdemo .  
> mkdir apps && cd apps  
> django-admin startapp book

- **[项目依赖](./py-drf-reqirements.md)**

- **基础配置**
1. [drfdemo/urls.py](./py-drf-router.md)
2. [drfdemo/settings.py](./py-drf-settings.md)


- **应用代码**
1. [apps/user/apps.py](./py-drf-apps-user-apps.md)
2. [apps/user/authentication.py](./py-drf-apps-user-auth.md)
3. [apps/user/middlewares.py](./py-drf-apps-user-mdw.md)
4. [apps/user/models.py](./py-drf-apps-user-model.md)
5. [apps/user/serializers.py](./py-drf-apps-user-serializer.md)
6. [apps/user/urls.py](./py-drf-apps-user-urls.md)
7. [apps/user/views.py](./py-drf-apps-user-view.md)

- **[接口访问](./py-drf-api.md)**