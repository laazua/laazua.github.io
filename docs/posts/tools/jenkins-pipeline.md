##### pipeline


- 语法
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