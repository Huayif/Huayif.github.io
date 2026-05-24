---
title: CMake 入门
date: 2026-03-22
updated: 2026-03-22
categories: code
tags:
  - c++
copyright: true
excerpt: 手动敲编译命令总是出错？CMake 用一份配置文件描述构建方式，解决多文件 C++ 项目的编译管理问题。
---

## 为什么要学 CMake？

写 C++ 的时候，一开始可能就一个 `main.cpp`，直接 `g++ main.cpp -o main` 就跑起来了。

但项目稍微大一点，文件一多，手动敲编译命令就变成了这种画面：

```bash
g++ -std=c++17 -I./include -I./lib/xxx/include src/main.cpp src/utils.cpp src/network.cpp lib/xxx/src/xxx.cpp -o myapp -lpthread -lssl
```

漏一个文件、少一个路径、换台电脑——直接崩。

CMake 就是来解决这个问题的：**用一份配置文件描述怎么构建，剩下的让它来做。**

---

## CMake 是什么？

CMake 本身**不是编译器**，它是一个**构建系统生成器**。

它读取你写的 `CMakeLists.txt`，然后生成对应平台的构建文件：
- Linux/Mac → `Makefile`
- Windows → Visual Studio 项目 / Ninja
- 等等……

流程是这样的：

```
CMakeLists.txt  →  cmake  →  Makefile / VS项目  →  make/编译器  →  可执行文件
```

---

## 最简单的项目结构

```
my_project/
├── CMakeLists.txt
└── main.cpp
```

`main.cpp`：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, CMake!" << std::endl;
    return 0;
}
```

`CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

add_executable(myapp main.cpp)
```

逐行解释：
- `cmake_minimum_required` —— 声明最低 CMake 版本，避免用了新特性在旧版本上报错
- `project(MyProject)` —— 项目名称
- `set(CMAKE_CXX_STANDARD 17)` —— 指定 C++17 标准
- `add_executable(myapp main.cpp)` —— 告诉 CMake：用 `main.cpp` 编译生成名为 `myapp` 的可执行文件

---

## 构建步骤

CMake 推荐**外部构建**（out-of-source build），把生成的文件放到单独的目录，不污染源码：

```bash
mkdir build
cd build
cmake ..        # 生成构建文件，.. 指向上层的 CMakeLists.txt
cmake --build . # 开始编译
```

编译完成后，`myapp`（Windows 上是 `myapp.exe`）就在 `build/` 里。

---

## 多文件项目

项目稍大后，一般会分 `src/` 和 `include/`：

```
my_project/
├── CMakeLists.txt
├── include/
│   └── utils.h
└── src/
    ├── main.cpp
    └── utils.cpp
```

`CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

add_executable(myapp
    src/main.cpp
    src/utils.cpp
)

target_include_directories(myapp PRIVATE include)
```

`target_include_directories` 的第二个参数有三种：

| 关键字 | 含义 |
|--------|------|
| `PRIVATE` | 只有 `myapp` 自己用这个路径 |
| `PUBLIC` | `myapp` 和依赖它的目标都能用 |
| `INTERFACE` | 只有依赖它的目标用，自己不用 |

新手阶段基本都用 `PRIVATE` 就行。

---

## 链接第三方库

以链接系统自带的 `pthread` 为例：

```cmake
target_link_libraries(myapp PRIVATE pthread)
```

如果用的是 CMake 支持的主流库（比如 OpenSSL、zlib），可以用 `find_package`：

```cmake
find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)
```

---

## 小结

| 指令 | 作用 |
|------|------|
| `cmake_minimum_required` | 声明最低版本 |
| `project()` | 设置项目名 |
| `set(CMAKE_CXX_STANDARD 17)` | 指定 C++ 标准 |
| `add_executable()` | 定义可执行目标 |
| `target_include_directories()` | 添加头文件路径 |
| `target_link_libraries()` | 链接库 |

CMake 的内容远不止这些，后续打算继续写：子目录与 `add_subdirectory`、`CMakePresets`、`FetchContent` 拉取依赖……

慢慢更，不鸽（大概）。
