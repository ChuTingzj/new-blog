---
title: "Tips"
description: "record for tips"
---
## undefined的正确使用

### 原由：undefined不是一个关键字，而是window的一个全局属性（只读）

```js
//❗
let a = undefined
//👌
let a = void 0
```

### 场景

```js
//造成冲突
function fun(){
    let undefined = 1
    let variable = undefined
}
```

## 保持元素宽高比

```html
<html>
    <head>
        <style>
            .container{
                width:90%;
                margin:0 auto;
                background:#fff;
                aspect-radio:16/9;
            }
        </style>
    </head>
    <body>
        <div class="container"></div>
    </body>
</html>
```

## 事件只触发一次

```js
element.addEventListener('',function(){},{once:true})
```

### 鼠标位置

e.x、e.clientX

- 距离视口左侧的距离

e.pageX

- 距离页面左侧的距离

e.screenX

- 距离屏幕左侧距离

e.movementX

- 鼠标距离上一次位置的横向距离

## 失活页面的计时器问题

   浏览器标签页切换时，为提升浏览器本身的效率，对于隐藏的页面的计时器不会频繁执行

### 解决方法

```js
//监听元素的visibilityChange事件
document.addEventListener('visibilityChange',function(){
    console.log(document.visibilityState)//hidden或show
}
```

## 元素的尺寸

1. clientWidth、clientHeight

   视口宽高，不含滚动条，不含边框

2. offsetWidth、offsetHeight

   包含边框、包含滚动条

3. scrollWidth、scrollHeight

   整个内容的尺寸，即使内容超出，不滚动时等于client

4. getBoundingClientRect()

   正常情况与scroll相同（小数更加精确），当盒子变形时宽高取能够框住盒子的最小矩形的尺寸

## 取消滚轮的默认行为

### 滚轮事件处理过于耗时 ，加上取消默认行为的事件处理，会导致浏览器的效率下降

```js
//passvie默认为true，表明不想阻止事件的默认行为
window.addEventListener('wheel',function(e{
    e.preventDefault()
},{passive:false})
```

## 手写call函数

```js
Function.prototype.call = fucntion(context,...args){
    context = context===null||undefined?globalThis:Object(context)
    const key = Symbol('temp')
    //不展示属性修饰符
    Object.defineProperty(context,key,{
        enumerable:false,
        value:this
    })
    const result = context.key(...args)
    delete context.key
    return result
}
```

## 手写bind函数

```js
Function.prototype.bind = function(context){
    const fn = this
    return function(...args){
        return fn.apply(context,args)
    }
}
```

## this指向

| 调用方式                      | 示例            | 函数中的this指向 |
| ------------------------- |:------------- | ---------- |
| 通过new调用                   | new Object()  | 新对象，实例     |
| 直接调用                      | method()      | 全局对象       |
| 通过对象调用                    | obj.method()  | 方法的调用者     |
| 通过call、apply、bind改变this指向 | method.call() | 第一个参数      |

## 文本的溢出隐藏

## 单行溢出

```css
.single-line{
    width:200px;
    height:30px;
    line-height:30px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
```

## 多行溢出

```css
```css
.multi-line{
    display:--webkit-box;
    width:200px;
    height:30px;
    line-height:30px;
    white-space:nowrap;
    overflow:hidden;
    display:--webkit-box;
    //多行文本一共显示的行数
    --webkit-line-clamp:5;
    //文本排列方向
    --webkit-box-orient:vertical;
}
```

```
## 动画暂停

```css
.container:hover{
    animation-play-state:paused
}
```

## 逐帧动画

```css
animation:run 1s steps(12) infinite
```

## 平滑滚动

```css
html{
    scroll-behavior:smooth
}
```

## 数字格式化

```js
let str = '10000000'//每三位加上逗号
let reg = /(?=\B(\d{3})+$)/g
str.replace(/(?=(\d{3})+$)/g,',')
```

## 调整文字方向

```css
.poem{
    writing-mode:vertical-rl
}
.year{
    text-orientation:upright;
    text-combine-upright:all
}
```

## 保持字体不换行

```css
word-break:keep-all//设置只能在半角空格或连字符处换行。

white-space:nowrap//样式设置文本不会换行，文本会在在同一行上继续，直到遇到
标签为止。
```

## 盒子阴影

- box-shadow
  
  对整个盒子内部做阴影

- filter:drop-shadow(0,0,10px,#fff)
  
  对范围内的像素点做阴影

## 黑白滤镜

```css
filter:grayscale(1)
```

## 固定定位

**当祖先元素transform、filter、perspective不为none时，相对于祖先元素**

## 运算符优先级

```js
a = 3
a + a++ * ++a
3 + 3 * 5
```

## 对象的键类型

**只可能是string、symbol**

**当键为对象时，会调用toString转为字符串，'[object Object]'**

## 异或

```js
//两个数字异或，将两个数字转为二进制
//不同位得1，相同位得0
//异或满足交换律    a^b^c = c^b^a
//两个相同数字异或一定为0
//0与任何数字异或一定返回那个数字
a^b        010010^010101
>000111
```

### 实践：找出只出现一次的数字

```typescript
fucntion only(nums:Array<number>):number{
    return nums.reduce((pre,next)=>pre^next,0)
}
```

## JS Label

### 结束外层循环

```js
outerLoop: for(leti = 0;i<10;i++){
            for(let j = 0;j<10;j++){
                break outerLoop;
            }
         }
```

## &运算符

**两个数字，转为二进制后，都为1得1，否则得0**

```js
//    5    4   3   2  1    0
//   101 100 011 010 001 000
function isPowerOf2(x){
    return (x&(x-1))===0
}
```

## 行盒排列空隙问题

空白折叠：代码中得换行符会显示到页面中的空隙

## CSS选择器权重

1. X：id选择器数量

2. Y：类、伪类、属性的数量

3. Z：元素、伪元素的数量

## 布尔判定和短路规则

1. &&、||返回能确定判定结果的最后一个数据

## FLIP动画

- **F：first**
  
  记录初始状态

- **L：last**
  
  记录最终状态

- **I：invert**
  
  找出这个元素是如何变化的。例如该元素在 **First** 和 **Last** 之间向右移动了 50px，你就需要在 X 方向 `translateX(-50px)`，使元素看起来在 **First** 位置。

- **P：play**
  
  从 **Invert** 回到最终状态，有了两个点的位置信息，中间的过渡动画就可以使用 `transition` 实现

```js
function createChildElementRectMap(nodes: HTMLElement | null | undefined) {
  if (!nodes) {
    return new Map();
  }
  const elements = Array.from(nodes.childNodes) as HTMLElement[];
  // 使用节点作为 Map 的 key 存储当前快照，下次直接用 node 引用取值，相当方便
  return new Map(elements.map((node) => [node, node.getBoundingClientRect()]));
}
```

```jsx
// 使用 ref 存储 DOM 之前的位置信息
const lastRectRef = useRef<Map<HTMLElement, DOMRect>>(new Map());

function handleAdd() {
  // 添加一条到顶部，让后面节点运动
  setData((prev) => [prev.length, ...prev]);
  // 并存储改变前的 DOM 快照
  lastRectRef.current = createChildElementRectMap(listRef.current);
}
import { shuffle } from 'lodash-es';

function shuffleList() {
  setData(shuffle);
  // 并存储改变前的 DOM 快照
  lastRectRef.current = createChildElementRectMap(listRef.current);
}
```

```jsx
useLayoutEffect(() => {
  // 改变后的 DOM 快照，此时 UI 并未更新
  const currentRectMap = createChildElementRectMap(listRef.current);
}, [data]);
```

```jsx
// 遍历之前的快照
lastRectRef.current.forEach((prevRect, node) => {
  // 前后快照的 DOM 引用一样，可以直接获取
  const currentRect = currentRectMap.get(node);

  // Invert
  const invert = {
    left: prevRect.left - currentRect.left,
    top: prevRect.top - currentRect.top,
  };

  const keyframes = [
    {
      transform: `translate(${invert.left}px, ${invert.top}px)`,
    },
    { transform: 'translate(0, 0)' },
  ];

  // Play 执行动画
  node.animate(keyframes, {
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  });
});
```

```tsx
export default function Flipper({ flipKey, children }: FlipperProps) {
  const lastRectRef = useRef<Map<number, FlipItemType>>(new Map());
  const uniqueIdRef = useRef(0);

  // 通过 ref 创建函数，传递 context 避免引起穿透渲染
  const fnRef = useRef<IFlipContext>({
    add(flipItem) {
      lastRectRef.current.set(flipItem.flipId, flipItem);
    },
    remove(flipId) {
      lastRectRef.current.delete(flipId);
    },
    nextId() {
      return (uniqueIdRef.current += 1);
    },
  });

  useMemo(() => {
    lastRectRef.current.forEach((item) => {
      item.rect = item.node.getBoundingClientRect();
    });
  }, [flipKey]);

  useLayoutEffect(() => {
    const currentRectMap = new Map<number, DOMRect>();
    lastRectRef.current.forEach((item) => {
      currentRectMap.set(item.flipId, item.node.getBoundingClientRect());
    });

    lastRectRef.current.forEach(() => {
      // 之前的 FLIP 代码
    });
  }, [flipKey]);

  return <FlipContext.Provider value={fnRef}>{children}</FlipContext.Provider>;
}
```

```tsx
import React, {
  cloneElement,
  memo,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import { FlipContext } from './FlipContext';

export interface FlippedProps {
  children: React.ReactElement;
  innerRef?: React.RefObject<HTMLElement>;
}

function Flipped({ children, innerRef }: FlippedProps) {
  // Flipper.tsx 将 ref 通过 Context 传递，避免穿透渲染
  const ctxRef = useContext(FlipContext);
  const ref = useRef<HTMLElement>(null);
  const currentRef = innerRef || ref;

  useLayoutEffect(() => {
    const ctx = ctxRef.current;
    const node = currentRef.current;
    // 生成唯一 ID
    const flipId = ctx.nextId();

    if (node) {
      // mount 后添加节点
      ctx.add({ flipId, node });
    }

    return () => {
      // unmout 后删除节点
      ctx.remove(flipId);
    };
  }, []);

  return cloneElement(children, { ref: currentRef });
}

export default memo(Flipped);
```

```jsx
<Flipper flipKey={data}>
  <div className={styles.list}>
    {data.map((item) => (
      <Flipped key={item}>
        <div className={styles.item}>{item}</div>
      </Flipped>
    ))}
  </div>
</Flipper>
```

```js
const isLastRectOverflow =
  rect.right < 0 ||
  rect.left > innerWidth ||
  rect.bottom < 0 ||
  rect.top > innerHeight;

const isCurrentRectOverflow =
  currentRect.right < 0 ||
  currentRect.left > innerWidth ||
  currentRect.bottom < 0 ||
  currentRect.top > innerHeight;

if (isLastRectOverflow && isCurrentRectOverflow) {
  return;
}
```

```ts
import React, { createContext } from 'react';

export type FlipItemType = {
  // 子组件的唯一标识
  flipId: number;
  // 子组件通过 ref 获取的节点
  node: HTMLElement;
  // 子组件的位置快照
  rect?: DOMRect;
};

export interface IFlipContext {
  // mount 后执行 add
  add: (item: FlipItemType) => void;
  // unout 后执行 remove
  remove: (flipId: number) => void;
  // 自增唯一 id
  nextId: () => number;
}

export const FlipContext = createContext(
  undefined as unknown as React.MutableRefObject<IFlipContext>,
);
```

## 使元素移动到可视区域

```ts
Element.scrollIntoView()
```

## 检测用户系统的主题色

```css
@media (prefers-color-scheme: light) {
}
```

## 设置元素的背景（背景图片或颜色）延伸位置

```css
background-clip: text;
-webkit-background-clip: text;
color: transparent;


background-clip: border-box;
background-clip: padding-box;
```

## 瀑布流布局

```css
.wrapper{
  width: 1200px;
  margin: 0 auto;
  columns: 5;
  column-gap: 10px;
}
.wf-item .wf-img{
  width: 100%;
  height: 100%;
}
```

```css
grid-template-rows:masonary
```

## 动态修改css变量

### getComputedStyle

获取任何基本计算后报告元素的所有 CSS 属性的值

```typescript
window.getComputedStyle(element,pseudoElt/*?伪元素*/)
```

### getPropertyValue

获取 CSS 变量的值

```typescript
window.getComputedStyle(root).getPropertyValue('--money-color').trim()
```

### setProperty

设置 CSS 变量的值

```typescript
function moneyColorChange(){
    const root = document.querySelector(':root');
    // 获取 :root 上 --money-color 变量的值
    const color = getComputedStyle(root).getPropertyValue('--money-color').trim();
    // 设置 :root 上 --money-color 变量的值
    root.style.setProperty('--money-color', color === 'red' ? 'blue' : 'red');
}
```

## 吸附效果

> **`scroll-snap-type`** [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性定义在滚动容器中的一个临时点（snap point）如何被严格的执行

## EventSource

> **`EventSource`** 是服务器推送的一个网络事件接口。一个 EventSource 实例会对 HTTP 服务开启一个持久化的连接，以`text/event-stream` 格式发送事件，会一直保持开启直到被要求关闭。
>
> 与 [WebSockets](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSockets_API),不同的是，服务端推送是单向的。数据信息被单向从服务端到客户端分发。当不需要以消息形式将数据从客户端发送到服务器时，这使它们成为绝佳的选择。例如，对于处理社交媒体状态更新，新闻提要或将数据传递到客户端存储机制（如 IndexedDB 或 Web 存储）之类的，EventSource 无疑是一个有效方案。

```js
var evtSource = new EventSource('sse.php');
var eventList = document.querySelector('ul');

evtSource.onmessage = function(e) {
  var newElement = document.createElement("li");

  newElement.textContent = "message: " + e.data;
  eventList.appendChild(newElement);
}
```
