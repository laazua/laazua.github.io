##### 项目配置


- 使用 pydantic_settings 进行不同环境配置
- pip install pydantic_settings
- 设置运行环境: export ENV_MODE=[dev|test|stage|prod]

- **配置说明**
```text
# Pydantic 会按以下顺序查找配置：
1. 系统环境变量 (最高优先级)
2. .env.prod (如果指定)
3. .env (基础文件)
4. 类中的默认值 (最低优先级)
```

- **逻辑代码**

```python
import enum
import os
from typing import Optional
from pydantic_settings import BaseSettings


class EnvEnum(str, enum.Enum):
    DEV: str = 'dev'
    TEST: str = 'test'
    PROD: str = 'prod'
    STAGE: str = 'stage'


class Settings(BaseSettings):
    """项目配置 - 单一配置类处理所有环境"""
    ENV_MODE: EnvEnum = EnvEnum.DEV
    ##### 以下配置根据实际需求在各个.env*中进行配置
    APP_NAME: Optional[str] = None
    ## 其他配置项
    ## ...

    @property
    def is_dev(self) -> bool:
        return self.ENV_MODE == EnvEnum.DEV
    
    @property
    def is_test(self) -> bool:
        return self.ENV_MODE == EnvEnum.TEST
    
    @property
    def is_prod(self) -> bool:
        return self.ENV_MODE == EnvEnum.PROD
    
    class Config:
        # 按优先级加载环境文件
        env_file = (
            f'.env.{os.getenv("ENV_MODE", "dev")}',  # 特定环境文件
            '.env'  # 基础环境文件
        )
        case_sensitive = True


def get_settings() -> Settings:
    """获取配置"""
    mode = os.getenv("ENV_MODE")
    # if not mode:
    #     # 定义EnvLoadError异常类处理
    #     # raise EnvLoadError('Please Config [ENV_MODE=dev|test|stage|prod] Env Variable !!!')
    #     raise 'Please Config [ENV_MODE=dev|test|stage|prod] Env Variable !!!'
    try:
        EnvEnum(mode)  # 验证环境变量值
    except ValueError:
        # 定义EnvLoadError异常类处理
        # raise EnvLoadError('Please Config [ENV_MODE=dev|test|stage|prod] Env Variable !!!')
        raise f'Invalid ENV_MODE: {mode}. Must be one of: {[e.value for e in EnvEnum]}'
    
    return Settings()


settings = get_settings()
```