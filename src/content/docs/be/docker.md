---
title: "Docker"
description: "record for docker"
---
## 镜像加速

ali:<https://5kbevzdn.mirror.aliyuncs.com>

tencent:<https://mirror.ccs.tencentyun.com>

## Container容器

### 与容器交互

以命令行模式进入

```shell
docker run -i -t ubuntu:15.10 /bin/bash
```

- **-t:** 在新容器内指定一个伪终端或终端。

- **-i:** 允许你对容器内的标准输入 (STDIN) 进行交互。

- **ubuntu**: ubuntu 镜像。

- **/bin/bash**：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。

通过运行 exit 命令或者使用 CTRL+D 来退出容器

### 停止容器

```shell
docker stop<CONTAINER ID>
```

### 重启容器

```shell
docker restart <CONTAINER ID>
```

### 查看日志

```shell
docker logs <CONTAINER ID>
```

**-f:** 让 **docker logs** 像使用 **tail -f** 一样来输出容器内部的标准输出。

### 查看运行的容器

查看所有

```shell
docker ps -a
```

查看单个

```shell
docker ps <CONTAINER ID>
```

### 启动一个停止的容器

```shell
docker start <CONTAINER ID>
```

### 后台运行

```shell
docker run -itd --name ubuntu-test ubuntu /bin/bash
```

 -d 参数默认不会进入容器，想要进入容器需要使用指令 **docker exec**

### 进入容器

在使用 **-d** 参数时，容器启动后会进入后台。此时想要进入容器，可以通过以下指令进入：

- **docker attach**

- **docker exec**：推荐使用 docker exec 命令，因为此命令会退出容器终端，但不会导致容器的停止。

```shell
docker attach <CONTAINER ID>
```

```shell
docker exec -it <CONTAINER ID> /bin/bash
```

### 导入导出容器

导出容器快照到本地文件

```shell
docker export <CONTAINER ID> > ubuntu.tar
```

将快照文件导入为镜像

将快照文件 ubuntu.tar 导入到镜像 test/ubuntu:v1

```shell
cat docker/ubuntu.tar | docker import - test/ubuntu:v1
```

```shell
docker import http://example.com/exampleimage.tgz example/imagerepo
```

### 删除容器

```shell
docker rm -f <CONTAINER ID>
```

### 运行web应用

```shell
 docker pull training/webapp  # 载入镜像
 docker run -d -P training/webapp python app.py
```

- -d:让容器在后台运行。

- -P:将容器内部使用的网络端口随机映射到我们使用的主机上。

通过 -p 参数来设置不一样的端口

```shell
docker run -d -p 5000:5000 training/webapp python app.py
```

 docker top 来查看容器内部运行的进程

```shell
docker top <NAMES>
```

使用 **docker inspect** 来查看 Docker 的底层信息。它会返回一个 JSON 文件记录着 Docker 容器的配置和状态信息。

```shell
docker inspect <NAMES>
```

### 挂载点

```shell
docker run -v "<local>:<container>" -itd <IMAGE>
```

## 镜像

### 拉取镜像

```shell
docker pull <RESPOSITORY>
```

### 删除镜像

```shell
docker rmi <RESPOISTORY>
```

### 更新镜像

在运行的容器内使用 **apt-get update** 命令进行更新。

```shell
apt-get update && apt-get install -y git && apt-get install -y vim
```

在完成操作之后，输入 exit 命令来退出这个容器。

### 提交镜像

```shell
docker commit -m="has update" -a="runoob" e218edb10161 runoob/ubuntu:v2
```

- **-m:** 提交的描述信息

- **-a:** 指定镜像作者

- **e218edb10161：**容器 ID

- **runoob/ubuntu:v2:** 指定要创建的目标镜像名

### 推送镜像

```shell
docker push <IMAGENAME>
```

### 构建镜像

使用命令 **docker build** ， 从零开始来创建一个新的镜像。为此，我们需要创建一个 Dockerfile 文件，其中包含一组指令来告诉 Docker 如何构建我们的镜像。

```shell
docker build -t runoob/centos:6.7 .
```

- **-t** ：指定要创建的目标镜像名

- **.** ：Dockerfile 文件所在目录，可以指定Dockerfile 的绝对路径
