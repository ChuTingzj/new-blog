---
title: "Typescript"
description: "record for typescript"
---

## 编译指令

tsc --init        生成ts的配置文件

tsc --watch        自动编译ts文件

tsc --noEmitOnError --watch        有错误时不进行编译

## tsconfig.json

### 降级编译

```json
"target":"es6"
```

### 严格模式

```json
"strict":true,
//or
"noImpliciAny":true,
"strictNullChecks":true
```

## 常用类型

### 数组

```typescript
//1
let arr:number[] = [1,2,3]
//2,泛型写法
let arr:Array<number> = [1,2,3]
```

### 联合类型

```typescript
function sum(num1:number,num2?:number){}
function info(person:{age:number,name:string|number})
```

### 自定义类型

```typescript
type ns = number | string
//自定义扩展
type nsa = ns & number[]
```

### 接口

```typescript
interface Ponit1{
  x:number,
  y:string
}
//接口扩展
interface Ponit2 extends Ponit1{
  z:number[]
}
//向现有类型添加字段
interface Ponit1{
  x:number
}
interface Ponit1{
  y:string
}
👇
interface Ponit1{
  x:number,
  y:string
}
```

### 字面量类型

```typescript
let testString:'Typescript'|'Javascript'
```

### 枚举类型

```typescript
enum Direction{
  Up = 1,
  Down,
  Left,
  Right
}
console.log(Direction.Up)
```

### never类型(穷尽性检查)

```typescript
type Shape = Circle | Square
function getShape(shape:Shape){
  switch(shape.kind){
    case 'circle':
      return Math.PI * shape.radius**2
    break;
    case 'square':
      return shape.sideLength**2
    break;
    default:
      const exhaustCheck:never = shape
      return exhaustCheck
  }
}
```

## 类型缩小

### typeof类型守卫

```typescript
function padLeft(padding:number|string,input:string){
  if(typeof padding === 'number')return new Array(padding+1)join("")+input
  return padding+input
}
```

### 真值缩小

```typescript
function getUserOnlineMesage(numUserOnline:number){
  if(numUserOnline)return `现在共有${numUserOnline}在线`
  return `现在没有人在线`
}
```

### in操作符

```typescript
type Fish = {swim:()=>void}
type Bird = {fly:()=>void}
function move(animal:Fish|Bird){
  if('swim' in animal)return animal.swim()
  return animal.fly()
}
```

### instanceof

```typescript
function logValue(x:Date|string){
  if(x instanceof Date)return x.toUTCString()
  return x.toUpperCase()
}
```

### 分配缩小

```typescript
let x = Math.random()<0.5?10:'hello,world'
```

### 类型谓词

```typescript
type Fish = {
  name:string,
  swim:()=>void
}
type Bird = {
  name:string,
  fly:()=>void
}
function isFish(pet:Fish|Bird):pet is Fish{
  return (pet as Fish).swim !== undefined
}
function getSmallPet():Fish|Bird{
  let fish:Fish = {
    name:'fish',
    swim:()=>{}
  }
  let bird:Bird = {
    name:'bird',
    fly:()=>{}
  }
  return true?bird:fish
}
let pet = getSmallPet()
if(isFish(pet)){
  pet.swim()
}else{
  pet.fly()
}
```

### 类型断言

当 `S` 类型是 `T` 类型的子集，或者 `T` 类型是 `S` 类型的子集时，`S` 能被成功断言成 `T`。这是为了在进行类型断言时提供额外的安全性，完全毫无根据的断言是危险的，如果你想这么做，你可以使用 `any`。

```typescript
interface Foo {
  bar: number;
  bas: string;
}

const foo = {} as Foo;
foo.bar = 123;
foo.bas = 'hello';
```

## 函数

### 函数表达式

```typescript
function sayHi(fn:(a:string)=>void){
  fn('Hello,world')
}
function print(s:string){
  console.log(s)
}
```

### 调用签名:为函数绑定属性

```typescript
type func = {
  description:string,
  (param:number):boolean
}
function doSomething(fn:func){
  fn.description+'and'+fn(6)
}
function fn1(num:number){
  console.log(num)
  return true
}
fn1.description = 'hello'
doSomething(fn1)
```

### 构造签名

```typescript
class Ctor{
  s:string
  constructor(s:string){
    this.s = s
  }
}
type someConstructor = {
  //构造函数
 new (s:string):Ctor
}
function fn(ctor:someConstructor){
  //实例化构造函数
  return  new  ctor('hello')
}
const f = fn(Ctor)
console.log(f.s)
```

```typescript
interface CallOrConstructor{
  new (s:string):Date
  (num?:number):number
}
function fn(date:CallOrConstructor){
  const d = new date('2022-10-25')
  const n = date(100)
}
```

## 泛型

```typescript
function first(arr:any[]){
  return arr[0]
}
//需求：返回值的类型是对应数组元素的类型
function second<Type>(arr:Type[]):Type | undefined{
  return arr[0]
}
```

```typescript
function map<Input,Output>(arr:Input[],func:(arg:Input)=>Output):Output[]{
  return arr.map(func)
}
map([1,2,3],(n)=>parseInt(n))
```

### 限制条件

```typescript
function long<Type extends {length:number}>(a:Type,b:Type){
  if(a.length>=b.length)return a
  return b
}
const arr = long([1,2].[1,2,3])
```

### 受限值

```typescript
function short<Type extends {length:number}>(obj:Type,standard:number):Type{
  if(obj.length>=standard)return obj
  return {length:standard}//类型错误
}
```

### 指定类型参数

```typescript
function combine<Type>(arr1:Type[],arr2:Type[]):Type[]{
  return arr1.concat(arr2)
}
const arr = combine<string|number>(['123'],[3,4,5])
```

## 泛型编写准则

### 使用类型参数本身，而不是对其约束

### 尽可能少的使用类型参数

### 如果一个类型参数只出现在一个地方，重新考虑是否需要

```typescript
✔
function fisrt<Type>(arr:Type[]){
  return arr[0]
}
❌
function second<Type extends any[]>(arr:Type){
  return arr[0]
}
const f = first([1,2,3])
const s = first([1,2,3])
```

```typescript
✔
function filter1<Type>(arr:Type[],fun:(arg:Type)=>boolean){
  return arr.filter(fun)
}
❌
function filter2<Type,Fun extends (arg:Type)=>boolean>(arr:Type[],fun:Fun){
  return arr.filter(fun)
}
```

```typescript
❌
function greet1<Str extends string>(s:Str){
  console.log('Hello'+s)
}
✔
function greet2(s:string){
  console.log('Hello'+s)
}
```

## 可选参数、默认参数

```typescript
//普通函数
function f(n:number=100){
  console.log(n)
}
function f(n?:number){
  console.log(n)
}

//回调函数
//不要写可选参数，除非只在不传入可选参数的情况下调用
function foreach(arr:any[],fn:(arg:any,index?:number)=>void){
  for(let i = 0;i < arr.length;i++){
    fn(arr[i],index)
  }
}
foreach([1,2,3],(a,index)=>{console.log(a,index)})
```

## 重载:同样的函数，不同样的参数个数，执行不同的代码

```typescript
function makeDate(timestamp:number):Date
function makeDate(m:number,d:number,y:number):Date
function makeDate(mortimestamp:number,d?:number,y?:number):Date{
  if(d!==undefined&&y!==undefined){
    return new Date(y,mortimestamp,d)
  }
  return new Date(mortimestamp)
}

function fn(s:string):void
function fn(){}
fn('hello')

function fn(x:boolean):void
function fn(x:string):void
function fn(x:boolean|string){}

function fn(x:string):string
function fn(x:boolean):boolean
function fn(x:boolean|string):string|boolean{}
```

## 重载编写准则

### 倾向于使用联合类型的参数而不是重载参数

```typescript
function len(s:string):number
function len(arr:any[]):number
function len(x:any):number{
  return x.length
}
len('hello')
len([1,2,3])
❌
len(Math.random()>0.5?'hello':[1,2,3])
✔
function len(x:any[]|string){
  return x.length
}
```

## this

```typescript
interface User{
  admin:boolean
}
interface DB{
  filterUsers(filter:(this:User)=>boolean):User[]
}
const db:DB = {
  filterUsers:(filter:(this:User)=>boolean)=>{
    let user1 = {
      admin:true
    }
    let user2 = {
      admin:false
    }
    return [user1,user2]
  }
}
const admins = db.filterUsers(function(this:User){
  return this.admin
})
```

## 对象

```typescript
function greet(person:{name:string,age:number}){
  return 'Hello'+person.name
}

interface Person{
  name:string,
  age:number
}
function greet(person:Person){
  return  'Hello'+person.name
}

type Person = {
  name:string,
  age:number
}
function greet(person:Person){
  return 'Hello'+person.name
}
```

### 属性修改器

### 可选属性

```typescript
type Shape = {}
interface PaintOptions{
  shape:Shape,
  xPos?:number,
  yPos?:number
}
function paintShape(opts:PainOptions){
  let xPos = opts.xPos === undefined?0:opts.xPos
  let yPos = opts.yPos
}
//解构
function paintShape({shape,xPos=0,yPos}:PainOptions){}
const shape:Shape = {}
paintShape({shape})
```

### 只读属性

```typescript
interface SomeType{
  readonly prop:string
}
function doSomething(obj:SomeType){}

interface Home{
  readonly neighbour:{
    name:string,
    age:number
  }
}
function sayHello(home:Home)

interface Person{
  name:string,
  age:number
}
interface PersonReadonly{
 readonly name:string,
 readonly  age:number
}
let normal:Person = {
  name:'mike',
  age:20
}
let special:PersonReadonly = normal
special.age++
console.log(special.age)//21
```

### 索引签名

```typescript
interface StringArray{
  [index:number]:string
}
const array:StringArray = ['a','b']
const first = array[0]

interface TestString{
  [props:string]:number
}
let teststring:TestString = {
  x:100,
}

interface Animal{
  name:string
}
interface Dog extends Animal{
  breed:string
}
interface Test{
  [index:string]:number|string
  length:number,
  name:string
}
const test:Test = {
  x:100,
  y:'aaa'
}

interface ReadOnly{
  readonly  [index:number]:string
}
let arr:ReadOnly = ['a','b']
```

## 扩展类型

```typescript
interface Name{
  name:string
}
interface Age{
  age:number
}
interface Human extends Name,Age{
  apperance:string
}
const human:Human = {
  name:'peter',
  age:20,
  apperance:'handsome'
}
```

## 交叉类型

```typescript
interface Colorful{
  color:string
}
interface Circle{
  radius:number
}
type ColorAndCircle = Colorful & Circle
const cc:ColorAndCircle = {
  color:'red',
  radius:100
}

function draw(circle:Colorful & Circle){
  console.log(circle.color)
}
draw({color:'red',radius:100})
```

## 接口和交叉对比

```typescript
//同名接口类型直接合并以解决冲突
interface Sister{
  name:string
}
interface Sister{
  name:number
}
const sister:Sister = {
  name:'sister',
  age:30
}
```

```typescript
//无法出现同名类型以解决冲突
type Sister = {
  name:string
}
type Sister = {

}
```

## 泛型对象类型

```typescript
//需求：泛化类型,由使用者决定类型
❌
interface Box{
  // contents:any
}

❌
interface Box{
  contents:unknown
}
let x:Box = {
  contents:'aaa'
}
console.log(x.contents.toLowerCase())//unknown类型无法进行任何操作
way1、✔
//类型缩小 typeof
way2、✔
//类型断言 as


1、✔
//函数重载
interface NumberBox{
  contents:number
}
interface StringBox{
  contens:string
}
interface BooleanBox{
  contents:boolean
}
function setContents(box:StringBox,newContents:string):void
function setContents(box:NumbergBox,newContents:number):void
function setContents(box:BooleanBox,newContents:boolean):void
function setContents(box:{contents:any},newContents:any){
  box.contents = newContents
}



2、✔
//泛型对象
interface Box<Type>{
  contents:Type
}
let box:Box<string> = {
  contents:'hello'
}
let box:Box<number> = {
  contents:100
}

interface Box<Type>{
  contents:Type
}
interface Apple{}
type AppleBox = Box<Apple>
let ab:AppleBox = {contents:{}}

type Box<Type> = {
  contents:Type
}
type Null<Type> = Type | null
type arr<Type> = Type | Type[]
type mix<Type> = Null<arr<Type>>
```

## 类型操纵

### 在类型中创建类型

### 泛型

```typescript
function identity<Type>(arg:Type):Type{
  return arg
}
let output = identity<string>("myString")
let output = identity("myString")

//指定更加精确的类型
function identity<Type>(arg:Array<Type>):Type[]{
  console.log(arg.length)
  return arg
}

//泛型类型
interface GenericIdentityFn{
  <Type>(arg:Type):Type
}
interface GenericIdentityFn<Type>{
  (arg:Type):Type
}

//泛型类
class GenericNumber<NumType>{
  zeroValue:NumType
  add:(x:NumType)=>NumType
}
let mynum = new GenericNum<number>()

//泛型约束
interface LengthWise{
  length:number
}
function identity<Type extends LengthWise>(arg:Type):Type{
  arg.length
}

//泛型约束中使用类型参数
function getProperty<Type,Key extends keyof Type>(obj:Type,key:Key){
  return obj.key
}
let x = {
  a:1,
  b:2,
  c:3,
  d:4
}
✔
getProperty(x,'a')
❌
getProperty(x,'m')

//泛型中使用类
function create<Type>(c:{new():Type}):Type{
  return new c()
}

class Bee{
  hasMask:boolean=true
}
class Zoo{
  name:string='mike'
}
class Animal{
  legs:number=4
}
class Bird extends Animal{
  keeper:Bee = new Bee()
}
class Lion extends Animal{
  keeper:Zoo = new Zoo()
}
function createInstance<A extends Animal>(c:new()=>A):A{
  return new c()
}

//keyof类型操作符
type Point = {
  x:number,
  y:number
}
type P = keyof Point
const p1:P = 'x'
const p2:P = 'y'
```

## 内置工具类

### Partial

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P]
}
```

作用：用来构造一个类型，将Type的所有属性设置为可选

### Readonly

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P]
}
```

作用：用来构造一个类型，将Type的所有属性都设置为只读

### Pick

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

作用：从T中选择一组属性来构造新类型、适用于对象

### Record

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

作用：构造一个对象类型，属性键为keys，属性类型为Type

### Omit

```typescript
type Omit<T, K extends keyof any> = 
    Pick<T, Exclude<keyof T, K>>;
```

作用：排除选出的那一个属性，将剩余的属性组成一个新类型、适用于对象

### Required

```typescript
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

作用：将一个类型的属性全部变为必选

### Exclude

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

作用：排除一个联合类型中的某一些类型来构造一个新 Type

### Extract

```typescript
type Extract<T, U> = T extends U ? T : never;
```

作用：提取出一个联合类型中的某一些类型来构造一个新 Type

### NonNullable

```typescript
type NonNullable<T> = T extends null | undefined ? never : T
```

作用：从类型中排除 null 和 undefined 来构造一个新的 Type

### Parameters

```typescript
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
```

作用：从 [函数 Type] 的形参构造一个数组 Type

### ConstructorParameters

```typescript
type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never
```

作用：从定义的[构造函数]的形参构造数组 Type

### ReturnType

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

作用：用函数 Type 的返回值定义一个新的 Type

### InstanceType

```typescript
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any
```

作用：从一个构造函数的实例定义一个新的 Type

### ThisParameter

```typescript
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown
```

作用：提取函数 Type 的 this 参数生成一个新的 Type

### OmitThisParameter

```typescript
type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T
```

作用：：忽略函数 Type 的 this 参数，生成一个新的函数 Type

### Uppercase

作用：将字符串中的每个字符转换为大写

### Lowercase

作用：将字符串中的每个字符转换为小写

### Capitalize

作用：将字符串中的第一个字符转换为大写

### Uncapitalize

作用： 将字符串中的第一个字符转换为小写

## 索引访问类型

```typescript
type Person = {
  age:number,
  name:string,
  alive:boolean
}
type Age = Person['age']
```

## 条件类型

```typescript
interface Animal{
  live():void
}
interface Dog extends Animal{
  bark():void
}
type ns = Dog extends Animla ? number:string


interface ID{
  id:number
}
interface Name{
  name:string
}
function createLabel(id:number):ID
function createLabel(name:string):Name
function createLabel(ni:string|number):Name|ID
function createLabel(ni:string|number):Name|ID{
  throw ''
}
type NameOrId<T extends number|string> = T extends number?ID:Name
```

### 条件类型约束

```typescript
type Flatten<T> = T extends any[] ? T[number] : T
type Str = Flatten<string[]>  //string
```

## infer

```typescript
type GetReturnType<Type> = Type extends (...args:never[])=>infer Return?Return:never
type Num = GetReturnType<()=>number>
type Str = GetReturnType<(x:string)=>string>
type Booleans = GetReturnType<(a:boolean,b:boolean)=>boolean[]>

type Never = GetReturnType<string>


function strOrnum(x:string):number
function strOrnum(x:number):string
function strOrnum(x:string|number):string|number
function strOrnum(x:string|number):string|number{
  return Math.random()>0.5?'123':123
}

type T1 = GetReturnType<typeof strOrnum>
```

## 分布式条件类型

```typescript
type ToArray<Type> = Type extends any?Type[]:never
//=>string[]|number[]
type strOrnumArr = ToArray<string|number>
let saon:strOrnumArr = ['123']

//=>(string|number)[]
type StrOrNum<Type> = [Type] extends [any]?Type[]:never
type strornum = StrOrNum<string|number>
let saon:strornum = ['123']
```

## 类

### 类属性

```typescript
class Point{
  x:number=0,
  y:number=0
  //init2
  constructor(){
    this.x = 0
    this.y = 0
  }
  //init3
  x!:number
}
const pt = new Point()
pt.x = 0
pt.y = 1
```

### readonly

确保属性只在构造函数内部能够改写

```typescript
class Gretter{
  readonly name:string = 'world'
  constructor(other:string){
    this.name = other
  }
  err(){
    ❌
    this.name = 'not'
  }
}
const gretter = new Gretter('hello')
❌
gretter.name = 'not'
```

### 构造器

```typescript
class Point{
  x:number,
  y:number
  constructor(x:number,y:number){
    this.x = x,
    this.y = y
  }
}
const p = new Point(1,2)
```

### 方法

```typescript
class Point{
  x:number = 10,
  y:number = 10
  scale(n:number):void{
    this.x *= n,
    this.y *= n
  }
}
const p = new Point(10)
```

### getters&setters

1. 如果只有get没有set，则属性变为只读
2. 如果没有指定set的参数类型，则将从get的返回值推断
3. 必须有相同的成员可见性

```typescript
class C{
  _length = 0
  get  length(){
    return this._length
  }
  set length(value){
     this._length = value
  }
}
const c = new C()
c.legnth  //0
c.length = 100  //100


class Thing{
  _size = 0
  get size():number{
    return this._size
  }
  set size(value:string|number){
    let num = Number(value)
    if(!Number.isFinite(num)){
      this._size = 0
      return
    }
    this._size = num
  }
}
```

### 索引签名

```typescript
class MyClass{
  [s:string]:boolean | ((s:string)=>boolean)
  x=true
  check(s:string){
    return this[s] as boolean
  }
}
```

### 继承implements

```typescript
interface Pingable{
  ping():void
}
class Sonar implements Pingable{
  ping(){
    console.log('ping')
  }
}

interface A{}
interface B{}
class C implements A,B{}


interface Checkable{
  check(name:string):boolean
}
class NameCheck implements Checkable{
  check(s:number|string){
    return true
  }
}

interface A{
  x:number,
  y?:number
}
class C implements A{
  x:0
}
const c = new C()
c.x //0
c.y //undefined


//当一个类实现一个接口时，只会对其实例部分进行类型检查，而constructor处于类的静态部分
interface ClockConstructor {
  currentTime: Date
  getTime(h: number, m: number): any
  new (h: number, m: number): any
}
class Clock implements ClockConstructor{
  currentTime: Date = new Date()
  constructor(h:number,m:number){}
  getTime(h: number, m: number) {

  }
}
👇
interface ClockInterface {
  currentTime: Date
  getTime(h: number, m: number): any
}
interface ClockConstructor {
  new (h: number, m: number): any
}
class Clock implements ClockInterface {
  currentTime: Date = new Date()
  constructor(h: number, m: number) {}
  getTime(h: number, m: number) {}
}
function CheckClock(c: ClockConstructor, h: number, m: number) {
  return new c(h, m)
}
```

### 继承extends

```typescript
class Animal{
  move(){
    console.log('moving')
  }
}
class Dog extends Animal{
  woof(times:number){
    for(let i = 0;i < times;i++){
      console.log('woof')
    }
  }
}
const dog = new Dog()
dog.move()
dog.woof(10)
```

### 重写

```typescript
class Base{
  greet(){
    console.log('Hello,World!')
  }
}
class Derived extends Base{
  greet(name?:string){
    if(name===undefined){
      super.greet()
    }else{
      console.log(name.toUpperCase())
    }
  }
}
```

### 初始化顺序

1. 基类字段初始化
2. 基类构造函数运行
3. 派生类的字段初始化
4. 派生类构造函数运行

```typescript
class Base{
  name='base'
  constructor(){
    console.log(this.name)
  }
}
class Dervied extends Base{
  name = 'dervied'
  constructor(){
    super()
    console.log(this.name)
  }
}
```

### 继承内置类型

```typescript
class MsgError extends Error{
  constructor(m:string){
    super(m)
    //兼顾es5
    Object.setPrototypeOf(this,MsgError.prototype)
  }
  sayHello(){
    return 'hello'+this.message
  }
}
const error = new MsgError('hello')
```

### 成员可见性

```typescript
//public  对当前类、子类、实例可见
class Gretter{
  greet(){
    console.log('hi')
  }
  sayHello(){
    this.greet()
  }
}
class Hello extends Gretter{
  constructor(){
    super()
    this.greet()
    this.sayHello()
  }
}
const greet = new Gretter()


//protected   对当前类和子类可见
class Gretter{
  greet(){
    this.getName()
  }
  protected  getName(){
    return 'Hello'
  }
}
class Hello extends Gretter{
  public getName(){
    return 'World!'
  }
}


//private 仅对当前类可见
class Base{
  private x = 0
  printX(){
    console.log(this.x)
  }
}
class Derived extends Base{

}
const d = new Derived()

class A{
  private x = 10
  public sameAs(other:A){
    return other.x === this.x
  }
}
```

### 静态成员

```typescript
class MyClass{
 private  static x = 0
  printX(){
    console.log(MyClass.x)
  }
}

class Base{
  static getSomething(){
    return 'hello'
  }
}
class Derived extends Base{
  myGet = Derived.getSomething()
}
```

### static区块

```typescript
class Foo{
  static #count = 0
  get count(){
    return Foo.#count
  }
  static {
    try{
      const lastInstance = {
        length:100
      }
      Foo.#count = lastInstance.length
    }catch(){}
  }
}
❌
Foo.#count
```

### 泛型类

```typescript
class Box<Type>{
  contents:Type
  constructor(value:Type){
    this.contents = value
  }
  ❌
  static defaultValue:Type
}
const B:Box = new Box('hello')
```

### 类运行时的this

```typescript
class MyClass{
  name:'MyClass'
  getName(){
    return this.name
  }
  getName(this:MyClass){
    return this.name
  }
  //修正this，始终指向实例对象
  getName = ()=>{
    return this.name
  }

}
const c = new MyClass()
c.getName() //'MyClass'
const obj = {
  name:'obj',
  getName:c.getName //'obj'
}
```

### this类型

```typescript
class Box{
  content:string = ''
  set(value:string){
    this.content = value
    return this
  }
}
class div extends Box{
  clear(){
    this.content = ''
  }
}
const a = new div()
const b = a.set('hello')  //return div{content:'hello'}

class Box{
  contents:string = ''
  sameAs(other:this){
    return other.content === this.content
  }
}
class DerivedBox extends Box{
  otherContent:string = '123'
}
const base = new Box()
const derived = new DerivedBox()
derived.sameAs() //this->derived
```

### 基于类型守卫的this

```typescript
class FileSystemObject{
  isFile():this is FileRep{
    return this instanceof FileRep
  }
  isDirectory():this is Directpry{
    return this instanceof Directory
  }
  isNetworked():this is Networked & this{
    return this.networked
  }
  constructor(public path:string,private networked:boolean){}
}
class FileRep extends FileSystemObject{
  constructor(path:String,public content:string){
    super(path,false)
  }
}
class Directory extends FileSystemObject{
  children:FileSystemObject[]
  constructor(){
    super('',false)
    this.children = []
  }
}
interface NetWorked{
  host:string
}
const Fso  = new FileSystemObject('foo/bar.txt','foo')
if(Fso.isFile()){
  Fso.content
}else if(Fso.isDirectory()){
  Fso.children
}else if(Fso.isNetWorked){
  Fso.host
}
```

### 参数属性

```typescript
class Params{
  constructor(public readonly x:number,protected y:number,private z:number){
    this.x = x
  }
}
```

### 类表达式

```typescript
const someClass = class<Type>{
  content:Type
  constructor(value:Type){
    this.content = value
  }
}
const c = new someClass('hello')
c.content
```

### 抽象类和成员

1. 抽象类无法实例化，只能通过子类继承
2. 内部抽象成员无法实现

```typescript
abstract class Base{
  abstract getName():string
  printName(){
    console.log(this.getName())
  }
}
class Derived extends Base{
  getName(){
    return 'world'
  }
}
const b = new Derived()
b.getName()
b.printName()


function greet(ctor:new()=>Base){
  const instance = new ctor()
  instance.printName()
}
greet(Derived)
```

### 类之间的关系

```typescript
class Point1{
  x:0,
  y:0
}
class Point2{
  x:0,
  y:0
}
const p:Point1 = new Point2()


class Person{
  name:string='',
  age:number=100
}
class Employee{
  name:string='phenix',
  age:number=13,
  salary:number=12
}
const p:Person = new Employee()


class Empty{}
function fn(x:Empty){

}
fn(window)
fn({})
fn(fn)
fn(100)
```

## 模块化

### ESmodule

```typescript
export default function helloWorld(){
  console.log('Hello,World!')
}
```

```typescript
import hello from './hello'
hello()
```

### TS特定的模块语法

```typescript
export type Cat = {
  breed:string
  birth:number
}
export interface Dog{
  bread:string
}
```

```typescript
import {Cat,Dog} from './animal'
import type {Cat,Dog} from './animal'
type Animal = Cat|Dog
```

```typescript
import fs = require('fs')
fs.readFileSync('hello.ts','utf8')
```

### CommonJS

```typescript
function absolute(num:number){
  if(num<0)return num*-1
  return num
}
module.exports = {
  pi:3.14,
  phi:1.61,
  absolute
}
exports.absolute = absolute
```

```typescript
const maths = require('./math')
maths.pi
```
