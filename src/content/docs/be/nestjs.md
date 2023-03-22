---
title: "Nest"
description: "record for nest"
---
## 核心文件

```textile
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
```

| app.controller.ts     | 单个路由的基本控制器                                |
| --------------------- | ----------------------------------------- |
| appcontroller.spec.ts | 针对控制器的单元测试                                |
| app.module.ts         | 应用程序的根模块                                  |
| app.service.ts        | 具有单一方法的基本服务                               |
| main.ts               | 应用程序的入口文件，使用核心函数NestFactory来创建Nest应用程序的实例 |

## 模块装饰器@Module

`.mudule`文件需要使用一个`@Module()` 装饰器的类

`@Module()` 装饰器接收四个属性：`providers`、`controllers`、`imports`、`exports`。

- providers：`Nest.js`注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享（*注入器的概念后面依赖注入部分会讲解*）；
  
  - 自定义provider

    ```ts
    //module
    @Module({
        providers:[AppService,{
            provide:'ABC',
            useClass:AppService
        },{
            provide:'DEF',
            useValue:['1','2','3']
        },{
            //如果服务 之间有相互的依赖 或者逻辑处理 可以使用 useFactory
            provide:'GHY',
            inject:[AppService]
            useFactory:(AppService:AppService)=>{
                return new AppService(AppService)
            }
        },{
        provide: "async",
        async useFactory() {
          return await  new Promise((r) => {
            setTimeout(() => {
              r('sync')
            }, 3000)
          })
        }
      }
    })
    //controller
    @Controller()
    export class AppController{
        constructor(@inject('ABC') private readonly appService:AppService,
        @inject('DEF') private readonly array:Array<string>){}
    }
    ```

- controllers：处理http请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给providers处理；

- imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入；

- exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出；

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

<img src="file:///D:/A-Space/ChuTing/Konwledge%20is%20infinite🤑/前端/images/Service类与Constroller类-导出.png" title="" alt="" data-align="center">

### 全局模块装饰器@Global

```ts
//定义全局模块
@Global()
@Module({
    controllers:[AController],
    providers:[AService],
    exports:[AService]
})
export class globalModule{}
//在app.module.ts中注册
//之后其他模块只需按需导入对应的service，无需在自身的module中注册
```

### 动态模块

动态模块主要就是为了给模块传递参数 可以给该模块添加一个静态方法 用来接受参数

```ts
@Global()
@Module({
    controllers:[AController],
    providers:[AService],
    exports:[AService]
})
export class globalModule{
    static forRoot(options:{path:string}):DynamicModule{
        return {
            module:globalModule,
            providers:[
                {
                    provide:'Config',
                    useValue:{baseApi:`/api/${options.path}`}
                }
            ],
            exports: [
                {
                    provide: "Config",
                    useValue: { baseApi: "/api" + options.path }
                }
            ]
        }
    }
}
```

```ts
@Module({
    imports:[globalModule.forRoot({
        path:'abc'
    })]
})
export class AppModule{}
```

## 路由装饰器@Controller

使用`@Controller`装饰器来定义控制器, `@Get`是请求方法的装饰器，对`getHello`方法进行修饰， 表示这个方法会被GET请求调用，该装饰器可以传入一个路径参数，作为访问这个控制器的主路径

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

```ts
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### 相关装饰器

#### 参数装饰器（获取前端传递的参数）

| @Request                | req                           |
| ----------------------- | ----------------------------- |
| @Response               | res                           |
| @Next                   | next                          |
| @Session                | req.session                   |
| @Param(key?:string)     | req.params/req.params[key]    |
| @Body(key?: string)     | req.body/req.body[key]        |
| @Query(key?: string)    | req.query/req.query[key]      |
| @Headers(name?: string) | req.headers/req.headers[name] |
| @HttpCode               |                               |

## 注册装饰器@Injectable

使用`@Injectable`修饰后的 `AppService`, 在`AppModule`中注册之后，在`app.controller.ts`中使用，我们就不需要使用`new AppService()`去实例化，直接引入过来就可以用

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

## 设置全局路由前缀

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(9080);
}
bootstrap();
```

## nest-cli

### 创建模块

nest g mo posts 创建一个 posts模块，文件目录不写，默认创建和文件名一样的`posts`目录，在`posts`目录下创建一个`posts.module.ts`

### 创建控制器

nest g co posts 创建了一个posts控制器，命名为`posts.controller.ts`以及一个该控制器的单元测试文件.

### 创建服务类

nest g service posts 创建`app.service.ts`文件，并且在`app.module.ts`文件下，`@Module`装饰器的`providers`中注入

### 创建一套CRUD

nest g resource children 创建一整套crud的方法

## 版本控制

```ts
//main.ts
async function bootstrap(){
    const app = await NestFactory.create(AppModule)
    app.enableVersion({
        type:VersionType.URL
    })
    await app.listen(3000)
}
```

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path:"user",
  version:'1'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
```

## 中间件

中间件是在路由处理程序 之前 调用的函数。 中间件函数可以访问请求和响应对象

中间件函数可以执行以下任务:

- 执行任何代码。

- 对请求和响应对象进行更改。

- 结束请求-响应周期。

- 调用堆栈中的下一个中间件函数。

- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起

### 依赖注入中间件

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Logger中间件');
    res.send('被拦截');
  }
}
```

使用方法 ：在模块里面 实现 configure 返回一个消费者  consumer 通过 apply 注册中间件 通过forRoutes 指定  Controller 路由

```ts
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChildrenModule } from './children/children.module';
import { LoginModule } from './login/login.module';
import { Logger } from '../middleware';

@Module({
  imports: [ChildrenModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(Logger)
      .forRoutes({ path: 'children/post', method: RequestMethod.POST });
    // consumer.apply(Logger).forRoutes(UserController)拦截所有
  }
}
```

### 全局中间件

```ts
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
const whiteList = ['/children'];
function globalMiddleWare(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);
  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    res.send('禁止访问');
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(session({ secret: 'NestJS', rolling: true, name: 'NestJS.sid' }));
  app.use(globalMiddleWare);
  await app.listen(3000);
}
bootstrap();
```

## ORM框架

### Prisma

#### 初始化

```shell
npm install typescript @types/node nodemon ts-node -D
npm install @prisma/client prisma -S
```

#### .prisma文件

##### datasource

- 一个 schema 只能有一个 `datasource` 字段。
- `datasource db` 只是习惯用法，您可以为数据源指定任何名称 — 例如，`datasource mysql` 或 `datasource data`。

`datasource` 接受以下字段:

| 字段名                 | 必选    | 类型                                                               | 描述                                                                                                           |
| ------------------- | ----- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `provider`          | **是** | String (`postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb`) | 要使用的数据源连接器。                                                                                                  |
| `url`               | **是** | String (URL)                                                     | 包括身份验证信息的连接串。 大多数连接器使用 [数据库提供的语法](https://prisma.yoga/reference/database-reference/connection-urls/#format)。 |
| `shadowDatabaseUrl` | 否     | String (URL)                                                     | Prisma Migrate 使用的影子数据库的连接 URL。允许您使用云托管数据库作为影子数据库。                                                           |

##### generator

`generator` 接受以下字段:

| 字段名               | 必选    | 类型                                              | 描述                                                                                                            |
| ----------------- | ----- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `provider`        | **是** | String (file path) or Enum (`prisma-client-js`) | 要使用的 generator。这可以指向实现 generator 的文件，也可以直接指定内置 generator。                                                     |
| `output`          | 否     | String (file path)                              | 生成 client 文件的保存路径, [详见](https://prisma.yoga/reference/api-reference/). **默认值**: `node_modules/.prisma/client` |
| `binaryTargets`   | 否     | List of Enums (see below)                       | 指定运行 Prisma 客户端的操作系统，以确保[查询引擎](https://prisma.yoga/reference/api-reference/)的二进制兼容性。 **默认值**: `native`        |
| `previewFeatures` | 否     | List of Enums                                   | 使用智能提示查看当前可用的预览功能（Visual Studio Code 快捷键 `Ctrl+Space`）。                                                       |

##### 表：model

- Model 的每个记录都必须是唯一可识别的。每个 Model 必须至少定义以下一个属性：:
  - [`@unique`](https://prisma.yoga/reference/api-reference/prisma-schema-reference#unique)
  - [`@@unique`](https://prisma.yoga/reference/api-reference/prisma-schema-reference#unique-1)
  - [`@id`](https://prisma.yoga/reference/api-reference/prisma-schema-reference#id)
  - [`@@id`](https://prisma.yoga/reference/api-reference/prisma-schema-reference#id-1)

###### 属性描述符

属性修改[字段](https://prisma.yoga/reference/api-reference/prisma-schema-reference#model-fields)或块（例如 [models](https://prisma.yoga/reference/api-reference/prisma-schema-reference#model)）的行为。有两种方法可以向数据模型添加属性：

- *字段* 使用前缀 `@`
- *块* 使用前缀 `@@`

`@id` 对应的数据库类型： PRIMARY KEY。

`@@id`定义复合id，对应的数据库类型： PRIMARY KEY

`@default` 设置字段默认值，可以联合函数使用，比如 `@default(autoincrement())`，可用函数包括 `autoincrement()`、`dbgenerated()(表示无法在 Prisma schema 中表示的默认值如`random()`)`、`cuid()`、`uuid()`、`now()`，还可以通过 `dbgenerated` 直接调用数据库底层的函数，比如 `dbgenerated("gen_random_uuid()")`。

`@unique` 设置字段值唯一。

`@@unique`为字段定义复合唯一约束

- 构成唯一约束**的所有字段必须**为必填字段

`@@index`创建数据库索引

`@relation` 设置关联，对应数据库类型: `FOREIGN KEY` / `REFERENCES`。

`@map` 设置映射，修改字段名映射、`@@map` 修改表名映射，默认情况下，字段名与 key 名相同：。

`@@map`将 Prisma schema 模型名称映射到具有不同名称的表（关系数据库）或集合（MongoDB），或将枚举名称映射到数据库中的不同基础枚举

`@updatedAt` 修饰字段用来存储上次更新时间，一般是数据库自带的能力。

`@ignore` 对 Prisma 标记无效的字段。

所有属性描述都可以组合使用，并且还存在需对 model 级别的描述，一般用两个 `@` 描述，包括 `@@id`、`@@unique`、`@@index`、`@@map`、`@@ignore`

- 生成的 Prisma Client 不存在被忽略的字段
- 您可以手动将 `@ignore` 添加到要从 Prisma 客户端排除的字段（例如，不希望 Prisma 用户更新的字段）

###### 类型修饰符

```context
model User {
  name  String?
  posts Post[]
}
```

#### CRUD

##### create

create方法接受两个参数：

- data，即你要用来创建新数据的属性，类型定义由你的schema决定，如这里content在schema中是可选的字符串（`String?`），其类型就为`string|null`，所以需要使用`??`语法来照顾参数未传入的情况。
- select，决定create方法返回的对象中的字段，如果你指定`select.id`为false，那么create方法的返回值对象中就不会包含id这一属性。这一参数在大部分prisma方法中都包含。
- include,决定包含哪些关系

```ts
import {PrismaClient} from './prisma/client'

const prisma = new PrismaClient()
function createToDo(title:string,content?:string){
    return prisma.toDo.create({
        data: {
            title,
            content: content ?? null
        }
    });
}
```

##### read

FindUnique方法类似于TypeORM中的findOne方法，都是基于主键查询，在这里将查询条件传入给where参数。

```ts
async function getTodoById(id: number) {
  const res = await prisma.todo.findUnique({
    where: { id },
  });
  return res;
}
```

在这里我们额外传入了orderBy方法来对返回的查询结果进行排序，既然有了排序，当然也少不了分页。你还可以传入`cursor`、`skip`、`take`等参数来完成分页操作。

```ts
async function getTodos(status?: boolean) {
  const res = await prisma.todo.findMany({
    orderBy: [{ id: "desc" }],
    where: status
      ? {
          finished: status,
        }
      : {},
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  return res;
} 
```

##### update

这里执行的是在未查询到主键对应的数据实体时抛出错误，你也可以使用upsert方法来在数据实体不存在时执行创建。

```ts
async function updateTodo(
  id: number,
  title?: string,
  content?: string,
  finished?: boolean
) {
  const origin = await prisma.todo.findUnique({
    where: { id },
  });

  if (!origin) {
    throw new Error("Item Inexist!");
  }

  const res = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title: title ?? origin.title,
      content: content ?? origin.content,
      finished: finished ?? origin.finished,
    },
  });
  return res;
}
```

注意，这里我们使用set属性，来直接设置finished的值。这一方式和直接设置其为false是效果一致的，如果这里是个number类型，那么除了set以外，还可以使用increment、decrement、multiply以及divide方法。

```ts
async function convertStatus(status: boolean) {
  const res = await prisma.todo.updateMany({
    where: {
      finished: !status,
    },
    data: {
      finished: {
        set: status,
      },
    },
  });

  return res;
}
```

##### delete

```ts
async function deleteTodo(id: number) {
  const res = await prisma.todo.delete({
    where: { id },
  });
  return res;
}

async function clear() {
  const res = await prisma.todo.deleteMany();
  return res;
}
```

#### Prisma CLI

##### 初始化项目

```shell
pnpx prisma init --datasource-provider mysql
//只会生成prisma文件夹和.env文件，如果.env文件已经存在，则会将需要的环境变量追加到已存在的文件
```

.env文件

```context
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mysql://root:admin123@localhost:3306/prisma"
```

.prisma文件

```context
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output = "./client"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model ToDo {
    id          Int         @id @default(autoincrement())
    title       String
    content     String?
    finished    Boolean     @default(false)
    createAt    DateTime    @default(now())
    updateAt    DateTime    @updatedAt
}
```

##### 创建client

```shell
pnpx prisma generate
```

##### 可视化的数据库

```shell
pnpx prisma studio
```

##### 数据库迁移

Prisma Migrate将Prisma模式转换为所需的SQL，以创建和更改数据库中的表。可以通过[Prisma CLI](https://link.juejin.cn/?target=https%3A%2F%2Fwww.prisma.io%2Fdocs%2Fconcepts%2Fcomponents%2Fprisma-cli "https://www.prisma.io/docs/concepts/components/prisma-cli")提供的 `prisma migration` 命令使用它。

```shell
pnpx prisma migrate dev
```

##### 提取模型

从现有数据库中提取模式，更新Prisma模型

```shell
pnpx prisma db pull
```

##### 推送到数据库

```shell
pnpx prisma db push
```
