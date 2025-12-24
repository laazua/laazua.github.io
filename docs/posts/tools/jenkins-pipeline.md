##### pipeline

- 结构
```groovy
pipeline {
    // 必需的：指定执行节点
    agent any
    
    // 可选的：配置选项
    options {}
    
    // 可选的：环境变量
    environment {}
    
    // 可选的：参数定义
    parameters {}
    
    // 可选的：触发器
    triggers {}
    
    // 可选的：工具配置
    tools {}
    
    // 可选的：输入提示
    input {}
    
    // 可选的：条件判断
    when {}
    
    // 必需的：阶段定义
    stages {
        stage('Stage Name') {
            // 阶段配置
        }
    }
    
    // 可选的：后处理
    post {
        // 后处理条件
    }
}
```

- 示例
```groovy
pipeline {
    agent any
    options{
      skipDefaultCheckout()  //删除隐式checkout scm语句
      disableConcurrentBuilds() //禁止并行
      timeout(time: 1, unit: 'HOURS')  //流水线超时设置1小时
    }
    stages {
        stage('xxx') {
            steps{
                script{
                    // 如果python脚本需要依赖三方库
                    sh """
                    export PYTHONPATH=/opt/app/jenkins/vendor
                    python3 /opt/app/jenkins/scripts/req.py
                    """
                }
            } 
        }
    }
}
```

- [共享库示例](https://github.com/laazua/sharedlib)