##### Optimized

```shell
java \
# 启用 Server 模式 JVM，使用优化后的 JIT 编译器（C2）生成高性能机器码
-server \
# 堆内存初始大小
-Xms4g \
# 堆内最大值(建议与-Xms一致)
-Xmx4g \
# 年轻代大小
-Xmn2g \
# 初始元空间大小
-XX:MetaspaceSize=512m \
# 元空间最大值
-XX:MaxMetaspaceSize=512m \
# G1垃圾回收器（JDK9+默认）
-XX:+UseG1GC \
# 期望最大 GC 停顿时间 200ms
-XX:MaxGCPauseMillis=200 \
# 设置 GC 时使用的并行线程数
-XX:ParallelGCThreads=4 \
# G1 并发标记阶段线程数
-XX:ConcGCThreads=2 \
# 如果代码调用 System.gc()，触发 并发 GC 而不是 Stop-the-World Full GC;避免应用阻塞
-XX:+ExplicitGCInvokesConcurrent \
# 当 JVM OOM 时生成堆转储文件,并保存到./logs/heapdump.hprof
-XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=./logs/heapdump.hprof \
# 打印每次 GC 的详细信息（内存回收前后、各代占用等）
# 加上时间戳，便于分析,输出到./logs/gc.log
-XX:+PrintGCDetails \
-XX:+PrintGCDateStamps \
-Xloggc:./logs/gc.log \
# 禁用 AWT 图形界面
-Djava.awt.headless=true \
# 设置默认文件编码为 UTF-8
-Dfile.encoding=UTF-8 \
# Spring 应用设置激活的配置环境（profile）为 prod
-Dspring.profiles.active=prod \
-jar app.jar
```