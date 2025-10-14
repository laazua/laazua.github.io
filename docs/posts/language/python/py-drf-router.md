##### 项目路由

```python
from django.urls import path, include

urlpatterns = [
    path('api/users/', include('apps.user.urls')),
]
```