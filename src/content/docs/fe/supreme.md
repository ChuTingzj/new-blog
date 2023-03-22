---
title: "Supreme"
description: "record for supreme"
---
## Monorepo

> 在版本控制系统的单个代码库里包含了许多项目的代码。这些项目虽然有可能是相关的，但通常在逻辑上是独立的，并由不同的团队维护。
>
> `monorepo` 就是把多个工程放到一个 `git` 仓库中进行管理，因此他们可以共享同一套构建流程、代码规范也可以做到统一，特别是如果存在模块间的相互引用的情况，查看代码、修改bug、调试等会更加方便

### pnpm+pnpm-workspace

#### 相关指令

##### --filter

表示只会为过滤后的仓库执行这条命令

```shell
pnpm install --filter website //现在，只有根目录依赖和name为website的依赖会被安装。
```

##### -r

与以下命令一起使用时，在工作区的每个项目中运行命令：

- `install`
- `list`
- `outdated`
- `publish`
- `rebuild`
- `remove`
- `unlink`
- `update`
- `why`

在工作区的每个项目中运行命令，不包括根项目，与以下命令一起使用时为 ：

- `exec`
- `run`
- `test`
- `add`

如果您希望即使在运行脚本时也包含根项目，请将 [include-workspace-root][] 设置为 `true`。

```textile
pnpm -r publish
```

##### -w

将依赖安装在根目录作为公共依赖

#### 安装模块作为依赖

```shell
pnpm install @qftjs/monorepo2 -r --filter @qftjs/monorepo1
```

```json
{
  "name": "@qftjs/monorepo1",
  "version": "1.0.0",
  "dependencies": {
    "@qftjs/monorepo2": "workspace:^1.0.0",
    "axios": "^0.27.2"
  }
}
```

在设置依赖版本的时候推荐用 `workspace:*`，这样就可以保持依赖的版本是工作空间里最新版本，不需要每次手动更新依赖版本。

当 `pnpm publish` 的时候，会自动将 `package.json` 中的 `workspace` 修正为对应的版本号。

#### 限制包管理器

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

#### 版本管理

##### Changesets

> 管理包的version和生成changelog

```json5
{
  "$schema": "https://unpkg.com/@changesets/config@2.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": [["@qftjs/*"]],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
      "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

- changelog: changelog 生成方式
- commit: 不要让 `changeset` 在 `publish` 的时候帮我们做 `git add`
- linked: 配置哪些包要共享版本
- access: 公私有安全设定，内网建议 restricted ，开源使用 public
- baseBranch: 项目主分支
- updateInternalDependencies: 确保某包依赖的包发生 upgrade，该包也要发生 version upgrade 的衡量单位（量级）
- ignore: 不需要变动 version 的包
- ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: 在每次 version 变动时一定无理由 patch 抬升依赖他的那些包的版本，防止陷入 major 优先的未更新问题

##### 发布流程

1. 编译阶段，生成构建产物

```json
{
  "build": "pnpm --filter=@qftjs/* run build"
}
```

2. 清理构建产物和 `node_modules`

```json
{
  "clear": "rimraf 'packages/*/node_modules' && rimraf node_modules"
}
```

3. 执行 `changeset`，开始交互式填写变更集，这个命令会将你的包全部列出来，然后选择你要更改发布的包

```json
{
  "changeset": "changeset"
}
```

4. 执行 `changeset version`，修改发布包的版本

```json
{
  "version-packages": "changeset version"
}
```

这里需要注意的是，版本的选择一共有三种类型，分别是 `patch`、`minor` 和 `major`

**如果我不想直接发 `release` 版本，而是想先发一个带 `tag` 的 `prerelease`版本呢(比如beta或者rc版本)**

- 手工调整

这种方法最简单粗暴，但是比较容易犯错。

首先需要修改包的版本号：

```json
{
  "name": "@qftjs/monorepo1",
  "version": "1.0.2-beta.1"
}
```

然后运行：

```bash
pnpm changeset publish --tag beta --registry=https://registry.npmjs.com/
```

注意发包的时候不要忘记加上 `--tag` 参数。

- 通过 `changeset` 提供的 `Prereleases` 模式
  
  利用官方提供的 [Prereleases 模式](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fchangesets%2Fchangesets%2Fblob%2Fmain%2Fdocs%2Fprereleases.md "https://github.com/changesets/changesets/blob/main/docs/prereleases.md")，通过 `pre enter <tag>` 命令进入先进入 pre 模式。

常见的tag如下所示：

| 名称    | 功能                                                     |
| ----- | ------------------------------------------------------ |
| alpha | 是内部测试版，一般不向外部发布，会有很多Bug，一般只有测试人员使用                     |
| beta  | 也是测试版，这个阶段的版本会一直加入新的功能。在Alpha版之后推出                     |
| rc    | Release　Candidate) 系统平台上就是发行候选版本。RC版不会再加入新的功能了，主要着重于除错 |

```bash
pnpm changeset pre enter beta
```

之后在此模式下的 `changeset publish` 均将默认走 `beta` 环境，下面在此模式下任意的进行你的开发

#### pnpm-workspace.yaml文件

> `pnpm-workspace.yaml` 定义了 [workspace](https://pnpm.io/zh/workspaces) 的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

```yaml
prefer-workspace-packages: true
packages:
  - 'packages/*'
```

#### .npmrc文件

> pnpm 通过 CLI 接收一堆标识和选项。如果我不想一直通过它们，我们可以在一个 `.npmrc` 文件中定义它们。

```textile
//依赖提升
shamefully-hoist=true
```

#### turborepo

> 任务编排工具

```shell
pnpm i turbo --global
```

##### turbo.json

```json5
{
    "$schema":"https://turbo.build/schema.json",
    "extends":[],
    "globalDependencies":[],
    "globalEnv":[],
    "pipeline":{
        "command":{
            "dependsOn":[],
            "inputs":[],
            "outputs":[],
            "env":[],
            "cache":"boolean",
            "outputMode":"string",
            "persistent":"boolean"
        }
    }
}
```

###### dependsOn

如果一个任务的执行，只依赖自己包其他的任务，那么可以把依赖的任务放在dependsOn数组里

```js
{
    "turbo": {
        "pipeline": {
            "deploy": {
                "dependsOn": ["build", "test", "lint"]           
            } 
        }    
    }
}
```

可以通过`^`符号来显式声明该任务具有拓扑依赖性，需要依赖的包执行完相应的任务后才能开始执行自己的任务

```json
{
    "turbo": {
        "pipeline": {
            "build": {
                "dependsOn": ["^build"],           
            }
        }    
    }
}
```

因为playground依赖于@relaxed/utils和@relaxed/hook，所以我们当前playground子包的build存在依赖关系，根据build的dependsOn配置，会先执行依赖项的build命令，也就是@relaxed/utils和@relaxed/hook的build命令，依赖项执行完后才会执行playground的build命令。
如果我们不添加`"dependsOn": ["^build"]`数组中的`‘^’`那么就代表我们当前只需要执行我们自己的build命令

`dependsOn` 表示当前命令所依赖的命令，`^` 表示 `dependencies` 和 `devDependencies` 的所有依赖都执行完 `build`，才执行 `build`

如果一个任务的dependsOn为`[]` 或者不声明这个属性，那么表明这个任务可以在任意时间被执行

###### outputs

`outputs` 表示命令执行输出的文件缓存目录

默认值为`["dist/**", "build/**"]`

我们还可以通过传递一个空数组用来告诉`turbo`任务是一个副作用，这样我们不会输入任何文件

```json
"pipeline": {
  "build": {
    // "Cache all files emitted to package's dist/** or .next
    // directories by a `build` task"
    "outputs": ["dist/**", ".next/**"],
    "dependsOn": ["^build"]
  },
 }
```

###### inputs

默认为`[]`。告诉turbo在确定特定任务的包是否已更改时要考虑的文件集。将其设置为文件输入地址将导致仅当与这些真正子包中需要配置输入匹配的文件发生更改时才重新运行任务。例如，如果您想跳过运行测试，除非源文件发生更改，这会很有帮助。

指定`[]`意味着任务在任何文件发生更改时重新运行。

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
   "test": {
      // A package's `test` task should only be rerun when
      // either a `.tsx` or `.ts` file has changed.
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    }
  }
}
```

## SSR

## 跨平台

## 微前端
