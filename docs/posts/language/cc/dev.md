##### C/C++

- **项目开发**
> 以项目内嵌三方库的方式进行开发(示例如下)  

```shell
# 将三方库添加到项目的根路径的third_party目录下
git submodule add https://github.com/microcai/boost.git third_party/boost

# CMakeLists.txt进行如下设置
set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_STATIC_RUNTIME ON)

find_package(Boost 1.55 COMPONENTS thread system filesystem program_options random atomic chrono)
if (NOT Boost_FOUND)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/third_party/boost)
endif()

target_link_libraries("your target" ${BOOST_LIBRARIES} )
```
> [参考示例](https://github.com/zero-rp/ops)  


- **[如何内嵌的方式在项目中加入三方库](https://github.com/avplayer/avpn/tree/master/third_party/boost)**


- **项目依赖三方库 jmalloc 如何制作Docker镜像**
```dockerfile
FROM gcc:latest

# 安装基础构建工具
RUN apt-get update && apt-get install -y \
    cmake \
    make \
    git \
    autoconf \
    automake \
    libtool \
    && rm -rf /var/lib/apt/lists/*

# 下载并编译 jemalloc
RUN git clone https://github.com/jemalloc/jemalloc.git /tmp/jemalloc \
    && cd /tmp/jemalloc \
    && ./autogen.sh \
    && ./configure --prefix=/usr/local \
    && make -j$(nproc) \
    && make install \
    && rm -rf /tmp/jemalloc

# 复制项目代码
WORKDIR /app
COPY . .

# 构建项目，链接 jemalloc
RUN g++ -o myapp main.cpp -I/usr/local/include -L/usr/local/lib -ljemalloc

# 设置运行时链接库路径
ENV LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH

CMD ["./myapp"]
```