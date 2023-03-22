---
title: "Vue"
description: "record for vue"
---

## 路由

### 路由传参

==对象写法==

PS：传递params参数时指定路由只能使用name属性

```javascript
this.$router.push({name:"search",params:{keyword:this.keyword}},query:{key:this.id})
```

==指定params参数为可选值==

不处理结果：路由跳转时，path路径消失

做法：在占位符后加  ？

```javascript
const router = new VueRouter({
  routes:[
      {
        path:'/home/:params?',
        component:HomeView,
        name:'home'
      }
    ]
})
```

==指定params参数为可选值，但是传递params参数为空字符串==

不处理结果：同上

做法：指定params为空字符串或undefined

```javascript
params:{keyword:'' || undefined}
```

==传递props参数==

好处：作为路由组件上的一个属性

做法

1. 定义路由规则时指定props:true

   相关路由组件通过声明props属性接受参数

2. 对象写法{a:1,b:2}

3. 函数写法

   ```javascript
   props:($route)=>{
     return {keyword:$route.params.keyword}
   }
   ```

### 路由跳转

==编程式导航跳转时，多次执行（参数不变），控制台警告==

原因：调用push方法的返回值是一个Promise

做法

1. 为push方法，指定成功和失败的回调函数，用于捕获错误（耦合高）

2. 重写VueRouter原型对象的push方法

   ```javascript
   const originPush = VueRouter.prototype.push
   VueRouter.prototype.push = function(location,resolve,reject){
   if(resolve && reject){
    originPush.call(this,location,resolve,reject)
   }else{
    originPush.call(this,location,()=>{},()=>{})
   }
   }
   ```

### 命名视图

命名视图可以在同一级（同一个组件）中展示更多的路由视图，而不是嵌套显示。

```js
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        components: {
            default: () => import('../components/layout/menu.vue'),
            header: () => import('../components/layout/header.vue'),
            content: () => import('../components/layout/content.vue'),
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
```

```html
    <div>
        <router-view></router-view>
        <router-view name="header"></router-view>
        <router-view name="content"></router-view>
    </div>
```

### 重定向&别名

函数类型的重定向

```typescript
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/root.vue'),
        redirect: (to) => {
            return {
                path: '/user1',
                query: to.query
            }
        },
        children: [
            {
                path: '/user1',
                components: {
                    default: () => import('../components/A.vue')
                }
            },
            {
                path: '/user2',
                components: {
                    bbb: () => import('../components/B.vue'),
                    ccc: () => import('../components/C.vue')
                }
            }
        ]
    }
]
```

路径别名

```js
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/root.vue'),
        alias:["/root","/root2","/root3"],
        children: [
            {
                path: 'user1',
                components: {
                    default: () => import('../components/A.vue')
                }
            },
            {
                path: 'user2',
                components: {
                    bbb: () => import('../components/B.vue'),
                    ccc: () => import('../components/C.vue')
                }
            }
        ]
    }
]
```

### 导航守卫

#### 全局前置守卫（router.beforeEach）

```
to: Route， 即将要进入的目标 路由对象；
from: Route，当前导航正要离开的路由；
next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
```

#### 全局解析守卫（router.beforeResolve）

**确保在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用。**

```js
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

#### 全局后置守卫（router.afterEach）

```vue
<template>
    <div class="wraps">
        <div ref="bar" class="bar"></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
let speed = ref<number>(1)
let bar = ref<HTMLElement>()
let timer = ref<number>(0)
const startLoading = () => {
    let dom = bar.value as HTMLElement;
    speed.value = 1
    timer.value = window.requestAnimationFrame(function fn() {
        if (speed.value < 90) {
            speed.value += 1;
            dom.style.width = speed.value + '%'
            timer.value = window.requestAnimationFrame(fn)
        } else {
            speed.value = 1;
            window.cancelAnimationFrame(timer.value)
        }
    })

}

const endLoading = () => {
    let dom = bar.value as HTMLElement;
    setTimeout(() => {
        window.requestAnimationFrame(() => {
            speed.value = 100;
            dom.style.width = speed.value + '%'
        })
    }, 500)

}


defineExpose({
    startLoading,
    endLoading
})
</script>

<style scoped lang="less">
.wraps {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2px;
    .bar {
        height: inherit;
        width: 0;
        background: blue;
    }
}
</style>
```

```js
import loadingBar from './components/loadingBar.vue'
const Vnode = createVNode(loadingBar)
render(Vnode, document.body)
console.log(Vnode);

router.beforeEach((to, from, next) => {
    Vnode.component?.exposed?.startLoading()
})

router.afterEach((to, from) => {
    Vnode.component?.exposed?.endLoading()
})
```

#### 路由独享的守卫

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

#### 组件内的守卫

```js
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
```

### 路由过渡动效

```vue
    <router-view #default="{route,Component}">
        <transition  :enter-active-class="`animate__animated ${route.meta.transition}`">
            <component :is="Component"></component>
        </transition>
    </router-view>
```

```typescript
declare module 'vue-router'{
     interface RouteMeta {
        title:string,
        transition:string,
     }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Login.vue'),
      meta:{
         title:"登录页面",
         transition:"animate__fadeInUp",
      }
    },
    {
      path: '/index',
      component: () => import('@/views/Index.vue'),
      meta:{
         title:"首页！！！",
         transition:"animate__bounceIn",
      }
    }
  ]
})
```

### 动态路由

##### 添加路由

 动态路由主要通过两个函数实现。router.addRoute() 和 router.removeRoute()。它们只注册一个新的路由，也就是说，如果新增加的路由与当前位置相匹配，就需要你用 router.push() 或 router.replace() 来手动导航，才能显示该新路由

```js
router.addRoute({ path: '/about', component: About })
```

##### 删除路由

```js
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```

##### 查看现有路由

```js
router.hasRoute()：检查路由是否存在。
router.getRoutes()：获取一个包含所有路由记录的数组。
```

## 组件通信

### props

说明：父组件向子组件传递

数据类型：函数（本质是子组件给父组件传递数据）、非函数（本质是父组件给子组件传递数据）

形式：①数组

```js
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
```

 ②对象，可以实现类型检查，自定义验证函数

```js
props: {
    // 基础的类型检查 (`null` 和 `undefined` 值会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组的默认值必须从一个工厂函数返回
      default() {
        return { message: 'hello' }
      }
    },
    ⭐// 自定义验证函数
    propF: {
      validator(value) {
        // 这个值必须与下列字符串中的其中一个相匹配
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // 具有默认值的函数
    propG: {
      type: Function,
      // 与对象或数组的默认值不同，这不是一个工厂函数——这是一个用作默认值的函数
      default() {
        return 'Default function'
      }
    }
  }
    ⭐//自定义构造函数类型检查
    function Person(firstName, lastName) {
      this.firstName = firstName
      this.lastName = lastName
    }
    props: {
    author: Person
  }
```

### emit

说明：子组件向父组件传递

### eventBus全局事件总线

说明：Vue.prototype.$bus = this

### provide&inject

说明：父节点通过provide()方法向外共享数据，子孙节点使用inject()接受数据

```js
 provide('location', 'North Pole')
 provide('geolocation', {
  longitude: 90,
  latitude: 135
})

const userLocation = inject('location', 'The Universe')
const userGeolocation = inject('geolocation')
```

### 全局数据共享

状态管理工具：vuex、pinia

### 插槽

说明：父组件向子组件传递

```vue
//动态插槽
//插槽可以是一个变量名
        <Dialog>
            <template #[name]>
                <div>
                    23
                </div>
            </template>
        </Dialog>
<script setup>
    const name = ref('header')
</script>
```

### ref引用

说明：父子组件直接可以用过this.$ref访问到对方，即可以传递数据

### v-model

说明：父子组件数据同步，本质是自定义属性+自定义事件

##### vue2

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件

但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突：

```vue
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
<base-checkbox v-model="lovingVue"></base-checkbox>
```

##### vue3

```vue
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
<custom-input v-model="searchText"></custom-input>
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

支持自定义修饰符

```vue
<my-component v-model.capitalize="myText" v-model:title.aaa="title"></my-component>
```

```vue
app.component('my-component', {
  props: {
    //不加修饰符不带参
    modelValue: String,
    //加修饰符不带参
    modelModifiers: {
      default: () => ({})
    },
    //加修饰符带参
    titleModifiers?: {
        default: () => {}
    }
    //带参不加修饰符
    modeTitle:
  },
  emits: ['update:modelValue'],
  template: `
    <input type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  },
})
```

### .sync属性修饰符（vue2）

说明：父子组件数据同步，为当前组件绑定自定义事件update:prop

## 组合式API

### setup()        =>        setup

说明：所有的组合式api都在此使用，只在初始化时执行一次

执行时机：在beforeCreate之前执行一次

返回值：一般返回一个对象，为模板提供数据

### **Ref**系列

#### ref

说明：创建一个包含响应式数据的引用对象，在setup中通过value来访问其值，一般用来定义一个基本数据类型

```vue
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>
<script setup lang="ts">
import {ref,Ref} from 'vue'
let message:Ref<string> = ref("我是message")

const changeMsg = () => {
   message.value = "change msg"
}
</script>
//--------------------------------ts两种方式
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
let message = ref<string | number>("我是message")

const changeMsg = () => {
  message.value = "change msg"
}
</script>
```

#### isRef

说明：判断数据是否是一个ref对象

```typescript
import { ref, Ref,isRef } from 'vue'
let message: Ref<string | number> = ref("我是message")
let notRef:number = 123
const changeMsg = () => {
  message.value = "change msg"
  console.log(isRef(message)); //true
  console.log(isRef(notRef)); //false 
}
```

#### unref

如果参数是 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

```typescript
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x)
  // unwrapped 现在保证为 number 类型
}
```

#### shallowRef

说明：只能保证整体（跟踪自身 `.value` 变化的 ref）是响应式的数据，局部不具有响应式

```vue
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>
<script setup lang="ts">
import { Ref, shallowRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "小满"
})
    //不具有响应式
const changeMsg = () => {
  message.value.name = '大满'
} 
const changeMsg = () => {
  message.value = { name: "大满" }
}
</script>


<style>
</style>
```

#### triggerRef

说明：强制使shadowRef的局部操作变为响应式

```vue
<template>
  <div>
    <button @click="changeMsg">change</button>
    <div>{{ message }}</div>
  </div>
</template>
<script setup lang="ts">
import { Ref, shallowRef,triggerRef } from 'vue'
type Obj = {
  name: string
}
let message: Ref<Obj> = shallowRef({
  name: "小满"
})

const changeMsg = () => {
  message.value.name = '大满'
 triggerRef(message)
}
</script>
```

#### customRef

说明：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

```vue
<script setup lang="ts">
import { Ref, shallowRef, triggerRef, customRef } from 'vue'

function Myref<T>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newVal: T) {
        console.log('set');
        value = newVal
        trigger()
      }
    }
  })
}
let message = Myref('小满')
const changeMsg = () => {
  message.value = '大满'
  // triggerRef(message)
}
</script> 
```

### **To**系列

#### toRef

说明：将响应式对象中的某一属性转成响应式的，不同于ref的浅拷贝，不改变原始对象的响应式

```vue
<template>
   <div>
      <button @click="change">按钮</button>
      {{state}}
   </div>
</template>

<script setup lang="ts">
import { reactive, toRef } from 'vue'

const obj = {
   foo: 1,
   bar: 1
}
const state = toRef(obj, 'bar')
// bar 转化为响应式对象

const change = () => {
   state.value++
   console.log(obj, state);

}
</script>
```

#### toRaw

说明：将响应式的数据转成静态的数据，原响应式对象转为普通对象

```js
import { reactive, toRaw } from 'vue'

const obj = reactive({
   foo: 1,
   bar: 1
})
const state = toRaw(obj)
// 响应式对象转化为普通对象

const change = () => {
   console.log(obj, state);
}
```

#### toRefs

说明：将响应式对象中的所有属性转成响应式的

```js
import { reactive, toRefs } from 'vue'
const obj = reactive({
   foo: 1,
   bar: 1
})

let { foo, bar } = toRefs(obj)

foo.value++
console.log(foo, bar);
```

### **Reactive**系列

#### reactive

说明：定义多个数据的响应式，内部基于Proxy，通过代理对象操作源对象内部数据都是响应式的

#### shallowReactive

说明：将对象第一层转成响应式数据

```vue
<template>
  <div>
    <div>{{ state }}</div>
    <button @click="change1">test1</button>
    <button @click="change2">test2</button>
  </div>
</template>
<script setup lang="ts">
import { shallowReactive } from 'vue'
const obj = {
  a: 1,
  first: {
    b: 2,
    second: {
      c: 3
    }
  }
}

const state = shallowReactive(obj)

function change1() {
  state.a = 7
}
function change2() {
  state.first.b = 8
  state.first.second.c = 9
  console.log(state);
}
</script> 
```

### markRaw

说明：标记一个对象，使其永远不会转换为 proxy。返回对象本身。

### **计算属性**computed()

说明：①如果只传入一个回调函数，表示的是get，返回一个ref对象

```typescript
import { computed, reactive, ref } from 'vue'
let price = ref(0)//$0
let m = computed<string>(()=>{
   return `$` + price.value
})
price.value = 500
```

 ②传入一个对象，配置geth和et方法，实现读写操作

```vue
<template>
   <div>{{ mul }}</div>
   <div @click="mul = 100">click</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
let price = ref<number | string>(1)//$0
let mul = computed({
   get: () => {
      return price.value
   },
   set: (value) => {
      price.value = 'set' + value
   }
})
</script>
```

### 监听器watch

#### watch()

说明：参数：target，callback(new,old)，option

懒执行副作用；
更具体地说明什么状态应该触发侦听器重新运行；
访问侦听状态变化前后的值。

```js
import { ref, watch } from 'vue'
let message = ref({
    nav:{
        bar:{
            name:""
        }
    }
})
//监听单个响应式对象
watch(message, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
},{
    immediate:true,
    deep:true
})


import { ref, watch ,reactive} from 'vue'
let message = ref('')
let message2 = ref('')
//监听多个响应式数据
watch([message,message2], (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})


import { ref, watch ,reactive} from 'vue'
let message = reactive({
    nav:{
        bar:{
            name:""
        }
    }
})
//监听reactive对象
watch(message, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})


import { ref, watch ,reactive} from 'vue'
let message = reactive({
    name:"",
    name2:""
})
//监听reactive对象的某个属性
watch(()=>message.name, (newVal, oldVal) => {
    console.log('新的值----', newVal);
    console.log('旧的值----', oldVal);
})
```

#### watchEffect()

说明：①参数：callback()，立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数；option：配置监听的执行时机，flush: 'post'，这也将推迟副作用的初始运行，直到组件的首次渲染完成。

②显示的调用返回值表示停止监听

③本身默认会执行一次

④侦听副作用传入的函数可以接收一个 onInvalidate 函数作入参，用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发：

​    1、副作用即将重新执行时
​    2、侦听器被停止 (如果在 setup() 或生命周期钩子函数中使用了 watchEffect，则在组件卸载时)

```js
//就是在触发监听之前会调用一个函数可以处理你的逻辑例如防抖
import { watchEffect, ref } from 'vue'
let message = ref<string>('')
let message2 = ref<string>('')
 watchEffect((oninvalidate) => {
    //console.log('message', message.value);
    oninvalidate(()=>{

    })
    console.log('message2', message2.value);
})
```

```js
//副作用刷新时机 flush 一般使用post
//            pre            sync                post
//更新时机    组件更新前执行    强制效果始终同步触发    组件更新后执行
//onTrigger  可以帮助我们调试 watchEffect
const stop =  watchEffect((oninvalidate) => {
    //console.log('message', message.value);
    oninvalidate(()=>{

    })
    console.log('message2', message2.value);
},{
    flush:"post",
    onTrigger () {
    }
})
stop()
```

### defineProps

说明：子组件接受父组件的传值

```vue
<template>
    <div>
        <h2> 你好-</h2>
        <p>信息:{{ info}}</p>
        <p>{{ time }}</p>
    </div>
</template>
<script lang="ts" setup>
import {defineProps} from 'vue'
defineProps({
    info:{
        type:String,
        default:'----'
    },
    time:{
        type:String,
        default:'0分钟'
    },
})
</script>
```

### withDefaults（lang=ts）

说明：为props指定默认值，参数：defineProps，option（简单数据类型直接指定，复杂数据指定函数）

```typescript
interface Props {
  msg?: string
  labels?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

### defineEmits

说明：子组件向父组件传递数据

```vue
<template>
    <div>
        <h2> 你好-</h2>
        <button @click="hander1Click">新增</button>
        <button @click="hander2Click">删除</button>
    </div>
</template>

<script lang="ts" setup>
 import {defineEmits} from 'vue'
//  使用defineEmits创建名称，接受一个数组
let $myemit=defineEmits(['myAdd','myDel'])
let hander1Click=():void=>{
    $myemit('myAdd','新增的数据')
}

let hander2Click=():void=>{
    $myemit('myDel','删除的数据')
}
</script>
```

### defineExpose

说明：子组件向外暴露，父组件可以获取子组件的属性  子组件添加ref

```vue
<template>
    <div>
        <h2> 你好-</h2>
        <p>性别:{{ sex}}</p>
        <p>其他信息:{{ info}}</p>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref,defineExpose } from "vue";
let sex=ref('男')
let info=reactive({
    like:'喜欢',
    age:27
})
// 将组件中的属性暴露出去，这样父组件可以获取
defineExpose({
    sex,
    info
})
</script>
```

```vue
<template>
  <div class="home">
    <test-com @myAdd="myAddHander" @myDel='myDelHander' ref="testcomRef"></test-com>
    <button @click="getSonHander">获取子组件中的数据</button>
  </div>
</template>
<script lang="ts" setup>
import TestCom from "../components/TestCom.vue"
import {ref} from 'vue'
const testcomRef = ref()
const getSonHander=()=>{
  console.log('获取子组件中的性别', testcomRef.value.sex );
  console.log('获取子组件中的其他信息', testcomRef.value.info );
}
</script>
```

### defineAsyncComponent

说明：支持通过import语法，异步的引入组件,在大型应用中，我们可能需要将应用分割成小一些的代码块 并且减少主包的体积

```typescript
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

```typescript
<script setup lang="ts">
import { reactive, ref, markRaw, toRaw, defineAsyncComponent } from 'vue'
const Dialog = defineAsyncComponent(() => import('../../components/Dialog/index.vue'))
```

### readonly

说明：深度只读

### shallowReadonly

说明：浅只读

## 内置组件

### Teleport瞬移标签

说明：让组件的html在父组件界面外的特定标签下插入显示，指定to属性,将我们的模板渲染至指定`DOM`节点，不受父级`style`、`v-show`等属性影响，但`data`、`prop`数据依旧能够共用

### Fragment虚拟标签

说明：组件没有根标签，内部会将多个标签包含在一个Fragment虚拟元素中，减少标签层级，减少内存占用

### Suspense不确定标签

说明：能够在程序等待异步组件时渲染一些后备内容

```html
<Suspense>
  <template>
    //异步组件
  </template>
  <template v-slot:fallback>
    <h2>
      loading的内容
    </h2>
  </template>
</Suspense>
```

### transition动画标签

前提：

​    ①条件渲染 (使用 v-if)

​    ②条件展示 (使用 v-show)

​    ③动态组件

​    ④组件根节点

#### 内置过渡类名（适合自定义动画，指定name属性）

v-enter-from：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

v-enter-active：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

v-enter-to：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter-from 被移除)，在过渡/动画完成之后移除。

v-leave-from：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

v-leave-active：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

v-leave-to：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave-from 被移除)，在过渡/动画完成之后移除。

#### 自定义过渡类名（适合配合动画库）、自定义过度时间 单位毫秒（duration）

​    ①`enter-from-class`

​    ②`enter-active-class`

​    ③`enter-to-class`

​    ④`leave-from-class`

​    ⑤`leave-active-class`

​    ⑥`leave-to-class`

```vue
<transition
    leave-active-class="animate__animated animate__bounceInLeft"
    enter-active-class="animate__animated animate__bounceInRight"
>
    <div v-if="flag" class="box"></div>
</transition>

<transition :duration="1000">...</transition>
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

#### 生命周期（适合js的动画效果）

PS：当只用 JavaScript 过渡的时候，在 **`enter` 和 `leave` 钩子中必须使用 `done` 进行回调**

  @before-enter="beforeEnter" //对应enter-from
  @enter="enter"//对应enter-active
  @after-enter="afterEnter"//对应enter-to
  @enter-cancelled="enterCancelled"//显示过度打断
  @before-leave="beforeLeave"//对应leave-from
  @leave="leave"//对应enter-active
  @after-leave="afterLeave"//对应leave-to
  @leave-cancelled="leaveCancelled"//离开过度打断

```js
const beforeEnter = (el: Element) => {
    console.log('进入之前from', el);
}
const Enter = (el: Element,done:Function) => {
    console.log('过度曲线');
    setTimeout(()=>{
       done()
    },3000)
}
const AfterEnter = (el: Element) => {
    console.log('to');
}
```

#### appear

通过这个属性可以设置初始节点过度 就是页面加载完成就开始动画 对应三个状态

​    appear-active-class=""
​    appear-from-class=""
​    appear-to-class=""

#### **过渡模式**mode

- `in-out`: 新元素先进行进入过渡，完成之后当前元素过渡离开。
- `out-in`: 当前元素先进行离开过渡，完成之后新元素过渡进入。

#### transition-group过渡列表

​    ①默认情况下，它不会渲染一个包裹元素，但是你可以通过 `tag` attribute 指定渲染一个元素。

​    ②过度模式mode不可用，因为我们不再相互切换特有的元素。

​    ③内部元素**总是需要**提供唯一的 `key` attribute 值。

​    ④CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。

##### 列表的进入/离开过渡

当添加和移除元素的时候，周围的元素会瞬间移动到它们的新布局的位置，而不是平滑的过渡

```html
<div id="list-demo">
  <button @click="add">Add</button>
  <button @click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random() * this.items.length)
    },
    add() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove() {
      this.items.splice(this.randomIndex(), 1)
    }
  }
}
Vue.createApp(Demo).mount('#list-demo')
```

```css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
```

##### 列表的移动过渡

为定位的改变添加动画

新增的 **`v-move` 类**就可以使用这个新功能，它会应用在元素改变定位的过程中。像之前的类名一样，它的前缀可以通过 `name` attribute 来自定义，也可以通过 `move-class` attribute 手动设置。

```html
<div id="flip-list-demo">
  <button @click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

```js
const Demo = {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    shuffle() {
      this.items = _.shuffle(this.items)
    }
  }
}

Vue.createApp(Demo).mount('#flip-list-demo')
```

```scss
.flip-list-move {
  transition: transform 0.8s ease;
}
```

##### 状态过渡

- 数字和运算
- 颜色的显示
- SVG 节点的位置
- 元素的大小和其他的 property

这些数据要么本身就以数值形式存储，要么可以转换为数值。有了这些数值后，我们就可以结合 Vue 的响应性和组件系统，使用第三方库来实现切换元素的过渡状态。

```vue
<template>
    <div>
        <input step="20" v-model="num.current" type="number" />
        <div>{{ num.tweenedNumber.toFixed(0) }}</div>
    </div>
</template>

<script setup lang='ts'>
import { reactive, watch } from 'vue'
import gsap from 'gsap'
const num = reactive({
    tweenedNumber: 0,
    current:0
})

watch(()=>num.current, (newVal) => {
    gsap.to(num, {
        duration: 1,
        tweenedNumber: newVal
    })
})

</script>
```

## 自定义指令

说明：对普通 DOM 元素进行底层操作，这时候就会用到自定义指令

PS：必须以 `vNameOfDirective` 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。

### 钩子函数

​    ①created 元素初始化的时候
​    ②beforeMount 指令绑定到元素后调用 只调用一次
​    ③mounted 元素插入父级dom调用
​    ④beforeUpdate 元素被更新之前调用
​    ⑤update 这个周期方法被移除 改用updated
​    ⑥beforeUnmount 在元素被移除前调用
​    ⑦unmounted 指令被移除后调用 只调用一次

### 全局指令

```js
const app = Vue.createApp({})
// 注册一个全局自定义指令 `v-focus`
app.directive('focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  mounted(el) {
    // 聚焦元素
    el.focus()
  }
})
```

### 局部指令

1、形参el是绑定此指令的dom对象

2、通过binding参数接收指令中的参数

​    ①instance：使用指令的组件实例。
​    ②value：传递给指令的值。例如，在 v-my-directive="1 + 1" 中，该值为 2。
​    ③oldValue：先前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否有更改都可用。
​    ④arg：传递给指令的参数(如果有的话)。例如在 v-my-directive:foo 中，arg 为 "foo"。
​    ⑤modifiers：包含修饰符(如果有的话) 的对象。例如在 v-my-directive.foo.bar 中，修饰符对象为 {foo: true，bar: true}。
​    ⑥dir：一个对象，在注册指令时作为参数传递。

3、 当前元素的虚拟DOM 也就是Vnode

4、prevNode 上一个虚拟节点，仅在 `beforeUpdate` 和 `updated` 钩子中可用

```vue
<template>
  <button @click="show = !show">开关{{show}} ----- {{title}}</button>
  <Dialog  v-move-directive="{background:'green',flag:show}"></Dialog>
</template>
 <script>
     const vMoveDirective: Directive = {
      created: () => {
        console.log("初始化====>");
      },
      beforeMount(...args: Array<any>) {
        // 在元素上做些操作
        console.log("初始化一次=======>");
      },
      mounted(el: any, dir: DirectiveBinding<Value>) {
        el.style.background = dir.value.background;
        console.log("初始化========>");
      },
      beforeUpdate() {
        console.log("更新之前");
      },
      updated() {
        console.log("更新结束");
      },
      beforeUnmount(...args: Array<any>) {
        console.log(args);
        console.log("======>卸载之前");
      },
      unmounted(...args: Array<any>) {
        console.log(args);
        console.log("======>卸载完成");
      },
    };
</script>
```

### 函数简写

在 `mounted` 和 `updated` 时触发相同行为，而不关心其他的钩子函数

```vue
<template>
   <div>
      <input v-model="value" type="text" />
      <A v-move="{ background: value }"></A>
   </div>
</template>

<script setup lang='ts'>
import A from './components/A.vue'
import { ref, Directive, DirectiveBinding } from 'vue'
let value = ref<string>('')
type Dir = {
   background: string
}
const vMove: Directive = (el, binding: DirectiveBinding<Dir>) => {
   el.style.background = binding.value.background
}
</script>
```

## 自定义hooks

主要用来处理复用代码逻辑的一些封装

这个在vue2 就已经有一个东西是Mixins

mixins就是将这些多个相同的逻辑抽离出来，各个组件只需要引入mixins，就能实现一次写代码，多组件受益的效果。

弊端就是 会涉及到覆盖的问题

组件的data、methods、filters会覆盖mixins里的同名data、methods、filters。

### 内置hooks

useAttrs

说明：获取父组件传的全部属性

## 全局函数和变量

由于Vue3 没有Prototype 属性 使用 app.config.globalProperties 代替 然后去定义变量和函数

```js
// 之前 (Vue 2.x)
Vue.prototype.$http = () => {}
```

```js
// 之后 (Vue 3.x)
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

组件中获取实例

```typescript
import { getCurrentInstance, ComponentInternalInstance } from 'vue';

const { appContext } = <ComponentInternalInstance>getCurrentInstance()

console.log(appContext.config.globalProperties.$env);
```

声明文件

```typescript
app.config.globalProperties.$filters = {
  format<T extends any>(str: T): string {
    return `$${str}`
  }
}
type Filter = {
    format: <T extends any>(str: T) => T
  }
// 声明要扩充@vue/runtime-core包的声明.
// 这里扩充"ComponentCustomProperties"接口, 因为他是vue3中实例的属性的类型.
  declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $filters: Filter
    }
  }
```

## CSS新特性

### 插槽选择器

```vue
<template>
    <div>
        我是插槽
        <slot></slot>
    </div>
</template>
```

```css
<style scoped>
 :slotted(.a) {
    color:red
}
</style>
```

```vue
<template>
    <div>
        <A>
            <div class="a">私人定制div</div>
        </A>
    </div>
</template>

<script setup>
import A from "@/components/A.vue"
</script>
```

### 全局选择器

替换了纯style标签

```css
<style lang="less" scoped>
:global(div){
    color:red
}
</style>
```

### 动态 CSS

```vue
<template>
    <div class="div">
       小满是个弟弟
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const red = ref<string>('red')
</script>

<style lang="less" scoped>
.div{
   color:v-bind(red)
}

</style>
```

```vue
 <template>
    <div class="div">
        小满是个弟弟
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const red = ref({
    color:'pink'
})
</script>

    <style lang="less" scoped>
.div {
    //如果是对象 v-bind 请加引号
    color: v-bind('red.color');
}
</style>
```

### css `module`

<style module> 标签会被编译为 CSS Modules 并且将生成的 CSS 类作为 $style 对象的键暴露给组件

```vue
<template>
    <div :class="$style.red">
        小满是个弟弟
    </div>
</template>

<style module>
.red {
    color: red;
    font-size: 20px;
}
</style>

```
自定义注入名称（多个可以用数组），你可以通过给 `module` attribute 一个值来自定义注入的类对象的 property 键

```vue
<template>
    <div :class="[zs.red,zs.border]">
        小满是个弟弟
    </div>
</template>

<style module="zs">
.red {
    color: red;
    font-size: 20px;
}
.border{
    border: 1px solid #ccc;
}
</style>
```

在setup中获取类名（useCssModule ）

```vue
<template>
    <div :class="[zs.red,zs.border]">
        小满是个弟弟
    </div>
</template>


<script setup lang="ts">
import { useCssModule } from 'vue'
const css = useCssModule('zs')
</script>

<style module="zs">
.red {
    color: red;
    font-size: 20px;
}
.border{
    border: 1px solid #ccc;
}
</style>
```

## Pinia

优点

​    ①完整的 ts 的支持；
​    ②足够轻量，压缩后的体积只有1kb左右;
​    ③去除 mutations，只有 state，getters，actions；
​    ④actions 支持同步和异步；
​    ⑤代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
​    ⑥无需手动添加 store，store 一旦创建便会自动添加；
​    ⑦支持Vue3 和 Vue2

### 初始化仓库

```js
import { defineStore } from 'pinia'
import { Names } from './store-namespce'
export const useTestStore = defineStore(Names.Test, {
     state:()=>{
         return {
             current:1
         }
     },
     //类似于computed 可以帮我们去修饰我们的值
     getters:{

     },
     //可以操作异步 和 同步提交state
     actions:{

     }
})
```

### state

#### 修改store

1、直接修改

```vue
<template>
     <div>
         <button @click="Add">+</button>
          <div>
             {{Test.current}}
          </div>
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
    Test.current++
}

</script>
```

2、通过$patch修改

```vue
<template>
     <div>
         <button @click="Add">+</button>
          <div>
             {{Test.current}}
          </div>
          <div>
            {{Test.age}}
          </div>
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
    Test.$patch({
       current:200,
       age:300
    })
    //接受一个回调，访问state单个修改
    Test.$patch((state)=>{
       state.current++;
       state.age = 40
    })
}

</script>
```

3、通过$state修改整体

```vue
<template>
     <div>
         <button @click="Add">+</button>
          <div>
             {{Test.current}}
          </div>
          <div>
            {{Test.age}}
          </div>
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
    Test.$state = {
       current:10,
       age:30
    }    
}

</script>
```

4、通过actions修改

```js
import { defineStore } from 'pinia'
import { Names } from './store-naspace'
export const useTestStore = defineStore(Names.TEST, {
     state:()=>{
         return {
            current:1,
            age:30
         }
     },

     actions:{
         setCurrent () {
             this.current++
         }
     }
})
```

```vue
<template>
     <div>
         <button @click="Add">+</button>
          <div>
             {{Test.current}}
          </div>
          <div>
            {{Test.age}}
          </div>
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
     Test.setCurrent()
}

</script>
```

#### 响应式结构store

```js
import { storeToRefs } from 'pinia'

const Test = useTestStore()

const { current, name } = storeToRefs(Test)
```

### actions

1、同步方法

```js
import { defineStore } from 'pinia'
import { Names } from './store-naspace'
export const useTestStore = defineStore(Names.TEST, {
    state: () => ({
        counter: 0,
    }),
    actions: {
        increment() {
            this.counter++
        },
        randomizeCounter() {
            this.counter = Math.round(100 * Math.random())
        },
    },
})
```

```vue
<template>
     <div>
         <button @click="Add">+</button>
          <div>
             {{Test.counter}}
          </div>    
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
     Test.randomizeCounter()
}

</script>
```

2、异步方法

```js
import { defineStore } from 'pinia'
import { Names } from './store-naspace'

type Result = {
    name: string
    isChu: boolean
}

const Login = (): Promise<Result> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: '小满',
                isChu: true
            })
        }, 3000)
    })
}

export const useTestStore = defineStore(Names.TEST, {
    state: () => ({
        user: <Result>{},
        name: "123"
    }),
    actions: {
        async getLoginInfo() {
            const result = await Login()
            this.user = result;
        }
    },
})
```

```vue
<template>
     <div>
         <button @click="Add">test</button>
          <div>
             {{Test.user}}
          </div>    
     </div>
</template>

<script setup lang='ts'>
import {useTestStore} from './store'
const Test = useTestStore()
const Add = () => {
     Test.getLoginInfo()
}
</script>
```

3、互相调用

```js
    state: () => ({
        user: <Result>{},
        name: "default"
    }),
    actions: {
        async getLoginInfo() {
            const result = await Login()
            this.user = result;
            this.setName(result.name)
        },
        setName (name:string) {
            this.name = name;
        }
    },
```

### getters

```js
getters:{
   newCurrent ():number {
       return ++this.current
   }
},
```

### API

#### $reset

重置`store`到他的初始状态

#### $subscribe

只要有state 的变化就会走这个函数，如果你的组件卸载之后还想继续调用请设置第二个参数

```js
Test.$subscribe((args,state)=>{
   console.log(args,state);

},{
  detached:true
})
```

#### $onAction

只要有actions被调用就会走这个函数

```js
Test.$onAction((args)=>{
   console.log(args);

})
```

## JSX&TSX

> JSX(JavaScript XML)是js内定义的一套XML语法，可以解析出目标js代码,颠覆传统js写法。实质上HTML也是xml协议，有由浏览器解析，而JSX是由js解析。

Vue 提供了一个 `h()` 函数用于创建 vnodes：

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

得到的 vnode 为如下形式：

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

`h()` 函数的使用方式非常的灵活：

```js
// 除了类型必填以外，其他的参数都是可选的
h('div')
h('div', { id: 'foo' })

// attribute 和 property 都能在 prop 中书写
// Vue 会自动将它们分配到正确的位置
h('div', { class: 'bar', innerHTML: 'hello' })

// props modifiers such as .prop and .attr can be added
// with '.' and `^' prefixes respectively
h('div', { '.name': 'some-name', '^width': '100' })

// 类与样式可以像在模板中一样
// 用数组或对象的形式书写
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件监听器应以 onXxx 的形式书写
h('div', { onClick: () => {} })

// children 可以是一个字符串
h('div', { id: 'foo' }, 'hello')

// 没有 props 时可以省略不写
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 数组可以同时包含 vnodes 与字符串
h('div', ['hello', h('span', 'hello')])
```

### render函数

#### 选项式API

```js
import { h } from 'vue'
export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
      //  const hText=`
           //            <h${this.id}>${this.$slots.default[0].text}</h${this.id}>
         //            `
       //return <div domPropsInnerHTML={hText}></div>
  }
}
```

#### 组合式API

```js
import { ref, h } from 'vue'
export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)
    // 返回渲染函数
    return () => h('div', props.msg + count.value)
  }
}
```

### JSX

[JSX](https://facebook.github.io/jsx/) 是 JavaScript 的一个类似 XML 的扩展，有了它，我们可以用以下的方式来书写代码：

```jsx
const vnode = <div>hello</div>
```

在 JSX 表达式中，使用大括号来嵌入动态值：

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

```jsx
import AnchoredHeading from './AnchoredHeading.vue'

const app = createApp({
  render() {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})

app.mount('#demo')
```

```jsx
// item.vue
<script>
   export default {
       name: "item",
       props:{
         id:{
           type:Number,
           default:1
         }
       },
     render(h,){
         const hText=`
                       <h${this.id}>${this.$slots.default[0].text}</h${this.id}>
                     `
       return <div domPropsInnerHTML={hText}></div>
     }
   }
</script>
```

### JSX中的函数式组件

> 函数式组件无状态，无this实例
>
> 因为函数式组件只是一个函数，所以渲染开销也低很多。然而，对持久化实例的缺乏也意味着函数式组件不会出现在Vue devtools 的组件树里。

<template functional>
</template>

```jsx
// 父组件
 methods:{
      show(){
        alert('你好')
      }
    },
    render(){
      return (
        <Item data={this.data} onNativClick={this.show} class="large"/>
      )
    }
//Item.vue组件
export default {
    functional:true,
      name: "item",
      render(h,context){
        return (
          <div class="red" {...context.data}>
            {context.props.data}
          </div>
        )
      }
    }
```

通过展开运算符把所有的属性添加到了根元素上，这个context.data就是你在父组件给子组件增加的属性，他会跟你在子元素根元素的属性智能合并，现在.large类名就传进来了。这个很有用，当你在父组件给子组件绑定事件时就需要这个了。

## 响应式比较

### vue2

对象：通过object.defineProperty对对象已有的属性值的读取和修改进行劫持

数组：通过重写数组的一系列更新元素的方法实现元素修改的劫持

问题：①对象直接添加的属性或删除已有的属性，界面不会自动更新

 ②直接通过下标替换元素或更新length，界面不会自动更新

### vue3

proxy：拦截data任意属性的任意操作，包括属性值的读写，添加，删除

reflect：动态对被代理对象的相应属性进行特定的操作
