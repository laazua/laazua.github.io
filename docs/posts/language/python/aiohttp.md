##### aiohttp

- **接口示例**
::: code-group
```python [main.py]

from aiohttp import web

from app.api.user_api import user_router
from app.api.role_api import role_router


_app = web.Application()
_app.router.add_routes(user_router)
_app.router.add_routes(role_router)


if __name__ == '__main__':
    web.run_app(
        _app,
        host='localhost',
        port=8085,
    )
```
``` python [user_api.py]
from aiohttp import web


user_router = web.RouteTableDef()


@user_router.post('/api/user')
async def create(request: web.Request) -> web.Response:
    data = await request.json()

    return web.json_response(data)


@user_router.delete('/api/user/{id}')
async def delete(request: web.Request) -> web.Response:
    user_id = request.match_info['id']
    
    return web.json_response({'status': 'deleted', 'id': user_id})


@user_router.put('/api/user/{id}')
async def update(request: web.Request) -> web.Response:
    user_id = request.match_info['id']
    if request.body_exists:
        data = await request.json()
    else:
        data = {}
    return web.json_response({'status': 'updated', 'id': user_id, 'data': data})


@user_router.get('/api/user/{id}')
async def retrieve(request: web.Request) -> web.Response:
    user_id = request.match_info['id']

    return web.json_response({'id': user_id, 'name': 'John Doe', 'email': 'john.doe@example.com'})


@user_router.get('/api/user')
async def list(request: web.Request) -> web.Response:
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john.doe@example.com'}, 
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane.smith@example.com'}
    ]
    return web.json_response(users)
```
```python [role_api.py]
from aiohttp import web


role_router = web.RouteTableDef()


@role_router.post('/api/role')
async def create(request: web.Request) -> web.Response:
    data = await request.json()

    return web.json_response(**data)


@role_router.delete('/api/role/{id}')
async def delete(request: web.Request) -> web.Response:
    role_id = request.match_info['id']
    
    return web.json_response({'status': 'deleted', 'id': role_id})


@role_router.put('/api/role/{id}')
async def update(request: web.Request) -> web.Response:
    role_id = request.match_info['id']
    data = await request.json()

    return web.json_response({'status': 'updated', 'id': role_id, **data})


@role_router.get('/api/role/{id}')
async def retrieve(request: web.Request) -> web.Response:
    role_id = request.match_info['id']

    return web.json_response({'id': role_id, 'name': 'Admin', 'permissions': ['read', 'write', 'delete']})


@role_router.get('/api/role')
async def list(request: web.Request) -> web.Response:
    roles = [
        {'id': 1, 'name': 'Admin', 'permissions': ['read', 'write', 'delete']}, 
        {'id': 2, 'name': 'User', 'permissions': ['read']}
    ]
    return web.json_response(roles)
```
:::