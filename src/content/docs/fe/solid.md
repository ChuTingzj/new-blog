---
title: "Solid"
description: "record for solid"
---
## features

### 渲染函数仅执行一次

SolidJS 仅支持 FunctionComponent 写法，无论内容是否拥有状态管理，也无论该组件是否接受来自父组件的 Props 透传，都仅触发一次渲染函数。

所以其状态更新机制与 React 存在根本的不同：

- React 状态变化后，通过重新执行 Render 函数体响应状态的变化。
- Solid 状态变化后，通过重新执行用到该状态代码块响应状态的变化。

与 React 整个渲染函数重新执行相对比，Solid 状态响应粒度非常细，甚至一段 JSX 内调用多个变量，都不会重新执行整段 JSX 逻辑，而是仅更新变量部分

### 更完善的 Hooks 实现

SolidJS 用 `createSignal` 实现类似 React `useState` 的能力，虽然看上去长得差不多，但实现原理与使用时的心智却完全不一样：

```text
const App = () => {
  const [count, setCount] = createSignal(0);
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
};
```

我们要完全以 SolidJS 心智理解这段代码，而不是 React 心智理解它，虽然它长得太像 Hooks 了。一个显著的不同是，将状态代码提到外层也完全能 Work

```text
const [count, setCount] = createSignal(0);
const App = () => {
  return <button onClick={() => setCount(count() + 1)}>{count()}</button>;
};
```

这是最快理解 SolidJS 理念的方式，即 SolidJS 根本没有理 React 那套概念，SolidJS 理解的数据驱动是纯粹的数据驱动视图，无论数据在哪定义，视图在哪，都可以建立绑定。

这个设计自然也不依赖渲染函数执行多次，同时因为使用了依赖收集，也不需要手动申明 deps 数组，也完全可以将 `createSignal` 写在条件分支之后，因为不存在执行顺序的概念。

### 派生状态

用回调函数方式申明派生状态即可：

```text
const App = () => {
  const [count, setCount] = createSignal(0);
  const doubleCount = () => count() * 2;
  return <button onClick={() => setCount(count() + 1)}>{doubleCount()}</button>;
};
```

### 计算缓存

```text
const App = () => {
  const [count, setCount] = createSignal(0);
  const doubleCount = () => createMemo(() => count() * 2);
  return <button onClick={() => setCount(count() + 1)}>{doubleCount()}</button>;
};
```

同样无需写 deps 依赖数组，SolidJS 通过依赖收集来驱动 `count` 变化影响到 `doubleCount` 这一步，这样访问 `doubleCount()` 时就不用总执行其回调的函数体，产生额外性能开销了。

### 状态监听

对标 React 的 `useEffect`，SolidJS 提供的是 `createEffect`，但相比之下，不用写 deps，是真的监听数据，而非组件生命周期的一环：

```text
const App = () => {
  const [count, setCount] = createSignal(0);
  createEffect(() => {
    console.log(count()); // 在 count 变化时重新执行
  });
};
```

这再一次体现了为什么 SolidJS 有资格 “教” React 团队实现 Hooks：

- 无 deps 申明。
- 将监听与生命周期分开，React 经常容易将其混为一谈。

在 SolidJS，生命周期函数有 `onMount`、`onCleanUp`，状态监听函数有 `createEffect`；而 React 的所有生命周期和状态监听函数都是 `useEffect`，虽然看上去更简洁，但即便是精通 React Hooks 的老手也不容易判断哪些是监听，哪些是生命周期。

### 模板编译

```text
function Counter() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(count() + 1);

  return (
    <button type="button" onClick={increment}>
      {count()}
    </button>
  );
}
```

被编译为：

```text
const _tmpl$ = /*#__PURE__*/ template(`<button type="button"></button>`, 2);

function Counter() {
  const [count, setCount] = createSignal(0);

  const increment = () => setCount(count() + 1);

  return (() => {
    const _el$ = _tmpl$.cloneNode(true);

    _el$.$$click = increment;

    insert(_el$, count);

    return _el$;
  })();
}
```

首先把组件 JSX 部分提取到了全局模板。初始化逻辑：将变量插入模板；更新状态逻辑：由于 `insert(_el$, count)` 时已经将 `count` 与 `_el$` 绑定了，下次调用 `setCount()` 时，只需要把绑定的 `_el$` 更新一下就行了，而不用关心它在哪个位置。

## 响应式API

### batch

批处理依赖的更新

- Solid 的 `batch` 工具函数允许将多个更改推入队列，然后在通知观察者之前同时使用它们。在批处理中更新的信号值直到批处理完成才会提交

```javascript
import { render } from "solid-js/web"
import { createSignal, batch } from "solid-js"

const App = () => {
  const [firstName, setFirstName] = createSignal("John");
  const [lastName, setLastName] = createSignal("Smith");
  const fullName = () => {
    console.log("Running FullName")
    return `${firstName()} ${lastName()}`
  } 
  const updateNames = () => {
    console.log("Button Clicked")
    batch(() => {
      setFirstName(firstName() + "n")
      setLastName(lastName() + "!")
    })
  }

  return <button onClick={updateNames}>My name is {fullName()}</button>
};

render(App, document.getElementById("app"))
```

### untrack

忽略某个依赖的变化

- 有时希望 Signal 读取行为不被跟踪，即使在响应式上下文中也是如此 Solid 提供了 `untrack` 工具函数来避免包装计算跟踪任何读取行为
- 假设我们不想在 `b` 更改时输出日志。我们可以通过将 Effect 更改为以下内容来取消跟踪 `b` Signal

```javascript
import { render } from "solid-js/web";
import { createSignal, createEffect, untrack } from "solid-js";

const App = () => {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(1);

  createEffect(() => {
    console.log(a(), untrack(b));
  });

  return <>
    <button onClick={() => setA(a() + 1)}>Increment A</button>
    <button onClick={() => setB(b() + 1)}>Increment B</button>
  </>
};

render(App, document.getElementById("app"));
```

### on

显示的声明依赖

- Solid 提供一个 `on` 工具函数，可以为我们的计算设置显式依赖。这主要用来更明确地简洁地声明跟踪哪些信号。然而，它也允许计算不立即执行而只在第一次更改时运行。可以使用`defer` 选项启用此功能
- createEffect默认跟踪所用被读取的响应式数据，通过on可以指定跟踪的对象

```javascript
import { render } from "solid-js/web"
import { createSignal, createEffect, on } from "solid-js"

const App = () => {
  const [a, setA] = createSignal(1)
  const [b, setB] = createSignal(1)

  createEffect(on(a, (a) => {
    console.log(a, b())
  }, { defer: true }))

  return <>
    <button onClick={() => setA(a() + 1)}>Increment A</button>
    <button onClick={() => setB(b() + 1)}>Increment B</button>
  </>
}

render(App, document.getElementById("app"))
```

### props

- Props 对象是只读的，并且含有封装为对象 getter 的响应式属性
- `mergeProps`: 响应式对象的合并 `merge` 方法。用于为组件设置默认 props 以防调用者不提供这些属性值,或者克隆包含响应式的属性的 props 对象
- `splitProps`: `splitProps` 是解构的替代品。`splitProps` 在保持响应性的同时通过键来拆分响应式对象,接收一个 props 对象以及一个 props 对象的键数组。返回一个数组，数组第一个元素是与入参键数组对应的对象。数组中的最后一个元素会是一个未指定的键名的 props 对象，，类似于剩余参数

```javascript
// 设置默认 props
props = mergeProps({ name: "Smith" }, props);

// 克隆 props
newProps = mergeProps(props);

// 合并 props
props = mergeProps(props, otherProps);

// 分离 propos
const [local, others] = splitProps(props, ["children"]);
<>
  <Child {...others} />
  <div>{local.children}<div>
</>
```

## JSX属性

### use

ref的语法糖

`use:___` 是自定义指令。从某种意义上说，这只是 ref 上的语法糖，但允许我们轻松地将多个指令附加到单个元素。指令只是一个具有以下签名的函数：

```ts
function directive(element: Element, accessor: () => any): void;
```

这些函数在渲染时运行，你可以在其中执行任何操作。创建 signal 和 effects，注册清理函数，随心所欲。

```js
const [name, setName] = createSignal("");

function model(el, value) {
  const [field, setField] = value();
  createRenderEffect(() => (el.value = field()));
  el.addEventListener("input", (e) => setField(e.target.value));
}

<input type="text" use:model={[name, setName]} />;
```

注册 TypeScript 扩展 JSX 命名空间。

```ts
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [() => any, (v: any) => any];
    }
  }
}
```
