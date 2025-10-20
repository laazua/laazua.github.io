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

- **[如何内嵌的方式在项目中加入三方库](https://github.com/avplayer/avpn/tree/master/third_party/boost)**