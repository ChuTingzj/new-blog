---
title: "React"
description: "record for react"
---

### 脚手架create-react-app

```
npm install create-react-app -g
```

```shell
create-react-app app-name
```

### 创建根节点

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
const root = createRoot(document.querySelector('#root'))
root.render(
  <div>
    <h1>React</h1>
  </div>
)
```

```tsx
import React from 'react'
import ReactDom from 'react-dom/client'
ReactDom.render(
    <div>
      <h1>React</h1>
      </div>,
    document.querySelector('#root')
)
```

### 组件

#### class组件

```tsx
//class.js
import { Component } from 'react'
export default class App extends Component {
  render() {
    return <div>hello,react component</div>
  }
}
```

```tsx
//index.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/class.js'
const root = createRoot(document.querySelector('#root'))
root.render(<App />)
```

#### 函数组件

```tsx
//16.8无状态组件
export default function App() {
  return (
    <section>
      <h1>hello functional component</h1>
    </section>
  )
}
```

#### 组件的嵌套

```tsx
import { Component } from 'react'
class Children1 extends Component {
  render() {
    return (
      <div>
        children1
        <Children2></Children2>
        <Children3></Children3>
      </div>
    )
  }
}
function Children2() {
  return <div>children2</div>
}
const Children3 = () => <div>children3</div>
export default class App extends Component {
  render() {
    return (
      <section>
        <Children1></Children1>
        <Children2></Children2>
        <Children3></Children3>
      </section>
    )
  }
}
```

#### 组件样式

```tsx
//行内
function Children2() {
  return <div style={{ color: 'skyblue' }}>children2</div>
}
//抽离变量
class Children1 extends Component {
  render() {
    var obj = {
      color: 'red'
    }
    return (
      <div style={obj}>
        children1
        <Children2></Children2>
        <Children3></Children3>
      </div>
    )
  }
}
//外部引入css文件
```

#### 事件处理

```jsx
import React from 'react'
//行内
export default function event() {
  return (
    <div>
      <input type="text" />
      <button onClick={(event)=>{
        console.log(event)
      }}>add</button>
    </div>
  )
}
//外部定义方法
import React from 'react'
export default function event() {
  const onClick = (event) => {
      console.log(event)
  }
  return (
    <div>
      <input type="text" />
      <button onClick={onClick}>add</button>
    </div>
  )
}
//混合写法
import React from 'react'
export default function event() {
  const onClick = (event) => {
    console.log(111)
      console.log(event)
  }
  return (
    <div>
      <input type="text" />
      <button onClick={(event)=>{
        onClick(event)
      }}>add</button>
    </div>
  )
}
```

##### this指向问题

**普通函数的this，指向函数的调用者，React将事件进行了代理，并不会指向事件源**

**不需要关心事件的解绑，减少内存占用**

```jsx
import React from 'react'
export default function event() {
  const onClick = (event) => {
      console.log(event)
  }
  const click = function(){
    console.log(this)//undefined
  }
  return (
    <div>
      <input type="text" />
      <button onClick={click}>add</button>
    </div>
  )
}
```

### ref

```jsx
import React, { Component } from 'react'
export default class ref extends Component {
  render() {
    return (
      <div>
        <input type="text" ref="text" />
        <button
          onClick={(event) => {
            this.onClick(event)
          }}
        >
          add
        </button>
      </div>
    )
  }
  onClick(event) {
    this.refs.text.value = 2
  }
}
```

```jsx
import React, { Component } from 'react'
export default class ref extends Component {
  text = React.createRef()
  render() {
    return (
      <div>
        <input type="text" ref={this.text} />
        <button
          onClick={(event) => {
            this.onClick(event)
          }}
        >
          add
        </button>
      </div>
    )
  }
  onClick(event) {
    this.text.current.value = 2
  }
}
```

### 组件的数据挂载方式

#### 状态state

**状态是自己的，外部无法改变**

> 不要直接修改原状态

```tsx
import React, { Component } from 'react'
export default class state extends Component {
  state = {
    condition: true
  }
  render() {
    return (
      <div>
        <h1>React</h1>
        <button
          onClick={() => {
            this.setState({ condition: !this.state.condition })
          }}
        >
          {this.state.condition ? '按钮' : '改变'}
        </button>
      </div>
    )
  }
}
```

```jsx
import React, { Component } from 'react'

export default class state extends Component {
  constructor() {
    super()
    this.state = {
      condition: true
    }
  }
  render() {
    return (
      <div>
        <h1>React</h1>
        <button
          onClick={() => {
            this.setState({ condition: !this.state.condition })
          }}
        >
          {this.state.condition ? '按钮' : '改变'}
        </button>
      </div>
    )
  }
}
```

##### 列表渲染

```jsx
import React, { Component } from 'react'
export default class ListRender extends Component {
  state = {
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }
}
```

##### 条件渲染

```js
{this.state.list.length ? null : <h2>空空如也!</h2>}
```

```jsx
<h3 style={{ display: this.state.list.length ? 'none' : 'block' }}>空空如也!</h3>
```

##### 富文本展示

```jsx
<span dangerouslySetInnerHTML={{ __html: item }}></span>
```

##### setState的同步与异步

> 出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。
>
> 因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
>
> 如果你需要基于当前的 state 来计算出新的值，那你应该传递一个函数，而不是一个对象

```js
incrementCount() {
  this.setState((state) => {
    // 重要：在更新的时候读取 `state`，而不是 `this.state`。
    return {count: state.count + 1}
  });
}
```

**setState处在合成事件、hooks函数，异步更新；原生事件、定时器，同步更新**

**获取更新后的state**

```jsx
this.setState({num:++this.state.num},()=>{console.log(this.state.num)})
```

#### 属性props

**父子组件的通信**

```jsx
//父组件
import React, { Component } from 'react'
import NavBar from './NavBar'
export default class prop extends Component {
  render() {
      //批量传递prop
       //const prop = {
       //   title: '列表'
        //}
        //<div>
         // <h2>列表</h2>
          //<NavBar {...prop}></NavBar>
        //</div>
    return (
      <div>
        <div>
          <h2>首页</h2>
          <NavBar title="首页"></NavBar>
        </div>
        <div>
          <h2>列表</h2>
          <NavBar title="列表"></NavBar>
        </div>
        <div>
          <h2>购物车</h2>
          <NavBar title="购物车"></NavBar>
        </div>
      </div>
    )
  }
}
```

```jsx
//类组件
//子组件
import React, { Component } from 'react'
export default class NavBar extends Component {
  //父组件传递属性
  render() {
    return <div>NavBar-{this.props.title}</div>
  }
}
//函数式组件
//子组件
import React from 'react'
export default function SideBar(props) {
  return <div style={{ backgroundColor: props.bgc }}>SideBar</div>
}
```

##### 属性验证

```jsx
//类组件
import React, { Component } from 'react'
import PropType from 'prop-types'
export default class NavBar extends Component {
  static propTypes = {
    title: PropType.string
  }
  //父组件传递属性
  render() {
    return <div>NavBar-{this.props.title}</div>
  }
}
//函数式组件
import React from 'react'
import PropTypes from 'prop-types'
export default function SideBar(props) {
  return <div style={{ backgroundColor: props.bgc, marginTop: 20 }}>SideBar</div>
}
SideBar.propTypes = {
  bgc: PropTypes.string
}
```

##### 默认属性

```jsx
//类组件
import React, { Component } from 'react'
import PropType from 'prop-types'
export default class NavBar extends Component {
  static propTypes = {
    title: PropType.string
  }
  static defaultProps = {
    title: '主页'
  }
  //父组件传递属性
  render() {
    return <div>NavBar-{this.props.title}</div>
  }
}
//函数式组件
import React from 'react'
import PropTypes from 'prop-types'
export default function SideBar(props) {
  return <div style={{ backgroundColor: props.bgc, marginTop: 20 }}>SideBar</div>
}
SideBar.defaultProps = {
  bgc: 'black'
}
```

#### 属性&状态

##### 相同点

- 都是纯JS对象，都会触发render更新

##### 不同点

- 属性能从父组件获取，状态只属于组件自身
- 属性可以由父组件修改，状态不行
- 属性不在组件内修改，状态要在组件内部修改

### 表单组件

#### 非受控组件

**通过ref从DOM节点中获取表单数据，不利于数据共享**

#### 受控组件

**使state成为唯一数据源，渲染表单的同时还控制着表单发生的操作**

### 组件通信

#### 父子组件

##### 父传子

- 父组件传递属性props，子组件通过this.props/props访问
- ref引用，父组件拿到子组件的引用

##### 子传父

父组件向子组件通过props传递一个改变自身属性的函数，子组件通过props调用该函数

#### 非父子组件

##### 状态提升(中间人模式)

**同级的组件关系较适合**

将需要共享的状态抽离到最近的父组件，父组件通过props分发给子组件

##### 发布订阅模式

```js
//bus.js
export const bus = {
  list: [],
  subscribe(callback) {
    this.list.push(callback)
  },
  publish(params) {
    this.list.forEach((callback) => {
      callback?.(params)
    })
  }
}
```

```jsx
//发布者
import React, { Component } from 'react'
import { bus } from '../bus/bus'
export default class FilmItem extends Component {
  render() {
    return (
      <div
        onClick={() => {
          bus.publish(this.props.synopsis)
        }}
      >
        <img style={{ width: 300 }} src={this.props.poster} alt="" />
        <h4>{this.props.name}</h4>
        <div>{this.props.grade}</div>
      </div>
    )
  }
}
```

```jsx
//订阅者
import React, { Component } from 'react'
import { bus } from '../bus/bus'
export default class FilmDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info: ''
    }
    bus.subscribe((info) => {
      this.setState({
        info
      })
    })
  }
  render() {
    return (
      <div
        style={{
          width: 250,
          height: 300,
          backgroundColor: 'burlywood',
          position: 'fixed',
          right: 0,
          top: 0
        }}
      >
        {this.state.info}
      </div>
    )
  }
}
```

##### context状态树

**生产者消费者模式**

- 其中一个消费者调用生产者提供的方法，更改生产者中的状态触发render函数重新渲染页面

- 同时生产者将变动过后的状态共享出去，供消费者使用

```jsx
//生产者
import React, { Component } from 'react'
import axios from 'axios'
import FilmItem from './components/FilmItem'
import FilmDetail from './components/FilmDetail'
export const GlobalContext = React.createContext()
export default class Context extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filmList: []
    }
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=110100&pageNum=1&pageSize=10&type=1&k=9697347',
      headers: {
        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.0","e":"1657181444515554989309953"}',
        'X-Host': 'mall.film-ticket.film.list'
      }
    }).then((res) => {
      this.setState({
        filmList: res.data.data.films,
        info: ''
      })
    })
  }
  render() {
    return (
      <GlobalContext.Provider
        value={{
          info: this.state.info,
          changeInfo: (value) => {
            this.setState({
              info: value
            })
          }
        }}
      >
        <div>
          {this.state.filmList.map((item) => (
            <FilmItem {...item} key={item.filmId}></FilmItem>
          ))}
          <FilmDetail></FilmDetail>
        </div>
      </GlobalContext.Provider>
    )
  }
}
```

```jsx
//消费者1更改数据
import React, { Component } from 'react'
import { GlobalContext } from '../context'
export default class FilmItem extends Component {
  render() {
    return (
      <GlobalContext.Consumer>
        {(value) => {
          return (
            <div
              onClick={() => {
                value.changeInfo(this.props.synopsis)
              }}
            >
              <img style={{ width: 300 }} src={this.props.poster} alt="" />
              <h4>{this.props.name}</h4>
              <div>{this.props.grade}</div>
            </div>
          )
        }}
      </GlobalContext.Consumer>
    )
  }
}
```

```jsx
//消费者2接收数据
import React, { Component } from 'react'
import { GlobalContext } from '../context'
export default class FilmDetail extends Component {
  render() {
    return (
      <GlobalContext.Consumer>
        {(value) => {
          return (
            <div
              style={{
                width: 250,
                height: 300,
                backgroundColor: 'burlywood',
                position: 'fixed',
                right: 0,
                top: 0
              }}
            >
              {value.info}
            </div>
          )
        }}
      </GlobalContext.Consumer>
    )
  }
}
```

### 插槽

- 实现复用
- 减少父子通信

```jsx
//父组件
import React, { Component } from 'react'
import Children from '../components/children'
export default class Slot extends Component {
  state = {
    name: ''
  }
  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>
        <Children>
          <button
            onClick={() => {
              this.setState({
                name: 'zhangjing'
              })
            }}
          >
            签名
          </button>
        </Children>
      </div>
    )
  }
}
```

```jsx
//子组件
import React, { Component } from 'react'

export default class children extends Component {
  render() {
    return (
      <div style={{ backgroundColor: 'blueviolet' }}>
        <button
          onClick={() => {
            this.props.event()
          }}
        >
          disappear
        </button>
        {this.props.children}
        <ul>
          <li>1</li>
          <li>1</li>
          <li>1</li>
          <li>1</li>
          <li>1</li>
        </ul>
      </div>
    )
  }
}
```

### 生命周期

<img title="" src="file:///D:/A-Space/ChuTing/Konwledge is infinite🤑/前端/images/ReactLifeCircle.jpg" alt="ReactLifeCircle" data-align="inline">

#### 初始化

- **getDerivedStateFromProps：替代componentWillMount、componentWillReceiveProps的新生命周期**

返回值实现状态的更改

- ~~componentWillMount：render之前最后一次修改状态的机会~~

Fiber：Diff算法的更新

16.2版本之前，新老虚拟DOM树，同步比较的过程中，当数据量庞大时，会造成浏览器假死状态

Fiber将创建DOM、组件渲染，拆分成小的分片任务，优先级较低的任务的执行会被优先级较高的任务打断

- render：只能访问props和state，不允许修改状态和DOM输出
- componentDidMount：成功render并渲染成真实DOM之后触发，可以操作DOM

#### 运行中

- **getDerivedStateFromProps：替代componentWillMount、componentWillReceiveProps的新生命周期**

- ~~componentWillReceiveProps：父组件修改属性触发~~

componentWillReceiveProps(nextProps)

最先获得父组件传来的属性

- shouldComponentUpdate：返回false会阻止render调用

新老状态相同时，避免render函数的频繁触发

```tsx
  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(this.state) !== JSON.stringify(nextState)) return true
    return false
  }
```

- ~~componentWillUpdate：不能修改属性和状态~~
- render
- getSnapshotBeforeUpdate：取代componentWillUpdate，在render之后、dom渲染之前返回一个值，作为componentDidUpdate的第三个参数，用于记录旧DOM的值
- componentDidUpdate：可以操作DOM

componentDidUpdate(preProps,preState)可以通过形参访问老的状态和属性

#### 销毁

- componentWillUnmount：在删除组件之前进行清理操作，清除定时器、事件解绑

### 性能优化

#### shouldComponentUpdate

#### PureComponent

自动比较新旧props、新旧state，控制shouldComponentUpdate的返回值

如果state和props永远会变，那么PureComponent并不会比较快的更新，shallowEqual也需要花时间

#### 函数式组件缓存memo

```tsx
import React, { memo } from 'react'

export default function Children() {
  return (
    <div>
      <h3>Children1</h3>
    </div>
  )
}


const Child = memo((props) => {
  return (
    <div>
      <h3>Children2</h3>
    </div>
  )
})
```

```tsx
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import Children from './components/Children'
export default class App extends Component<any, { name: string }>{
  state: Readonly<{ name: string }> = {
    name: 'Leo'
  }
  render() {
    return (
      <div>
        <h1>App</h1>
        <h2>{this.state.name}</h2>
        <Button color='success' size='large' onClick={() => {
          this.setState({
            name: 'Cliff'
          })
        }}>Change</Button>
        <Children></Children>
      </div>
    )
  }
}
```

### Hooks

#### useState

保存组件的状态，返回值是一个数组，数组的第一项是对应的状态，第二项是一个函数用于状态的改变

```jsx
import React, { useState } from 'react'
export default function useStateFunc() {
  const [name, setName] = useState('State')
  return (
    <div>
      <h1>{name}</h1>
      <button
        onClick={() => {
          setName('Changed!')
        }}
      >
        改变
      </button>
    </div>
  )
}
```

#### useEffect

默认执行一次，后续依赖变化会再次更新

第一参数是一个回调函数，第一次、依赖更新时会执行

第二参数接受一个数组参数，用于存放依赖，如果为空那么useEffect只会执行一次

清除副作用：在回调函数内部返回函数，在组件销毁、依赖更新时触发

```jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function useEffectFunc() {
  const [list, setList] = useState([])
  useEffect(() => {
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=110100&ticketFlag=1&k=2758073',
      headers: {
        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.0","e":"1657181444515554989309953"}',
        'X-Host': 'mall.film-ticket.cinema.list'
      }
    }).then((res) => {
      setList(res.data.data.cinemas)
    })
      return ()=>{
          //清除副作用
      }
  }, [//依赖项])
  return (
    <div>
      <h1>{list.length}</h1>
    </div>
  )
}
```

#### useLayoutEffect

与useEffect调用时机不同，useLayoutEffect会在DOM更新之后马上同步调用，会阻塞页面渲染，而useEffect会在整个页面渲染完才会调用

useLayoutEffect适合操作DOM，只会有一次回流、重绘

#### useCallback

每一次调用useState的set方法，都会导致组件重新渲染，以至于普通数据和方法都会被重新赋值

useCallback起到缓存作用，当第二个参数变化了，才会重新声明

- 只有相关依赖改变，对应函数才会被重新声明
- 传入空数组，第一次的状态就会被保存，后期状态变化，获取的还是旧状态
- 不传第二个参数，每次都会被重新声明一次，useCallback就失去意义了

```jsx
import React, { useState, useCallback } from 'react'

export default function useCallbackFun() {
  const [count, setCount] = useState(0)
  //count永远为0
  const handle = useCallback(() => {
    console.log(count)
  }, [])
  const onClick = useCallback(() => {
    setCount(count + 1)
  }, [count])
  return (
    <div>
      <h1>useCallback</h1>
      <button onClick={onClick}>add</button>
      <button onClick={handle}>look</button>
      {count}
    </div>
  )
}
```

#### useMemo

完全可以取代useCallback，类似于计算属性

- useCallback不会执行第一个参数，而是将它返回
- useMemo会执行第一个参数并将执行结果返回
- useCallback用于记忆事件函数，将生成的事件函数传递给子组件使用
- useMemo适合经过函数计算得到一个确定的值

```jsx
import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
export default function useMemoFun() {
  const [list, setList] = useState([])
  const [text, setText] = useState('')
  useEffect(() => {
    axios({
      url: 'https://m.maizuo.com/gateway?cityId=110100&ticketFlag=1&k=2758073',
      headers: {
        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.2.0","e":"1657181444515554989309953"}',
        'X-Host': 'mall.film-ticket.cinema.list'
      }
    }).then((res) => {
      setList(res.data.data.cinemas)
    })
  }, [])
  const getCinemaList = useMemo(
    () =>
      list.filter(
        (item) =>
          item.name.toUpperCase().includes(text.toUpperCase()) ||
          item.address.toUpperCase().includes(text.toUpperCase())
      ),
    [list, text]
  )
  return (
    <div>
      <h1>useMemo</h1>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <ul>
        {getCinemaList.map((cinema, index) => (
          <li key={index}>
            <p>{cinema.name}</p>
            <p>{cinema.address}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### useRef

- 用于操作DOM，对标类组件的Reat.createRef()

- 保存状态

```jsx
import React, { useState, useRef, useCallback } from 'react'

export default function useRefFun() {
  let mynum = useRef(0)
  const [num, setNum] = useState(0)
  const onClick = useCallback(() => {
    setNum(num + 1)
    mynum.current++
    console.log(mynum, num)
  }, [mynum, num])
  return (
    <div>
      <h1>useRef</h1>
      <button onClick={onClick}>add</button>
      <button
        onClick={() => {
          console.log(mynum, num)
        }}
      >
        check
      </button>
    </div>
  )
}
```

#### useContext

简化context组件通信时消费者的代码风格，减少组件层级

useContext接受一个生产者，返回生产者提供的数据

```jsx
const value = useContext(Context)
```

#### useReducer

```jsx
import React, { useReducer } from 'react'
export default function useReducerFun() {
  const reducer = (preState, action) => {
    let newState = { ...preState }
    if (action.type === 'plus') {
      newState.count++
      return newState
    } else {
      newState.count--
      return newState
    }
  }
  const initialState = {
    count: 0
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      <h1>useReducer</h1>
      <button
        onClick={() => {
          dispatch({
            type: 'plus'
          })
        }}
      >
        +
      </button>
      {state.count}
      <button
        onClick={() => {
          dispatch({
            type: 'minus'
          })
        }}
      >
        -
      </button>
    </div>
  )
}
```

**useReducer+useContext实现全局数据共享**

视图逻辑、状态管理逻辑分离，实现代码的解耦

```js
//仓库储存状态、处理逻辑
export const initialState = {
  a: '111',
  b: '222'
}
export const reducer = (preState, action) => {
  let newState = { ...preState }
  switch (action.type) {
    case 'Children1':
      newState.a = action.value
      return newState
    case 'Children2':
      newState.b = action.value
      return newState
    default:
      return preState
  }
}
```

```jsx
//生产者将数据共享出去
import React, { useReducer } from 'react'
import Children1 from './components/Children1'
import Children2 from './components/Children2'
import { reducer, initialState } from './reducer'
export const Context = React.createContext()
export default function useReducer2() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
      <div>
        <h1>useReducer</h1>
        <Children1></Children1>
        <Children2></Children2>
      </div>
    </Context.Provider>
  )
}
```

```jsx
//消费者1
import React, { useContext } from 'react'
import { Context } from '../useReducer2'
export default function Children1() {
  const { dispatch, state } = useContext(Context)
  return (
    <div>
      <h2>Children1</h2>
      <h3>{state.a}</h3>
      <button
        onClick={() => {
          dispatch({
            type: 'Children1',
            value: 'Children1'
          })
        }}
      >
        改变A
      </button>
    </div>
  )
}
```

```jsx
//消费者2
import React, { useContext } from 'react'
import { Context } from '../useReducer2'
export default function Children2() {
  const { dispatch, state } = useContext(Context)
  return (
    <div>
      <h2>Children2</h2>
      <h3>{state.b}</h3>
      <button
        onClick={() => {
          dispatch({
            type: 'Children2',
            value: 'Children2'
          })
        }}
      >
        改变B
      </button>
    </div>
  )
}
```

#### useSyncExternalStore

`useSyncExternalStore`旨在供库使用，而不是应用程序代码。

让 React 组件在 concurrent 模式下安全地有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。当读取到外部状态发生了变化，会触发一个强制更新，来保证结果的一致性。

```js
useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
)
```

① subscribe 为订阅函数，当数据改变的时候，会触发 subscribe，在 useSyncExternalStore 会通过带有记忆性的 getSnapshot 来判别数据是否发生变化，如果发生变化，那么会强制更新数据。

② getSnapshot 可以理解成一个带有记忆功能的选择器。当 store 变化的时候，会通过 getSnapshot 生成新的状态值，这个状态值可提供给组件作为数据源使用，getSnapshot 可以检查订阅的值是否改变，改变的话那么会触发更新。

③ getServerSnapshot 用于 hydration 模式下的 getSnapshot。

```js
import { combineReducers , createStore  } from 'redux'

/* number Reducer */
function numberReducer(state=1,action){
    switch (action.type){
      case 'ADD':
        return state + 1
      case 'DEL':
        return state - 1
      default:
        return state
    }
}

/* 注册reducer */
const rootReducer = combineReducers({ number:numberReducer  })
/* 创建 store */
const store = createStore(rootReducer,{ number:1  })

function Index(){
    /* 订阅外部数据源 */
    const state = useSyncExternalStore(store.subscribe,() => store.getState().number)
    console.log(state)
    return <div>
        {state}
        <button onClick={() => store.dispatch({ type:'ADD' })} >点击</button>
    </div>
}
```

点击按钮，会触发 reducer ，然后会触发 store.subscribe 订阅函数，执行 getSnapshot 得到新的 number ，判断 number 是否发生变化，如果变化，触发更新。

#### useTransition

过渡是 React 18中的一个新概念，用于区分紧急和非紧急更新。

**紧急更新**反映了直接交互，例如键入、单击、按下等。

**非紧急（过渡）更新**将 UI 从一个视图转换到另一个视图。

打字、点击或按下等紧急更新需要立即响应，以符合我们对物理对象行为方式的直觉。否则用户会觉得“不对劲”。但是，过渡是不同的，因为用户不希望在屏幕上看到每个中间值。

useTransition 执行返回一个数组。数组有两个状态值：

- 第一个是，当处于过渡状态的标志——isPending。
- 第二个是一个方法，可以理解为上述的 startTransition。可以把里面的更新任务变成过渡任务。

```js
import { useTransition } from 'react' 
/* 使用 */
const  [ isPending , startTransition ] = useTransition ()
```

```jsx
/* 模拟数据 */
const mockList1 = new Array(10000).fill('tab1').map((item,index)=>item+'--'+index )
const mockList2 = new Array(10000).fill('tab2').map((item,index)=>item+'--'+index )
const mockList3 = new Array(10000).fill('tab3').map((item,index)=>item+'--'+index )

const tab = {
  tab1: mockList1,
  tab2: mockList2,
  tab3: mockList3
}

export default function Index(){
  const [ active, setActive ] = React.useState('tab1') //需要立即响应的任务，立即更新任务
  const [ renderData, setRenderData ] = React.useState(tab[active]) //不需要立即响应的任务，过渡任务
  const [ isPending,startTransition  ] = React.useTransition() 
  const handleChangeTab = (activeItem) => {
     setActive(activeItem) // 立即更新
     startTransition(()=>{ // startTransition 里面的任务优先级低
       setRenderData(tab[activeItem])
     })
  }
  return <div>
    <div className='tab' >
       { Object.keys(tab).map((item)=> <span className={ active === item && 'active' } onClick={()=>handleChangeTab(item)} >{ item }</span> ) }
    </div>
    <ul className='content' >
       { isPending && <div> loading... </div> }
       { renderData.map(item=> <li key={item} >{item}</li>) }
    </ul>
  </div>
}
```

#### useDeferredValue

React 18 提供了 useDeferredValue 可以让状态滞后派生。useDeferredValue 的实现效果也类似于 transtion，当迫切的任务执行后，再得到新的状态，而这个新的状态就称之为 DeferredValue。

返回一个延迟响应的值，可以让一个`state` 延迟生效，**只有当前没有紧急更新时，该值才会变为最新值**。`useDeferredValue` 和 `useTransition` 一样，都是标记了一次非紧急更新。

useDeferredValue 和上述 useTransition 本质上有什么异同呢？

 **相同点：** `useDeferredValue` 本质上和内部实现与 `useTransition` 一样都是标记成了过渡更新任务。

**不同点：** `useTransition` 是把更新任务变成了延迟更新任务，而 `useDeferredValue` 是产生一个新的值，这个值作为延时状态。

useDeferredValue 接受一个参数 value ，一般为可变的 state , 返回一个延时状态 deferrredValue。

```js
const deferrredValue = React.useDeferredValue(value)
```

```jsx
export default function Index(){
  const [ active, setActive ] = React.useState('tab1') //需要立即响应的任务，立即更新任务
  const deferActive = React.useDeferredValue(active) // 把状态延时更新，类似于过渡任务
  const handleChangeTab = (activeItem) => {
     setActive(activeItem) // 立即更新
  }
  const renderData = tab[deferActive] // 使用滞后状态
  return <div>
    <div className='tab' >
       { Object.keys(tab).map((item)=> <span className={ active === item && 'active' } onClick={()=>handleChangeTab(item)} >{ item }</span> ) }
    </div>
    <ul className='content' >
       { renderData.map(item=> <li key={item} >{item}</li>) }
    </ul>
  </div>
  }
```

#### useInsertionEffect

useInsertionEffect 执行 -> useLayoutEffect 执行 -> useEffect 执行

useInsertionEffect 的执行的时候，DOM 还没有更新。本质上 useInsertionEffect 主要是解决 CSS-in-JS 在渲染中注入样式的性能问题。这个 hooks 主要是应用于这个场景，在其他场景下 React 不期望用这个 hooks 。

```jsx
export default function Index(){

  React.useInsertionEffect(()=>{
     /* 动态创建 style 标签插入到 head 中 */
     const style = document.createElement('style')
     style.innerHTML = `
       .css-in-js{
         color: red;
         font-size: 20px;
       }
     `
     document.head.appendChild(style)
  },[])

  return <div className="css-in-js" > hello , useInsertionEffect </div>
}
```

#### useImperativeHandle

useImperativeHandle 可以配合 forwardRef 自定义暴露给父组件的实例值。

useImperativeHandle 接受三个参数：

- ① 第一个参数ref: 接受 forWardRef 传递过来的 ref。
- ② 第二个参数 createHandle ：处理函数，返回值作为暴露给父组件的 ref 对象。
- ③ 第三个参数 deps : 依赖项 deps ，依赖项更改形成新的 ref 对象。

```tsx
import {  useRef,forwardRef,MutableRefObject,useImperativeHandle,Ref} from "react";

//只暴露value、getType、focus给父级
const InputEl = forwardRef((props: {}, ref: Ref<any>): JSX.Element=>{
    const inputEl: MutableRefObject<any> = useRef();

    useImperativeHandle(ref, ()=>({//第一个参数：暴露哪个ref；第二个参数：暴露什么
        value: (inputEl.current as HTMLInputElement).value,
        getType: () => (inputEl.current as HTMLInputElement).type,
        focus: () => (inputEl.current as HTMLInputElement).focus()
    }));

    return(
        <input ref={inputEl} type="text" {...props}/>
    )
})
//暴露整个input节点给父级
const InputEl = forwardRef((props: {}, ref: Ref<any>): JSX.Element=>{
    return(
        <input ref={ref} type="text" {...props}/>
    )
});

//父级
function InputWithFocusButton() {
    const inputEl: MutableRefObject<any> = useRef(null);

    function onButtonClick() {
        console.log('子组件input的对象:', inputEl.current);
        inputEl.current.focus();
    };
    return (
        <>
            <InputEl ref={inputEl} />
            <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}
```

#### 自定义hooks

将两个函数之间逻辑相同的部分抽离为一个新函数

### 路由

#### react-router-dom

```
npm install react-router-dom -S
```

#### 基本使用

```jsx
import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Films from '../views/Films'
import Center from '../views/Center'
import Cinemas from '../views/Cinemas'
export default class Rou extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Route path="/films" component={Films}></Route>
          <Route path="/cinemas" component={Center}></Route>
          <Route path="/center" component={Cinemas}></Route>
        </HashRouter>
      </div>
    )
  }
}
```

#### 路由重定向

##### 基本使用

```jsx
import React, { Component } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import Films from '../views/Films'
import Center from '../views/Center'
import Cinemas from '../views/Cinemas'
import NotFound from '../views/NotFound'
export default class Rou extends Component {
  render() {
    return (
      <div>
        <HashRouter>
            <Route path="/films" component={Films}></Route>
            <Route path="/cinemas" component={Center}></Route>
            <Route path="/center" component={Cinemas}></Route>
            <Redirect  from="/" to="/films"></Redirect>
        </HashRouter>
      </div>
    )
  }
}
```

###### 问题

路由规则会匹配多次，‘/’：模糊匹配

###### 解决方案

引入switch组件，匹配成功一个直接跳出，不会连续匹配

```jsx
import React, { Component } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import Films from '../views/Films'
import Center from '../views/Center'
import Cinemas from '../views/Cinemas'
import NotFound from '../views/NotFound'
export default class Rou extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route path="/films" component={Films}></Route>
            <Route path="/cinemas" component={Center}></Route>
            <Route path="/center" component={Cinemas}></Route>
            <Redirect  from="/" to="/films"></Redirect>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}
```

##### 错误处理

###### 精准匹配exact

```jsx
import React, { Component } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import Films from '../views/Films'
import Center from '../views/Center'
import Cinemas from '../views/Cinemas'
import NotFound from '../views/NotFound'
export default class Rou extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route path="/films" component={Films}></Route>
            <Route path="/cinemas" component={Center}></Route>
            <Route path="/center" component={Cinemas}></Route>
            <Redirect exact from="/" to="/films"></Redirect>
            <Route component={NotFound}></Route>
          </Switch>
        </HashRouter>
      </div>
    )
  }
}
```

#### 嵌套路由

```jsx
import React from 'react'
import { Route } from 'react-router-dom'
import Children1 from './components/children1'
export default function Films() {
  return (
    <div>
      Films
      <Route path="/films/children1" component={Children1}></Route>
    </div>
  )
}
```

#### 声明式、编程式导航

```jsx
//请在<xxxRouter>组件内使用
<NavLink to="/films" activeClassName="//自定义激活类名">电影</NavLink>
```

```jsx
import {useHistory} from 'react-router-dom'
const history = useHistory()
history.push('/films')
```

#### 动态路由

##### 路径传参

```jsx
<Route path="/cinema/:id" component={Cinema}></Route>
history.push(`/cinema/${id}`)
```

```jsx
//获取参数值
props.match.params
```

##### query传参

```jsx
props.history.push({pathname:'/cinema',query:{id:1}})
```

```jsx
props.location.query.id
```

##### state传参

```jsx
props.history.push({pathname:'/cinema',state:{id:1}})
```

```jsx
props.location.state.id
```

#### 路由守卫

```jsx
<Route path='/center' render={()=>{
        isAuth()?<Center></Center>:<Redirect to="/login"></Redirect>
    }}></Route>
<Route path="/login" component={Login}></Route>
```

##### 接受props参数

```jsx
<Route path='/center' render={(props)=>{
        isAuth()?<Center {...props}></Center>:<Redirect to="/login"></Redirect>
    }}></Route>
```

#### 路由模式

##### hash模式

```jsx
<HashRouter></HashRouter>
```

##### 历史模式

```jsx
<BrowserRouter></BrowserRouter>
```

#### withRouter

跨级传输路由方法

```jsx
import {withRouter} from 'react-router-dom'
const withFilmItem = withRouter(FilmItem)
```

#### V6

- element属性代替component、render
- <Outlet>标签实现嵌套路由
- useNavigate代替useHistory
- 移除NavLink的activeClassName、activeStyle属性
- useRoutes代替react-router-config
- <Routes>代替<Switch>

##### 重定向&404

```tsx
import React, { Component } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Film from '../views/Film'
import Center from '../views/Center'
import Cinema from '../views/Cinema'
import Redirect from '../components/Redirect'
import NotFound from '../components/NotFound'
export default class index extends Component {
  render() {
    return (
      <Routes>
        {/* <Route index element={<Film></Film>}></Route> 指定默认路由*/}
        <Route path='/film' element={<Film></Film>} ></Route>
        <Route path='/cinema' element={<Cinema></Cinema>} ></Route>
        <Route path='/center' element={<Center></Center>} ></Route>
        {/* <Route path='/' element={<Navigate to='/film'></Navigate>}></Route> */}
        <Route path='/' element={<Redirect to="/film"></Redirect>}></Route>
        <Route path='*' element={<NotFound></NotFound>}></Route>
      </Routes>
    )
  }
}
```

##### 嵌套路由

```tsx
import React, { Component } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Film from '../views/Film'
import Center from '../views/Center'
import Cinema from '../views/Cinema'
import Redirect from '../components/Redirect'
import NotFound from '../components/NotFound'
import Search from '../components/Search'
import NowPlaying from '../components/NowPlaying'
import ComingSoon from '../components/ComingSoon'
export default class index extends Component {
  render() {
    return (
      <Routes>
        <Route index element={<Film></Film>}></Route>
        <Route path='/film' element={<Film></Film>} >
          <Route index element={<NowPlaying></NowPlaying>}></Route>
          <Route path='nowplaying' element={<NowPlaying></NowPlaying>}></Route>
          <Route path='comingsoon' element={<ComingSoon></ComingSoon>}></Route>
        </Route>
        <Route path='/cinema' element={<Cinema></Cinema>} ></Route>
        <Route path='/cinema/search' element={<Search></Search>}></Route>
        <Route path='/center' element={<Center></Center>} ></Route>
        {/* <Route path='/' element={<Navigate to='/film'></Navigate>}></Route> */}
        {/* <Route path='/' element={<Redirect to="/film"></Redirect>}></Route> */}
        <Route path='*' element={<NotFound></NotFound>}></Route>
      </Routes>
    )
  }
}
```

```tsx
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Film() {
  return (
    <div>
      <h1>Film</h1>
      <Outlet></Outlet>
    </div>
  )
}
```

##### 声明式、编程式导航

```tsx
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './TarBar.css'
export default function TabBar() {
  return (
    <div>
      <ul>
        <li>
          <NavLink to='/film' className={({ isActive }) => isActive ? 'linkActive' : ''}>电影</NavLink>
        </li>
        <li>
          <NavLink to='/cinema' className={({ isActive }) => isActive ? 'linkActive' : ''}>影院</NavLink>
        </li>
        <li>
          <NavLink to='/center' className={({ isActive }) => isActive ? 'linkActive' : ''}>我的</NavLink>
        </li>
      </ul>
    </div>
  )
}
```

```tsx
import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function NowPlaying() {
  const navigate = useNavigate()
  const [filmList, setFilmList] = useState([])
  useEffect(() => {
    fetch('https://m.maizuo.com/gateway?cityId=310100&pageNum=1&pageSize=10&type=1&k=3999559', {
      headers: {
        'X-Client-Info': '{ "a": "3000", "ch": "1002", "v": "5.2.0", "e": "16583140251277568086966273", "bc": "310100" }',
        'X-Host': 'mall.film-ticket.film.list'
      }
    }).then(res => res.json()).then(res => {
      setFilmList(res.data.films)
    })
  }, [])
  return (
    <div>
      <h1>NowPlaying</h1>
      <ul>
        {
          filmList.map((item: any) => <li key={item.filmId} onClick={() => {
            navigate(`/detail?id=${item.filmId}`)
          }}>{item.name}</li>)
        }
      </ul>
    </div>
  )
}
```

```tsx
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'antd-mobile'
export default function Detail() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = searchParams.get('id')
  return (
    <div>
      <h1>Detail</h1>
      <div>{params}</div>
      <Button color='primary' onClick={() => {
        setSearchParams({ id: '4567' })
      }}>跳转到另一电影</Button>
    </div>
  )
}
```

##### 动态路由&param传参

```tsx
        <Route path='/detail/:id' element={<Detail></Detail>}></Route>
```

```tsx
import React from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { Button } from 'antd-mobile'
export default function Detail() {
  const [searchParams, setSearchParams] = useSearchParams()//查询参数
  const param = useParams()//动态路径参数
  const params = searchParams.get('id')
  return (
    <div>
      <h1>Detail</h1>
      <div>{param.id}</div>
      <Button color='primary' >跳转到另一电影</Button>
    </div>
  )
}
```

##### 路由拦截

```tsx
 <Route path='/center' element={<AuthComponent>
          <Center></Center>
        </AuthComponent>} ></Route>
```

```tsx
//中转组件
import React from 'react'
import Redirect from './Redirect'
export default function AuthComponent(props: any) {
  const token = localStorage.getItem('token')
  return (
    <div>
      {
        token ? props.children : <Redirect to='/login'></Redirect>
      }
    </div>
  )
}
```

##### 懒加载

```tsx
import React from "react"
export const LazyLoad = (path: string) => {
  const Component = React.lazy(() => import(path))
  return (
    <React.Suspense fallback={<div>加载中...</div>}>
      <Component></Component>
    </React.Suspense>
  )
}
```

##### 配置式路由useRoutes

```tsx
import { useRoutes } from 'react-router-dom'
import ComingSoon from '../components/ComingSoon'
import NowPlaying from '../components/NowPlaying'
import Redirect from '../components/Redirect'
import Cinema from '../views/Cinema'
import Film from '../views/Film'
export default function Router() {
  const element = useRoutes([
    {
      path: '/film',
      element: <Film></Film>,
      children: [
        {
          path: '',
          element: <Redirect to='/film/nowplaying'></Redirect>
        },
        {
          path: 'nowplaying',
          element: <NowPlaying></NowPlaying>
        },
        {
          path: 'comingsoon',
          element: <ComingSoon></ComingSoon>
        }
      ]
    },
    {
      path: '/cinemas',
      element: <Cinema></Cinema>
    }
  ])
  return element
}
```

##### 路由缓存

```jsx
<Route path="/goods-list" component={GoodsList} />
                    //vs//
<Route path="/goods-list" children={({ match }) => <GoodsList />)} />
```

> `children` 无论在 `path` 是否匹配的情况下，是`都能渲染`的。
>
> `都能渲染` 换而言之就是组件 `不被卸载`。这就意味着，原先在页面上的所有东西（无论是状态还是数据，无论是受控还是不受控），都会始终存在。这样就能解决本文一开始提到的，当从 `列表页` 跳到 `详情页` 后，`列表页` 被卸载，导致数据被清除的问题。

### 反向代理

#### http-proxy-middleware

```shell
npn install http-proxy-middleware -S
```

```js
//setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '',
      changeOrigin: true
    })
  )
}
```

### CSSModule

```css
//Film.module.css
.film{
    color:blue;
    border:1px solid #fff;
}
:global(#color){
    color:red
}
```

```jsx
import style from 'Film.module.css'
function Film(){
    return (
        <div className={style.film}></div>
    )
}
```

### 状态管理

#### Flux架构思想

利用单向数据流的方式来组合React中的视图组件，更像是一个模式

![Flux](D:\A-Space\ChuTing\Konwledge is infinite🤑\前端\images\Flux.png)

1. 用户访问view
2. view发出用户的action
3. Dispatcher收到action，要求store进行相应的更新
4. store更新后，发出一个change事件
5. view收到change事件后，更新页面

#### Flux的实现：Redux

- state以单一对象存储在store对象中
- state只读（每次都返回一个新的对象）
- 使用纯函数reducer执行state更新（没有副作用）

```js
//仓库
import { createStore } from 'redux'
const reducer = (preState = { show: true }, action) => {
  let newState = { ...preState }
  switch (action.type) {
    case 'Children':
      newState.show = false
      return newState
    default:
      return preState
  }
}
const store = createStore(reducer)
export default store
```

```jsx
//订阅者
import React, { Component } from 'react'
import store from './store/store'
import PureChildren from './components/PureChildren'
export default class App extends Component {
  state = {
    isShow: store.getState().show
  }
  componentDidMount() {
    store.subscribe(() => {
      console.log('订阅！')
      this.setState({
        isShow: store.getState().show
      })
    })
  }
  render() {
    return (
      <div>
        <h1>App</h1>
        <PureChildren></PureChildren>
      </div>
    )
  }
}
```

```jsx
//发布者
import React, { useEffect } from 'react'
import store from '../store/store'
export default function PureChildren() {
  useEffect(() => {
    store.dispatch({
      type: 'Children'
    })
    return () => {
      console.log('Destroyed!')
    }
  }, [])
  return (
    <div>
      <h2>PureChildren</h2>
    </div>
  )
}
```

##### 简易原理

```js
function createStore(reducer){
    const list = []
    let state = reducer(undefined,{})
    function subscribe(callback){
        list.push(callback)
    }
    function dispatch(action){
        state = reducer(state,action)
        for(let i in list){
            list[i]?.()
        }
    }
    function getState(){
        return 
    }
    return {
        subscribe,
        dispatch,
        getState
    }
}
```

##### Reducer合并

```js
//reducer1
const reducer1 = (preState = { show: true }, action) => {
  let newState = { ...preState }
  switch (action.type) {
    case 'Children1':
      newState.show = false
      return newState
    default:
      return preState
  }
}
export default reducer1
```

```js
const reducer2 = (preState = { show: true }, action) => {
  let newState = { ...preState }
  switch (action.type) {
    case 'Children2':
      newState.show = false
      return newState
    default:
      return preState
  }
}
export default reducer2
```

```js
//store.js
import { createStore, combineReducers } from 'redux'
import reducer1 from './reducers/reducer1'
import reducer2 from './reducers/reducer2'
const reducer = combineReducers(reducer1, reducer2)
const store = createStore(reducer)
export default store
```

```js
//访问状态
store.getState().reducer1.show
```

##### Redux中间件

###### redux-thunk

用于发起异步请求

```shell
npm install redux-thunk
```

```js
//原理
export default function thunkMiddleware({dispatch,getState}){
    return next => action =>{
        typeof action === 'function'?
            action(dispatch,getState):
            next(action)
    }
}
```

```js
//仓库
import {applyMiddleware,combineReducers} from 'redux'
import reduxThunk from 'redux-thunk'
const reducer = combineReducers({
    CityReducer,
    TabbarReducer,
    CinemaListReducer
})
const store = createStore(reducer,appluMiddleware(reduxThunk))
```

```js
//actions
function getCinemaList(){
    return (dispatch)=>{
        axios({/....../}).then(res=>{
            dispatch({
                type:'CinemaList',
                data:res.data
            })
        })
    }
}
```

```jsx
//发布者、订阅者
import store from 'store.js'
import {useState} from 'react'
const [list,setList] = useState(store.getState().CinemaListReducer.list)
useEffect(()=>{
    store.dispatch(getCinemaList())
    //❗问题：订阅者的累积wu
    let subscribe = store.subscribe(()=>{
        setList(store.getState().CinemaListReducer.list)
    })
    return ()=>{
        subscribe()
    }
})
```

###### redux-promise

另一种代码风格

```
npm install redux-promise
```

```js
//仓库
import {applyMiddleware,combineReducers} from 'redux'
import reduxThunk from 'redux-thunk'
import reduxPromise from 'redux-promise'
const reducer = combineReducers({
    CityReducer,
    TabbarReducer,
    CinemaListReducer
})
const store = createStore(reducer,appluMiddleware(reduxThunk,reduxPromise))
```

```js
//actions
async function getCinemaList(){
    let list = await axios({/..../}).then(res=>{
        return {
            type:'CinemaList',
            data:res.data
        }
    })
    return list
}
export default getCinemaList
```

###### redux-saga

全局监听器和接收器使用Generator函数和saga自身的一些辅助函数实现对整个流程的管控

使action所传参数保持是一个对象，异步请求依靠call来解决

![](D:\A-Space\ChuTing\Konwledge is infinite🤑\前端\images\redux-saga.png)

**基本使用**

```js
//store
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleWare from 'redux-saga'
import watchSaga from './saga.js'
import reducer from './reducer/countSlice'
const SagaMiddleWare = createSagaMiddleWare()
export const store = configureStore({
  middleware: [SagaMiddleWare],
  reducer: reducer
})
SagaMiddleWare.run(watchSaga)
```

```js
//reducer
function reducer(
  preState = {
    value: 0,
    title: 'redux toolkit pre',
    list: []
  },
  action
) {
  switch (action.type) {
    case 'changeList':
      return { ...preState, list: action.payload }

    default:
      return preState
  }
}
// 默认导出
export default reducer
```

```js
//saga.js
import { take, fork, call, put } from 'redux-saga'
export default function* watchSaga() {
  while (true) {
    //监听组件的action
    yield take('get-list')
    //执行异步处理函数
    yield fork(getList)
  }
}
function* getList() {
  //发送异步请求
  let res = yield call(getListAction)
  //发出新的action
  yield put({
    type: 'changeList',
    payload: res
  })
}
function getListAction() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([1, 2, 3, 4, 5, 6])
    }, 2000)
  })
}
```

```jsx
//UI
import React, { Component } from 'react'
import { Button } from 'antd-mobile'
import { store } from './redux-saga-store.js'
export default class SagaApp extends Component {
  render() {
    return (
      <div>
        <h1>SagaApp</h1>
        <Button
          color="success"
          onClick={() => {
            if (store.getState().list.length === 0) {
              store.dispatch({
                type: 'get-list'
              })
            } else {
            }
          }}
        >
          异步缓存
        </Button>
      </div>
    )
  }
}
```

**监听多个saga**

```js
import {all} from 'readux-saga'
import watchSaga1 from 'saga1.js'
import watchSaga2 from 'saga2.js'
function *watchSaga(){
    yield all([watchSaga1(),watchSaga2()])
}
```

**takeEvery**

```js
import {takeEvery} from 'redux-saga/effects'
function *watchSaga1(){
    yield takeEvery('getList1',getList1)
}
function *watchSaga2(){
    yield takeEvery('getList2',getList2)
}

function *watchSaga(){
    yield takeEvery('getList1',getList1)
    yield takeEvery('getList2',getList2)
}
```

#### react-redux

对react更好适配

connect函数生成一个父组件，负责订阅、取消订阅

```
npm install react-redux
```

```js
//store.js
import { createStore } from 'redux'
import reducer from './reducers'
export const store = createStore(reducer)
```

```js
//reducer.js
const reducer = (preState = { num: 123 }, action) => {
  switch (action.type) {
    case 'number':
      return { ...preState, num: action.value }
    default:
      return preState
  }
}
export default reducer
```

```js
//action.js
export default function changeNum(value) {
  return {
    type: 'number',
    value
  }
}
```

```jsx
//main.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './react-redux/App'
import { store } from './react-redux/store/store.js'
const root = createRoot(document.querySelector('#root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

```js
//App.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import changeNum from './store/actions/index'
class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <h2>{this.props.num}</h2>
        <button
          onClick={() => {
            this.props.changeNum(123456789)
          }}
        >
          改变
        </button>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    num: state.num
  }
}
const mapStateToDispatch = {
  changeNum
}
export default connect(mapStateToProps, mapStateToDispatch)(App)
```

##### 原理

- connect高阶组件
- Provider组件，可以让容器拿到state，使用了context

```jsx
function connect(callback,obj){
    var value = callback()
    return ()=>{
        return (Component)=>{
            return (
                <div>
                    <Component {...obj} {...value}></Component>
                </div>
            )
        }
    }
}
```

#### 持久化储存

```jsx
//persistReducer.js
import storage from 'react-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import reducer from '../reducers/index'
import { createStore } from 'redux'
const persistConfig = {
  key: 'root',
  storage,
  whitelist:['reducer']
}
const store = createStore(reducer)
const persist = persistReducer(persistConfig, reducer)
let persister = persistStore(persist)
export { persister, store }
```

```jsx
//index.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './react-redux/App'
import { store,persister } from './react-redux/store/store.js'
const root = createRoot(document.querySelector('#root'))
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
         <App />
    </PersistGate>
  </Provider>
)
```

#### Immutable

##### immutable的优化

persistent data structure（持久化数据结构），使用旧数据创建新数据时，要保证旧数据同时可用且不变，同时为了避免深拷贝把所有节点都复制一遍带来的性能损耗，使用了structure sharing（结构共享），如果对象中的一个节点发生变化，只修改这个节点和受它影响的父节点，其他节点进行共享

##### Map、List

```jsx
import {Map,List} from 'immutable'
const obj = {
    name:'mike',
    age:20
}
const oldObj = Map(obj)
//新对象的改变不会对老对象造成改变
const newObj = oldObj.set('name','curry').set('age',100)
const oldArr = List([1,2,3])
this.setState({
    obj:newObj.toJS()
})
//能够根据新老state判断是否更新
shouldComponentUpdate(nextProps){
    if(this.props.filter === nextProps.filter){
        return false
    }
    return true
}
//对象结构未知📍，快速转换
fromJS({
    name:'mike',
    location:{
        province:'北京',
        country:'朝阳区'
    }
})
this.state.setIn(['location','country'],'王府井')
this.state.updateIn(['....'],(list)=>list.splice(1,1))
```

#### Mobx

Mobx利用getter和setter来收集组件的数据依赖关系，从而在数据发生变化的时候精确知道哪些组件需要重绘，在界面的规模变大时，往往会有很多细粒度的更新

##### 基本使用

```jsx
import React, { Component } from 'react'
import { observable, autorun } from 'mobx'
let observerNum = observable.box(10)
const observerObj = observable.map({ a: 1 })
//TODO:1、🔔对普通类型的监听、第一次默认执行，之后每一次改变都会执行
autorun(() => {
  console.log(observerNum.get())
})
//TODO:2、🔔对对象类型的监听、第一次默认执行，之后每一次改变都会执行
autorun(() => {
  console.log(observerObj.get('a'))
})
setTimeout(() => {
  observerNum.set(20)
  observerObj.a = 123
}, 1000)

export default class App extends Component {
  render() {
    return <div>App</div>
  }
}
```

##### action

###### 普通语法

```js
import { observable, configure, action } from 'mobx'
//只能在action里改变数据
configure({
  enforceActions: 'always'
})
const store = observable(
  {
    isShow: true,
    list: [],
    cityName: '',
    changeShow() {
      this.isShow = !this.isShow
    }
  },
  {
    changeShow: action
  }
)
export default store
```

###### 装饰器语法

```
npm install @babel/core @babel/plugin-proposal-decorators @babel/preset-env
```

```babelrc
{
    'presets':[
        "@babel/preset-env"
    ],
    'plugins':[
        [
            "@babel/plugin-proposal-decorators",
            {
                "legacy":true
            }
        ]
    ]
}
```

```js
const path = require('path')
const { override, addDecoratorsLegacy } = require('customize-cra')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const customize = () => (config, env) => {
  config.resolve.alias['@'] = resolve('src')
  if (env === 'production') {
    config.externals = {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
  return config
}
module.exports = override(addDecoratorsLegacy(), customize())
```

```
npm install customize-cra react-app-rewired
```

```json
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```

```js
class Store {
  @observable isShow = true
  @observable list = []
  @action changeShow() {
    this.isShow = !this.isShow
  }
}
const store1 = new Store()
export { store1 }
```

##### runInAction

异步的action

```jsx
//useEffect中仍需取消订阅
class Store {
  @observable isShow = true
  @observable list = []
  @action changeShow() {
      axios({}).then(res=>{
         runInAction(()=>{
             this.isShow = !this.isShow
         })
      })
  }
}
const store1 = new Store()
export { store1 }
```

##### mobx-react

```
npm install mobx-react
```

```js
//main.js
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/mobx/App'
import 'antd/dist/antd.css'
import store from './mobx/store'
import { Provider } from 'mobx-react'
const root = createRoot(document.querySelector('#root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

```jsx
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
@inject('store')
@observer
export default class App extends Component {
  state = {
    isShow: false
  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    return <div>App</div>
  }
}
```

```jsx
import { inject, observer,Observer } from 'mobx-react'
export default function App() {
  return (
    <div>
      <Observer>
        {
          ()=>{
            return (
              <div>App</div>
            )
          }
        }
      </Observer>
    </div>
  )
```

### TS

#### 类组件

```tsx
//父组件
import React, { Component } from 'react'
import Children from './components/Children'
export default class App extends Component<any, { name: string }> {
  state = {
    name: 'mike'
  }
  render() {
    return (
      <div>
        <h1>App</h1>
        <h2>{this.state.name}</h2>
        <button onClick={() => {
          this.setState({
            name: 'curry'
          })
        }}>change</button>
        <Children name={this.state.name}></Children>
      </div>
    )
  }
}
```

```tsx
//子组件
import React, { Component } from 'react'
export default class Children extends Component<{ name: string }> {
  render() {
    return (
      <div>
        <h1>Children</h1>
        <h2>{this.props.name}</h2>
      </div>
    )
  }
}
```

#### 函数式组件

```tsx
import React, { useState, useRef } from 'react'

export default function App() {
  const [name, setName] = useState<string>('TYPESCRIPT')
  const text = useRef<HTMLInputElement>(null)
  return (
    <div>
      <h1>App</h1>
      <p>{name}</p>
      <input type="text" ref={text} />
      <button onClick={() => {
        setName(name.toLowerCase())
        console.log(text.current?.value)
      }}>转小写</button>
    </div>
  )
}

const Child: React.FC<{ name: string }> = (props) => {
  return <div>{props.name}</div>
}
```

### CSS in JS

#### styled-components

```tsx
import React from 'react'
import styled from 'styled-components'
const StyledFooter = styled.footer`
background:yellow;
width:100%;
height:50px;
div{
  color:red;
}
`
export default function App() {
  return (
    <StyledFooter>
      <div>App</div>
    </StyledFooter>

  )
}
```

#### 透传props

```tsx
//原生样式
export default function App() {
  return (
    <StyledFooter style={{ textShadow: '5px 5px #558ABB' }}>
      <div>App</div>
    </StyledFooter>
  )
}
```

```tsx
//自定义属性
import React from 'react'
import styled from 'styled-components'
const StyledFooter = styled.footer`
background:yellow;
width:100%;
height:50px;
div{
  color:red;
}
transform:rotate(${(props: { deg: string }) => props.deg}turn)
`
export default function App() {
  return (
    <StyledFooter deg='0.9' style={{ textShadow: '5px 5px #558ABB' }}>
      <div>App</div>
    </StyledFooter>
  )
}
```

#### 继承

```tsx
const StyleButton1 = styled.button`
width:100px;
height:100px;
`
const StyleButton2 = styled(StyleButton1)`
border-radius:50%`
```

#### 动画

```tsx
import styled, { keyframes } from 'styled-components'
const keyFrame = keyframes`
from{
  transform:rotate(0deg)
}
to{
  transform:rotate(360deg)
}
`
const StyleButton2 = styled(StyleButton1)`
border-radius:50%;
animation:${keyFrame} 2s infinite linear;
`
```

### 单元测试

```js
import shallowRender from 'react-test-render/shallowRender'
import App from '../App'
describe('react-test-render', function () {
  it('app ', function () {
    const render = new shallowRender()
    render.render(<App></App>)
    expect(render.getRenderOutput().props.children[0].type).toBe('h1')
  })
})
```

```js
import shallowRender from 'react-test-render/shallowRender'
import ReactTestUtil from 'react-dom/test-utils'
import App from '../App'
describe('react-test-render', function () {
  it('app ', function () {
    const render = new shallowRender()
    render.render(<App></App>)
    expect(render.getRenderOutput().props.children[0].type).toBe('h1')
  })
  it('删除功能', function () {
    const app = ReactTestUtil.renderIntoDocument(<App></App>)
    let todoItems = ReactTestUtil.scryRenderedDOMComponentsWithTag(app, 'li')
    console.log(todoItems)
    let deleteButton = todoItems[0].querySelector('button')
    ReactTestUtil.Simulate.click(deleteButton)
    let todoItemsAfter = ReactTestUtil.scryRenderedDOMComponentsWithTag(app, 'li')
    expect(todoItems.length - 1).toBe(todoItemsAfter.length)
  })
  it('添加功能', function () {
    const app = ReactTestUtil.renderIntoDocument(<App></App>)
    let todoItems = ReactTestUtil.scryRenderedDOMComponentsWithTag(app, 'li')
    console.log(todoItems)
    let addInput = ReactTestUtil.scryRenderedDOMComponentsWithTag(app, 'input')
    addInput.value = '123465789'
    let addButton = ReactTestUtil.findRenderedDOMComponentWithClass(app, 'add')
    ReactTestUtil.Simulate.click(addButton)
    let todoItemsAfter = ReactTestUtil.scryRenderedDOMComponentsWithTag(app, 'li')
    expect(todoItemsAfter.length).toBe(todoItems.length + 1)
  })
})
```

#### enzyme

```js
import Enzyme, { shallow, mount } from 'enzyme'
import App from '../App'
import adapter from '@wojtekmaj/enzyme-adapter-react-17'
Enzyme.configure({ adapter: new adapter() })
describe('enzyme-test-render', function () {
  it('app ', function () {
    let app = shallow(<App></App>)
    expect(app.find('h1').text()).toEqual('App')
  })
  it('删除功能', function () {
    let app = mount(<App></App>)
    let todoLength = app.find('li').length
    app.find('button.del').at(0).simulate('click')
    expect(app.find('li').length).toEqual(todoLength - 1)
  })
  it('添加功能', function () {
    let app = mount(<App></App>)
    let todoLength = app.find('li').length
    let addInput = app.find('input')
    addInput.value = '123456789'
    app.find('.add').simulate('click')
    expect(app.find('li').length).toEqual(todoLength + 1)
  })
})
```

### Protal

提供一个在父组件包含DOM结构层外的DOM节点渲染组件的方法

```tsx
import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import { Button } from 'antd-mobile'
export default class PortalDialog extends Component<{ clickHandle: () => void }, any> {
  render() {
    return createPortal(<div style={{
      width: '100%', height: '100%', position: 'fixed',
      left: 0, top: 0, background: 'rgba(0,0,0,0.7)'
    }}>Dialog
      <Button color='success' size='large' onClick={this.props.clickHandle}>❎</Button>
    </div>, document.body)
  }
}
```

```tsx
import React, { Component } from 'react'
import './CSS/App.css'
import { Button } from 'antd-mobile'
import Dialog from './components/Dialog'
import PortalDialog from './components/PortalDialog'
export default class App extends Component<any, { show: boolean }> {
  state: Readonly<{ show: boolean }> = {
    show: false
  }
  render() {
    return (
      <div className='box'>
        <div className="left"></div>
        <div className="right">
          <Button size='large' color='warning' onClick={() => {
            this.setState((state) => {
              return {
                show: !state.show
              }
            })
          }}>展示</Button>
          {
            this.state.show ? <PortalDialog clickHandle={() => {
              this.setState((state) => {
                return {
                  show: !state.show
                }
              })
            }}></PortalDialog> : null
          }
        </div>
      </div>
    )
  }
}
```

### 懒加载

#### React.lazy+Suspense

```tsx
import React, { Component, Suspense } from 'react'
import { Button } from 'antd-mobile'
const Page1 = React.lazy(() => import('./components/Page1'))
const Page2 = React.lazy(() => import('./components/Page2'))
export default class App extends Component<any, { status: number }> {
  state: Readonly<{ status: number }> = {
    status: 1
  }
  changeStatus = (num: number) => {
    this.setState({
      status: num
    })
  }
  render() {
    return (
      <div>
        <Button color='primary' onClick={() => {
          this.changeStatus(1)
        }}>Page1</Button>
        <Button color='success' onClick={() => {
          this.changeStatus(2)
        }}>Page2</Button>
        <Suspense fallback={<h1>正在加载中.....</h1>}>
          {
            this.state.status === 1 ? <Page1></Page1> : <Page2></Page2>
          }
        </Suspense>
      </div>
    )
  }
}
```

### 函数式组件引用传递forwardRef

```tsx
import React, { Component, RefObject, forwardRef, ForwardedRef } from 'react'

export default class Children extends Component<{ callback: (elm: RefObject<HTMLInputElement>) => void }> {
  textRef = React.createRef<HTMLInputElement>()
  componentDidMount() {
    this.props.callback(this.textRef)
  }
  render() {
    return (
      <div>
        <h2>Children</h2>
        <input ref={this.textRef} type="text" defaultValue={'value'} />
      </div>
    )
  }
}
export const Children2 = forwardRef((props, ref: ForwardedRef<HTMLInputElement>) => {
  return <div>
    <h2>Children2</h2>
    <input defaultValue={'77777'} ref={ref} type="text" style={{ border: '1px solid red' }} />
  </div>
})
```

```tsx
import React, { Component, RefObject } from 'react'
import { Button } from 'antd-mobile'
import Children, { Children2 } from './components/Children'
export default class App extends Component {
  // textRef: RefObject<HTMLInputElement> | null = null
  textRef = React.createRef<HTMLInputElement>()
  render() {
    return (
      <div>
        <h1>App</h1>
        <Button color='success' onClick={() => {
          this.textRef!.current!.value = ''
          this.textRef?.current?.focus()
        }}>Focus</Button>
        {/* <Children callback={(elm) => {
          this.textRef = elm
        }}></Children> */}
        <Children2 ref={this.textRef}></Children2>
      </div>
    )
  }
}
```

## React扩展

### GraphQL

> 一个数据查询语言，成为RestfulAPI替代品，使客户端能够准确地获得它需要的数据，而且没有任何冗余，使API能够易于扩展

#### 基本使用

```js
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const schema = buildSchema(`
type Query{
  hello:String,
  getName:String,
  getAge:Int
}
`)
const root = {
  hello: () => {
    let str = 'hello'
    return str
  },
  getName: () => {
    return 'Cliff'
  },
  getAge: () => {
    return 100
  }
}
const app = express()
app.use('/home', function (req, res) {
  res.send('home,Data')
})
app.use('/list', function (req, res) {
  res.send('list,Data')
})
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.listen(3000)
```

![](D:\A-Space\ChuTing\Konwledge is infinite🤑\前端\images\graphql.jpg)

#### 参数类型与传参

```js
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const schema = buildSchema(`
type Account{
  name:String,
  age:Int,
  location:String,
}
type List{
  id:Int,
  name:String,
  price:Int
}
type Query{
  hello:String,
  getName:String,
  getAge:Int,
  getAllName:[String],
  getAllAges:[Int],
  getAccountInfo:Account,
  getList:[List],
  getDetail(id:Int!):[List]
}
`)
const obj = [
  {
    id: 1,
    name: 'Leo',
    price: 100
  },
  {
    id: 2,
    name: 'Leo',
    price: 200
  },
  {
    id: 3,
    name: 'Leo',
    price: 300
  }
]
const root = {
  hello: () => {
    let str = 'hello'
    return str
  },
  getName: () => {
    return 'Cliff'
  },
  getAge: () => {
    return 100
  },
  getAllName: () => {
    return ['Cliff', 'Leo']
  },
  getAllAges: () => {
    return [1, 2, 3, 4, 5, 6]
  },
  getAccountInfo: () => {
    return {
      name: 'Cliff',
      age: 30,
      location: 'California'
    }
  },
  getList: () => {
    return obj
  },
  getDetail: ({ id }) => {
    return obj.filter((item) => item.id === id)
  }
}
const app = express()
app.use('/home', function (req, res) {
  res.send('home,Data')
})
app.use('/list', function (req, res) {
  res.send('list,Data')
})
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.listen(3000)
```

![](D:\A-Space\ChuTing\Konwledge is infinite🤑\前端\images\graphql-params.jpg)

#### 修改数据mutation

```js
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const schema = buildSchema(`
type List{
  id:Int,
  name:String,
  price:Int
}
input ListData{
  name:String,
  price:Int
}
type Mutation{
  createData(data:ListData):[List]
}
`)
const obj = [
  {
    id: 1,
    name: 'Leo',
    price: 100
  },
  {
    id: 2,
    name: 'Leo',
    price: 200
  },
  {
    id: 3,
    name: 'Leo',
    price: 300
  }
]
const root = {
  createData: ({ data }) => {
    const cobj = { ...data, id: obj.length++ }
    obj.push(cobj)
    return obj
  }
}
const app = express()
app.use('/home', function (req, res) {
  res.send('home,Data')
})
app.use('/list', function (req, res) {
  res.send('list,Data')
})
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.listen(3000)
```

#### 结合数据库

```js
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const dataModel = mongoose.model(
  'data',
  new mongoose.Schema({
    name: String,
    poster: String,
    price: Number
  })
)
const schema = buildSchema(`
input ListData{
  id:String,
  name:String,
  price:Int,
  poster:String
}
type Mutation{
  createData(data:ListData):ListData
}
`)

const root = {
  createData: ({ data }) => {
    return dataModel
      .create({
        ...data
      })
      .then((res) => {
        console.log(res)
      })
  },
  getData() {
    return dataModel.find()
  },
  updateData({ id, input }) {
    return dataModel.updateOne(
      {
        _id: id
      },
      {
        ...input
      }
    )
  },
  deleteData({ id }) {
    return dataModel.deleteOne({ _id: id }).then((res) => 1)
  }
}
const app = express()
app.use('/home', function (req, res) {
  res.send('home,Data')
})
app.use('/list', function (req, res) {
  res.send('list,Data')
})
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.listen(3000)
```

#### 客户端访问

```js
//后端
const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const dataModel = mongoose.model(
  'data',
  new mongoose.Schema({
    name: String,
    poster: String,
    price: Number
  })
)
const schema = buildSchema(`
type Account{
  name:String,
  age:Int,
  location:String,
}
type List{
  id:String,
  name:String,
  price:Int,
  poster:String
}
input ListData{
  id:String,
  name:String,
  price:Int,
  poster:String
}
type Query{
  getData:[List]
}
type Mutation{
  createData(data:ListData):List,
  updateData( id:String!, input:ListData ):List,
  deleteData(id:String!):String
}
`)
const root = {
  createData: ({ data }) => {
    return dataModel.create({
      ...data
    })
  },
  getData() {
    return dataModel.find()
  },
  async updateData({ id, input }) {
    const res = await dataModel.updateOne(
      {
        _id: id
      },
      {
        ...input
      }
    )
    const res_1 = await dataModel.find({ _id: id })
    return res_1[0]
  },
  deleteData({ id }) {
    return dataModel.deleteOne({ _id: id }).then((res) => 1)
  }
}
const app = express()
app.use('/home', function (req, res) {
  res.send('home,Data')
})
app.use('/list', function (req, res) {
  res.send('list,Data')
})
app.use(
  '/graphql',
  graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
)
app.use(express.static('public'))
app.listen(3000)
```

```html
//前端
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>HTML</h1>
    <button onclick="getData()">查询数据</button>
    <button onclick="createData()">创建数据</button>
    <button onclick="updateData()">更新数据</button>
    <button onclick="deleteData()">删除数据</button>
  </body>
  <script>
    const getData = () => {
      const query = `
        query{
          getData{
            id,
            name,
            price,
            poster
          }
        }
      `
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query
        })
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data.getData)
        })
    }
    const createData = () => {
      const query = `
        mutation($data:ListData){
          createData(data:$data){
            id,
            name,
            price,
            poster
          }
        }
      `
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            data: {
              name: 'Cliff',
              price: 800,
              poster: 'cinema'
            }
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
        })
    }
    const updateData = () => {
      const query = `
        mutation($id:String!, $input:ListData){
          updateData(id:$id, input:$input){
            id,
            name,
            price,
            poster
          }
        }
      `
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            id: '62d639e3b4e3a74ffca74bab',
            input: {
              name: 'Leo',
              price: 900,
              poster: 'stuntman',
              id: '62d639e3b4e3a74ffca74bab'
            }
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
        })
    }
    const deleteData = () => {
      const query = `
        mutation($id:String!){
          deleteData(id:$id)
        }
      `
      fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            id: '62d650e168289d592c357ad7'
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res)
        })
    }
  </script>
</html>
```

#### &React

```json
"dependencies": {
"apollo-boost": "^0.4.9",
"graphql": "^16.5.0",
"graphql-tag": "^2.12.6",
"http-proxy-middleware": "^2.0.6",
"react-apollo": "^3.1.5",
  },
```

```tsx
//Query组件
import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
interface dataItem {
  id: string,
  name: string,
  price: number,
  poster: string
}
export default class QueryCom extends Component {
  query = gql(`
  query{
    getData{
      id,
      name,
      price,
      poster
    }
  }
  `)
  render() {
    return (
      <Query query={this.query} variables={{}}>
        {
          ({ loading, data }) => {
            return loading ? <div>loading....</div> : <div>
              {
                data.getData.map((item: dataItem) => <li key={item.id}>{item.name}</li>)
              }
            </div>
          }
        }
      </Query>
    )
  }
}
```

```tsx
//生产者
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import QueryCom from './components/Query'
const client = new ApolloClient({
  uri: '/graphql',
})
export default class query extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <QueryCom></QueryCom>
        </div>
      </ApolloProvider>

    )
  }
}
```

### Dva

> 一个基于redux和redux-saga的数据流方案，内置了react-router和fetch，一个轻量级的集成应用框架

#### 全局数据共享

```js
//cinema仓库
import { geCinemaList } from '../services/example'
export default {
  namespace: 'cinema',
  state: {
    isShow: true,
    list: []
  },
  reducers: {
    hide(preState, action) {
      return { ...preState, isShow: false }
    },
    show(preState, action) {
      return { ...preState, isShow: true }
    },
    changeList(preState, { payload }) {
      return { ...preState, list: payload }
    }
  },
  //初始化
  subscriptions: {
    setup({ dispatch, history }) {
      console.log('first')
    }
  },
  effects: {
    *getList(action, { call, put }) {
      const res = yield call(geCinemaList)
      yield put({
        type: 'changeList',
        payload: res.data.data.cinemas
      })
    }
  }
}
```

```js
//页面
import React, { Component } from 'react'
import { connect } from 'dva'
class Film extends Component {
  state = {
    list: []
  }
  componentDidMount() {
    if (this.props.list.length === 0) {
      this.props.dispatch({
        type: 'cinema/getList'
      })
    } else {
      console.log(this.props.list)
    }
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.list.map((item) => (
            <li key={item.cinemaId}>{item.name}</li>
          ))}
        </ul>
      </div>
    )
  }
}
export default connect((state) => {
  return { list: state.cinema.list }
})(Film)
```

#### 路由

```js
import React from 'react'
import { Router, Route, Switch, Redirect } from 'dva/router'
import App from './routes/App'
import Film from './routes/Film'
import Cinema from './routes/Cinema'
import Center from './routes/Center'
import Detail from './routes/Detail'
import Login from './routes/Login'
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route
          path="/"
          render={() => (
            <App>
              <Switch>
                <Route path="/film" component={Film}></Route>
                <Route path="/cinema" component={Cinema}></Route>
                <Route
                  path="/center"
                  render={() =>
                    localStorage.getItem('token') ? (
                      <Center></Center>
                    ) : (
                      <Redirect to="/login"></Redirect>
                    )
                  }
                ></Route>
                <Route path="/detail/:id" component={Detail}></Route>
                <Redirect to="/film" from="/"></Redirect>
              </Switch>
            </App>
          )}
        ></Route>
      </Switch>
    </Router>
  )
}

export default RouterConfig
```

#### Mock

```js
//Mock/api.js
export default {
  'GET /users': { name: '12312313' }
}
```

```js
//.roadhogrc.mock.js
const obj = require('./mock/api')
export default {
  ...obj
}
```

### Umi

> 开箱即用的集成应用框架

#### 路由

普通路由，在pages目录下新建文件即可自动生成对应的路由规则

嵌套路由，则多新建一个文件夹，主页面命名为_layout

layouts/index.tsx:约定式路由时的全局布局文件。

Center.wrappers = ["@/wrappers/Auth"] 为组件指定wrappers，实现路由守卫

#### Mock&反向代理

```typescript
//mock/mock.js
export default {
  'GET /mock': { name: 'mock', ability: 'mock' },
  'POST /user/login': (req: any, res: any) => {
    res.send({
      status: 200
    })
  }
}
```

```typescript
//.umirc.ts
import { defineConfig } from 'umi'
export default defineConfig({
  nodeModulesTransform: {
    type: 'none'
  },
  fastRefresh: {},
  proxy: {
    '/api': {
      target: 'https://i.maoyan.com',
      changeOrigin: true
    }
  }
})
```

#### 组件库集成

#### dva集成
