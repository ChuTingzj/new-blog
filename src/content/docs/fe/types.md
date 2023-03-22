---
title: "Types"
description: "record for types"
---
## No.1    returnType

> ```typescript
> type User = {
>   id: number;
>   kind: string;
> };
> 
> function makeCustomer<T extends User>(u: T): T {
>   // Error（TS 编译器版本：v4.4.2）
>   // Type '{ id: number; kind: string; }' is not assignable to type 'T'.
>   // '{ id: number; kind: string; }' is assignable to the constraint of type 'T', 
>   // but 'T' could be instantiated with a different subtype of constraint 'User'.
>   return {
>     id: u.id,
>     kind: 'customer'
>   }
> }
> ```
>
> 以上代码为什么会提示错误，应该如何解决上述问题？

### 分析：传入的泛型T可能不仅仅只有id和kind属性，还有其他属性，所以需要对返回的类型进行处理

### 方法

```typescript
type User2 = {
  id: number
  kind: string
}
function makeCustomer<T extends User2>(u: T): T {
  return {
    ...u,
    id: u.id,
    kind: 'customer'
  }
}
```

## No.2    typeSync

> 本道题我们希望参数 `a` 和 `b` 的类型都是一致的，即 `a` 和 `b` 同时为 `number` 或 `string` 类型。当它们的类型不一致的值，TS 类型检查器能自动提示对应的错误信息。
>
> ```typescript
> function f(a: string | number, b: string | number) {
>   if (typeof a === 'string') {
>     return a + ':' + b; // no error but b can be number!
>   } else {
>     return a + b; // error as b can be number | string
>   }
> }
> 
> f(2, 3); // Ok
> f(1, 'a'); // Error
> f('a', 2); // Error
> f('a', 'b') // Ok
> ```

### 分析：①a为number，b也为number，a为string，b也为string，返回值的类型就是string|number，容易想到函数的重载②在判断一种类型之后，那么剩余的类型就确定了，直接类型断言

### 方法

```typescript
//answer
//方案一：类型断言
 type StringAndNumber = string | number
 function f<T extends StringAndNumber>(a: T, b: T) {
  if (typeof a === 'string') {
    return a + ':' + b
   }
   return (a as number) + (b as number)
 }

//方案二：函数重载
 function f(a:string,b:string):string
 function f(a:number,b:number):number
 function f(a: string | number, b: string | number ): string | number {
   if (typeof a === 'string') {
     return a + ':' + b;
   } else {
     return ((a as number) + (b as number));
   }
 }
```

## No.3    SetOptional&SetRequired

> 那么如何定义一个 `SetOptional` 工具类型，支持把给定的 keys 对应的属性变成可选的？对应的使用示例如下所示：
>
> ```typescript
> type Foo = {
>     a: number;
>     b?: string;
>     c: boolean;
> }
> 
> // 测试用例
> type SomeOptional = SetOptional<Foo, 'a' | 'b'>;
> 
> // type SomeOptional = {
> //     a?: number; // 该属性已变成可选的
> //     b?: string; // 保持不变
> //     c: boolean; 
> // }
> ```
>
> 在实现 `SetOptional` 工具类型之后，如果你感兴趣，可以继续实现 `SetRequired` 工具类型，利用它可以把指定的 keys 对应的属性变成必填的。对应的使用示例如下所示：
>
> ```typescript
> type Foo = {
>     a?: number;
>     b: string;
>     c?: boolean;
> }
> 
> // 测试用例
> type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
> // type SomeRequired = {
> //     a?: number;
> //     b: string; // 保持不变
> //     c: boolean; // 该属性已变成必填
> // }
> ```

### 分析：1、SetOptional：利用现有的TS内置工具类Partial+Pick、Omit(Pick+Exclude)实现将选中的属性变为可选、选出剩余的属性的功能，之后将两者用&结合，实现setOptional功能，最后创建Simplify类型，实现类型结构的扁平化，转为一个简单的结构类型（视觉上呈现为，鼠标移入SomeOptional时，能够呈现内部的结构）2、SetRequired：逻辑同上，利用TS内置的工具类Required+Pick、Omit实现将选中的属性变为必选、选出剩余属性的功能

### 方法

```typescript
//question1
// 那么如何定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的？对应的使用示例如下所示：
// type Foo = {
//     a: number;
//     b?: string;
//     c: boolean;
// }
// 测试用例
// type SomeOptional = SetOptional<Foo, 'a' | 'b'>;
// type SomeOptional = {
//     a?: number; // 该属性已变成可选的
//     b?: string; // 保持不变
//     c: boolean;
// }

//answer  泛型+映射   全部变为可选&不变的那个
// type Simplify<T> = {
//   [P in keyof T]: T[P]
// }
// type SetOptional<T, K extends keyof T> =
//   Simplify<Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>>

//question2
// 在实现 SetOptional 工具类型之后，如果你感兴趣，可以继续实现 SetRequired 工具类型，利用它可以把指定的 keys 对应的属性变成必填的。对应的使用示例如下所示：
// type Foo = {
//     a?: number;
//     b: string;
//     c?: boolean;
// }
// 测试用例
// type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
// type SomeRequired = {
//     a?: number;
//     b: string; // 保持不变
//     c: boolean; // 该属性已变成必填
// }

//answer  泛型+映射   全部变为必填&不变的那个
// type Simplify<T> = {
//   [P in keyof T]: T[P]
// }
// type SetRequired<T, K extends keyof T> = Simplify<Pick<T, Exclude<keyof T, K>> & Required<Pick<T, K>>>
```

## No.4    PickByConditional

> 如何定义一个 `ConditionalPick` 工具类型，支持根据指定的 `Condition` 条件来生成新的类型，对应的使用示例如下：
>
> ```typescript
> interface Example {
>     a: string;
>     b: string | number;
>     c: () => void;
>     d: {};
> }
> 
> // 测试用例：
> type StringKeysOnly = ConditionalPick<Example, string>;
> //=> {a: string}
> ```

### 分析：根据原有类型选出对应的类型，容易想到映射类型，对原有的类型进行一个遍历，再利用条件类型进行判断，从而选出匹配的类型

### 方法

```typescript
type ConditionalPick<V, T> = {
  [K in keyof V as V[K] extends T ? K : never]: V[K]
}
interface Example {
  a: string
  b: string | number
  c: () => void
  d: {}
}
type StringKeysOnly = ConditionalPick<Example, string | number>
```

## No.5    unshiftArguments

> 定义一个工具类型 `AppendArgument`，为已有的函数类型增加指定类型的参数，新增的参数名是 `x`，将作为新函数类型的第一个参数。具体的使用示例如下所示：
>
> ```typescript
> type Fn = (a: number, b: string) => number
> type AppendArgument<F, A> = // 你的实现代码
> 
> type FinalFn = AppendArgument<Fn, boolean> 
> // (x: boolean, a: number, b: string) => number
> ```

### 分析：①为原有的函数类型添加新的形参，首先要获取原函数的形参类型和返回值类型，利用TS内置的工具类Parameters、ReturnType即可获取对应的类型，最后只需将x添加至形参列表头部其类型依靠传入的类型，其他原函数的形参通过函数的剩余参数绑定到一起其类型就是前面Parameters获得的类型②不借助工具类，利用两个连续的infer，推断出原函数的形参、返回值类型，相当于手写了Parameters、ReturnType

### 方法

```typescript
//answer1   借助parameters 和 returntype 推出函数原来的形参类型和返回值类型
type AppendArgument<F extends (...args: any) => any, A> = (x: A, ...args: Parameters<F>) => ReturnType<F>
type Fn = (a: number, b: string) => number
type FinalF = AppendArgument<Fn, boolean>
//answer2   借助infer 推出函数原来的形参类型和返回值类型
type AppendArgument<F, T> = F extends (...args: infer Args) => infer Return ? (x: T, ...args: Args) => Return : never
type Fn = (a: number, b: string) => number
type FinalFn = AppendArgument<Fn, boolean>
```

## No.6    Flat&DeepFlat

> 定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：
>
> ```typescript
> type NaiveFlat<T extends any[]> = // 你的实现代码
> 
> // 测试用例：
> type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
> // NaiveResult的结果： "a" | "b" | "c" | "d"
> ```
>
> 在完成 `NaiveFlat` 工具类型之后，在继续实现 `DeepFlat` 工具类型，以支持多维数组类型：
>
> ```typescript
> type DeepFlat<T extends any[]> = unknown // 你的实现代码
> 
> // 测试用例
> type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
> type DeepTestResult = DeepFlat<Deep>  
> // DeepTestResult: "a" | "b" | "c" | "d" | "e"
> ```

### 分析：①NaiveFlat，前提为数组为二维数组，容易想到映射类型+条件类型的判断对数组进行"降维",如果为数组就为T[P] [number] 结果就是一个数组成员类型的联合类型，不为数组就返回自身，最后再返回整体的[number]，即数组中所有成员的联合类型②要满足多维数组的"降维"，必定要进行递归操作，也是一个通用方法，如果为数组就从头开始判断，不是数组就返回

### 方法

```typescript
//question1
// 定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：
// type NaiveFlat<T extends any[]> = // 你的实现代码
// 测试用例：
// type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>
// NaiveResult的结果： "a" | "b" | "c" | "d"
//answer
// type NaiveFlat<T extends any[]> = {
//   [P in keyof T]: T[P] extends any[] ? T[P][number] : T[P]
// }[number]
// type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>

//question2
// 在完成 NaiveFlat 工具类型之后，在继续实现 DeepFlat 工具类型，以支持多维数组类型：
// type DeepFlat<T extends any[]> = unknown // 你的实现代码
// 测试用例
// type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
// type DeepTestResult = DeepFlat<Deep>
// DeepTestResult: "a" | "b" | "c" | "d" | "e"
//answer
// type DeepFlat<T extends any[]> = T extends (infer P)[] ? (P extends any[] ? DeepFlat<P> : P) : never
// type DeepFlat<T extends any[]> = {
//   [K in keyof T]: T[K] extends any[] ? DeepFlat<T[K]> : T[K]
// }[number]
// type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]]
// type DeepTestResult = DeepFlat<Deep>
```

## No.7    EmptyObject&takeSomeTypeOnly

> 使用类型别名定义一个 `EmptyObject` 类型，使得该类型只允许空对象赋值：
>
> ```typescript
> type EmptyObject = {} 
> 
> // 测试用例
> const shouldPass: EmptyObject = {}; // 可以正常赋值
> const shouldFail: EmptyObject = { // 将出现编译错误
>   prop: "TS"
> }
> ```
>
> 在通过 `EmptyObject` 类型的测试用例检测后，我们来更改以下 `takeSomeTypeOnly` 函数的类型定义，让它的参数只允许严格SomeType类型的值。具体的使用示例如下所示：
>
> ```typescript
> type SomeType =  {
>   prop: string
> }
> 
> // 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
> function takeSomeTypeOnly(x: SomeType) { return x }
> 
> // 测试用例：
> const x = { prop: 'a' };
> takeSomeTypeOnly(x) // 可以正常调用
> 
> const y = { prop: 'a', addditionalProp: 'x' };
> takeSomeTypeOnly(y) // 将出现编译错误
> ```

### 分析：1、映射类型中，键的类型只能为string、number或symbol，要想只能赋空对象，只需要把对应的属性设置为never 2、大致题意为只允许传入的形参中出现prop这个属性，首先需要定义*Exclusive*<T1,T2>类型，作用就是找出T2中与T1相同的那个属性，这个属性就是之后传入的形参的唯一属性，最终*Exclusive*<T1,T2>返回的类型就是形参中传入的类型

### 方法

```typescript
//question1
// 使用类型别名定义一个 EmptyObject 类型，使得该类型只允许空对象赋值：
// type EmptyObject = {}
// 测试用例
// const shouldPass: EmptyObject = {}; // 可以正常赋值
// const shouldFail: EmptyObject = { // 将出现编译错误
//   prop: "TS"
// }
//answer
// type EmptyObject = {
//   [K in string | number | symbol]: never
// }

//question2
// 在通过 EmptyObject 类型的测试用例检测后，我们来更改以下 takeSomeTypeOnly 函数的类型定义，让它的参数只允许严格SomeType类型的值。具体的使用示例如下所示：
// type SomeType =  {
//   prop: string
// }
// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
// function takeSomeTypeOnly(x: SomeType) { return x }
// 测试用例：
// const x = { prop: 'a' };
// takeSomeTypeOnly(x) // 可以正常调用
// const y = { prop: 'a', addditionalProp: 'x' };
// takeSomeTypeOnly(y) // 将出现编译错误
//answer
// type Exclusive<T1, T2 extends T1> = {
//   [K in keyof T2]: K extends keyof T1 ? T2[K] : never
// }
// type SomeType =  {
//     prop: string
//   }
// function takeSomeTypeOnly<T extends SomeType>(x: Exclusive<SomeType, T>) { return x }
// const y = { prop: 'a', addditionalProp: 'x' };
// takeSomeTypeOnly(y) // 将出现编译错误
```

## No.8    NonEmptyArray

> 定义 `NonEmptyArray` 工具类型，用于确保数据非空数组。
>
> ```typescript
> type NonEmptyArray<T> = // 你的实现代码
> 
> const a: NonEmptyArray<string> = [] // 将出现编译错误
> const b: NonEmptyArray<string> = ['Hello TS'] // 非空数据，正常使用
> ```

### 分析：①要确保非空，只需关心第一个元素的类型，容易想到T[]与{0:T}的交叉类型②确定数组中每个元素的个数和类型，容易想到元组[T,...T[]]

### 方法

```typescript
//question
// 定义 NonEmptyArray 工具类型，用于确保数据非空数组。
// type NonEmptyArray<T> = // 你的实现代码
// const a: NonEmptyArray<string> = [] // 将出现编译错误
// const b: NonEmptyArray<string> = ['Hello TS'] // 非空数据，正常使用

//answer1    元组
// type NonEmptyArray<T> =  [T, ...T[]]
// const a: NonEmptyArray<string> = []
// const b: NonEmptyArray<string> = ['Hello TS']

//answer2    交叉类型
// type NonEmptyArray<T> = T[] & { 0: T }
```

## No.9    JoinStrArray

> 定义一个 `JoinStrArray` 工具类型，用于根据指定的 `Separator` 分隔符，对字符串数组类型进行拼接。具体的使用示例如下所示：
>
> ```typescript
> type JoinStrArray<Arr extends string[], Separator extends string, Result extends string = ""> = // 你的实现代码
> 
> // 测试用例
> type Names = ["Sem", "Lolo", "Kaquko"]
> type NamesComma = JoinStrArray<Names, ","> // "Sem,Lolo,Kaquko"
> type NamesSpace = JoinStrArray<Names, " "> // "Sem Lolo Kaquko"
> type NamesStars = JoinStrArray<Names, "⭐️"> // "Sem⭐️Lolo⭐️Kaquko"
> ```

### 分析：利用模板字面量类型+元组+剩余参数对每一次数组的第一项进行提取，再利用模板字面量进行字符串的拼接，拼接的结果作为下一次的递归的result，以此类推

<img src="D:\A-Space\ChuTing\Konwledge is infinite🤑\前端\images\JoinStrArray.jpg" style="zoom:25%;" />

### 方法

```typescript
type JoinStrArray<Arr extends string[], Separator extends string, Result extends string = ''> = Arr extends [infer El, ...infer Rest]
  ? Rest extends string[]
    ? El extends string
      ? Result extends ''
        ? JoinStrArray<Rest, Separator, `${El}`>
        : JoinStrArray<Rest, Separator, `${Result}${Separator}${El}`>
      : `${Result}`
    : `${Result}`
  : `${Result}`
type Names = ['Sem', 'Lolo', 'Kaquko']
type NamesComma = JoinStrArray<Names, ','> // "Sem,Lolo,Kaquko"
type NamesSpace = JoinStrArray<Names, ' '> // "Sem Lolo Kaquko"
type NamesStars = JoinStrArray<Names, '⭐️'> // "Sem⭐️Lolo⭐️Kaquko"
```

## No.10    Trim

> 实现一个 `Trim` 工具类型，用于对字符串字面量类型进行去空格处理。具体的使用示例如下所示：
>
> ```typescript
> type Trim<V extends string> = // 你的实现代码
> 
> // 测试用例
> Trim<' semlinker '>
> //=> 'semlinker'
> ```
>
> > 提示：可以考虑先定义 TrimLeft 和 TrimRight 工具类型，再组合成 Trim 工具类型。

### 分析：主要还是利用模板字面量，判断类型是否extends`${}`或`${}`,由此可以定义出TrimLeft和TrimRight类型，最后再嵌套两者类型实现去除两端的空格

### 方法

```typescript
type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V
type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V
type Trim<V extends string> = TrimLeft<TrimRight<V>>
```

## No.11    IsEqual

> 实现一个 `IsEqual` 工具类型，用于比较两个类型是否相等。具体的使用示例如下所示：
>
> ```typescript
> type IsEqual<A, B> = // 你的实现代码
> 
> // 测试用例
> type E0 = IsEqual<1, 2>; // false
> type E1 = IsEqual<{ a: 1 }, { a: 1 }> // true
> type E2 = IsEqual<[1], []>; // false
> ```

### 分析：要使两个类型相等，即两种类型可以互相赋值，A extends B，B extends A

### 方法

```typescript
type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false
```

## No.12    TakeHeadArray

> 实现一个 `Head` 工具类型，用于获取数组类型的第一个类型。具体的使用示例如下所示：
>
> ```typescript
> type Head<T extends Array<any>> = // 你的实现代码
> 
> // 测试用例
> type H0 = Head<[]> // never
> type H1 = Head<[1]> // 1
> type H2 = Head<[3, 2]> // 3
> ```

### 分析：①获取数组的第一个类型，容易想到infer+剩余参数，可以很轻松的提取②根据数组第一项的特征（*T extends {0:any}*）直接返回数组的第一项（T[0]）

### 方法

```typescript
// 实现一个 Head 工具类型，用于获取数组类型的第一个类型。具体的使用示例如下所示：
// type Head<T extends Array<any>> = // 你的实现代码

// 测试用例
// type H0 = Head<[]> // never
// type H1 = Head<[1]> // 1
// type H2 = Head<[3, 2]> // 3

//answer1
// type Head<T extends Array<any>> = T extends {0:any}? T[0] : never
//answer2
// type Head<T extends Array<any>> = T extends [infer F, ...infer Rest] ? F : never
```

## No.13    TakeTailArray

> 实现一个 `Tail` 工具类型，用于获取数组类型除了第一个类型外，剩余的类型。具体的使用示例如下所示：
>
> ```typescript
> type Tail<T extends Array<any>> =  // 你的实现代码
> 
> // 测试用例
> type T0 = Tail<[]> // []
> type T1 = Tail<[1, 2]> // [2]
> type T2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]
> ```

### 分析：思路同上，利用infer+剩余参数对数组进行类型提取

### 方法

```typescript
//question
// 实现一个 Tail 工具类型，用于获取数组类型除了第一个类型外，剩余的类型。具体的使用示例如下所示：
// type Tail<T extends Array<any>> =  // 你的实现代码
// 测试用例
// type T0 = Tail<[]> // []
// type T1 = Tail<[1, 2]> // [2]
// type T2 = Tail<[1, 2, 3, 4, 5]> // [2, 3, 4, 5]

//answer1
// type Tail<T extends Array<any>> = T extends [f: any, ...args: infer l] ? l : []
//answer2
// type Tail<T extends Array<any>> = T extends [infer A, ...infer B] ? B : [];
```

## No.14    UnshiftArray

> 实现一个 `Unshift` 工具类型，用于把指定类型 `E` 作为第一个元素添加到 `T` 数组类型中。具体的使用示例如下所示：
>
> ```typescript
> type Unshift<T extends any[], E> =  // 你的实现代码
> 
> // 测试用例
> type Arr0 = Unshift<[], 1>; // [1]
> type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
> ```

### 分析：①已知数组第一项的类型直接利用索引签名，对数组第一项进行类型声明，对于剩余项则直接利用扩展运算符展开即可②直接利用元组+扩展运算符，直接将E添加到数组头部

### 方法

```typescript
//question
// 实现一个 Unshift 工具类型，用于把指定类型 E 作为第一个元素添加到 T 数组类型中。具体的使用示例如下所示：
// type Unshift<T extends any[], E> =  // 你的实现代码
// 测试用例
// type Arr0 = Unshift<[], 1>; // [1]
// type Arr1 = Unshift<[1, 2, 3], 0>; // [0, 1, 2, 3]
//answer1
// type ParametersArray<T extends any[]> = T extends [...args:infer P]?P:[]
// type Unshift<T extends any[], E> = [E,...ParametersArray<T>]
//answer2
// type Unshift<T extends any[], E> =  [E, ...T];
```

## No.15    ShiftArray

> 实现一个 `Shift` 工具类型，用于移除 `T` 数组类型中的第一个类型。具体的使用示例如下所示：
>
> ```typescript
> type Shift<T extends any[]> = // 你的实现代码
> 
> // 测试用例
> type S0 = Shift<[1, 2, 3]> // [2, 3]
> type S1 = Shift<[string,number,boolean]> // [number,boolean]
> ```

### 分析：确定了数组某一项的类型，直接利用infer进行类型提取，加之条件类型，直接返回数组的尾部的类型

### 方法

```typescript
//question
// 实现一个 Shift 工具类型，用于移除 T 数组类型中的第一个类型。具体的使用示例如下所示：
// type Shift<T extends any[]> = // 你的实现代码
// 测试用例
// type S0 = Shift<[1, 2, 3]> // [2, 3]
// type S1 = Shift<[string,number,boolean]> // [number,boolean]

//answer
// type Shift<T extends any[]> = T extends [any, ...infer B] ? B : never
```

## No.16    PushArray

> 实现一个 `Push` 工具类型，用于把指定类型 `E` 作为最后一个元素添加到 `T` 数组类型中。具体的使用示例如下所示：
>
> ```typescript
> type Push<T extends any[], V> = // 你的实现代码
> 
> // 测试用例
> type Arr0 = Push<[], 1> // [1]
> type Arr1 = Push<[1, 2, 3], 4> // [1, 2, 3, 4]
> ```

### 分析：确定了数组某一项的类型，向数组尾部添加类型，利用元组+扩展运算符，对数组的类型进行类型声明

### 方法

```typescript
//question
// 实现一个 Push 工具类型，用于把指定类型 E 作为最后一个元素添加到 T 数组类型中。具体的使用示例如下所示：
// type Push<T extends any[], V> = // 你的实现代码
// 测试用例
// type Arr0 = Push<[], 1> // [1]
// type Arr1 = Push<[1, 2, 3], 4> // [1, 2, 3, 4]

//answer
// type Push<T extends any[], V> = [...T, V]
```

## No.17    Includes

> 实现一个 `Includes` 工具类型，用于判断指定的类型 `E` 是否包含在 `T` 数组类型中。具体的使用示例如下所示：
>
> ```typescript
> type Includes<T extends Array<any>, E> = // 你的实现代码
> 
> type I0 = Includes<[], 1> // false
> type I1 = Includes<[2, 2, 3, 1], 2> // true
> type I2 = Includes<[2, 3, 3, 1], 1> // true
> ```

### 分析：①利用infer+递归，对数组的每一次的第一项进行类型提取，再与E进行比较②直接利用T[number]遍历数组每一项的类型，再与E进行比较

### 方法

```typescript
//question
// 实现一个 Includes 工具类型，用于判断指定的类型 E 是否包含在 T 数组类型中。具体的使用示例如下所示：
// type Includes<T extends Array<any>, E> = // 你的实现代码
// type I0 = Includes<[], 1> // false
// type I1 = Includes<[2, 2, 3, 1], 2> // true
// type I2 = Includes<[2, 3, 3, 1], 1> // true

//answer1
// type Includes<T extends Array<any>, E> = T extends [infer F,...infer Rest]?F extends E?true:Includes<Rest,E>:false
//answer2
// type Includes<T extends Array<any>, E> = E extends T[number] ? true : false;
```

## No.18    UnionToIntersection

> 实现一个 `UnionToIntersection` 工具类型，用于把联合类型转换为交叉类型。具体的使用示例如下所示：
>
> ```typescript
> type UnionToIntersection<U> = // 你的实现代码
> 
> // 测试用例
> type U0 = UnionToIntersection<string | number> // never
> type U1 = UnionToIntersection<{ name: string } | { age: number }> // { name: string; } & { age: number; }
> ```

### 分析：联合转交叉，联合类型必定extends交叉类型，如果没有那就返回never，如果只是普通的条件类型推断，那么infer的那个类型就是联合类型本身，但如果在函数的形参中，A要想extendsB，B必须包含A所有的类型

### 方法

```typescript
//question
// 实现一个 UnionToIntersection 工具类型，用于把联合类型转换为交叉类型。具体的使用示例如下所示：
// type UnionToIntersection<U> = // 你的实现代码
// 测试用例
// type U0 = UnionToIntersection<string | number> // never
// type U1 = UnionToIntersection<{ name: string } | { age: number }> // { name: string; } & { age: number; }

//answer
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type U0 = UnionToIntersection<string | number>
type U1 = UnionToIntersection<{ name: string } | { age: number }>
```

## No.19    TakeOptionalKeys

> 实现一个 `OptionalKeys` 工具类型，用来获取对象类型中声明的可选属性。具体的使用示例如下所示：
>
> ```typescript
> type Person = {
>   id: string;
>   name: string;
>   age: number;
>   from?: string;
>   speak?: string;
> };
> 
> type OptionalKeys<T> = // 你的实现代码
> type PersonOptionalKeys = OptionalKeys<Person> // "from" | "speak"
> ```

### 分析：①对于可选属性来说，类型必定包含undefined，所以直接遍历传入的类型，对每一项的类型进行判断②利用isEqual类，判断原始的属性的类型和全部为可选的属性的类型是否相同，如果相同则那个属性就是可选属性

### 方法

```typescript
//question
// 实现一个 OptionalKeys 工具类型，用来获取对象类型中声明的可选属性。具体的使用示例如下所示：
// type Person = {
//   id: string;
//   name: string;
//   age: number;
//   from?: string;
//   speak?: string;
// };
// type OptionalKeys<T> = // 你的实现代码
// type PersonOptionalKeys = OptionalKeys<Person> // "from" | "speak"

//answer1
// type OptionalKeys<T> = NonNullable<
//   {
//     [P in keyof T]: undefined extends T[P] ? P : never
//   }[keyof T]
// >
//answer2
// type IsEqual<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;
// type OptionalKeys<T> = NonNullable<{
//   [k in keyof T]: IsEqual<Pick<T, k>, Partial<Pick<T, k>>> extends true ? k : never;
// }[keyof T]>
// type Person = {
//   id: string
//   name: string
//   age: number
//   from?: string
//   speak?: string
// }
// type PersonOptionalKeys = OptionalKeys<Person>
```

## No.20    Curry

> 实现一个 `Curry` 工具类型，用来实现函数类型的柯里化处理。具体的使用示例如下所示：
>
> ```typescript
> type Curry<
>   F extends (...args: any[]) => any,
>   P extends any[] = Parameters<F>, 
>   R = ReturnType<F> 
> > = // 你的实现代码
> 
> type F0 = Curry<() => Date>; // () => Date
> type F1 = Curry<(a: number) => Date>; // (arg: number) => Date
> type F2 = Curry<(a: number, b: string) => Date>; //  (arg_0: number) => (b: string) => Date
> ```

### 分析：柯里化（将多变量函数拆解为单变量（或部分变量）的多个函数并依次调用），主要还是利用infer+剩余参数提取形参列表的第一项类型和后面的类型，提取完成后，还需判断尾部形参列表的长度，如果不为0，则将尾部的形参列表作为下一次递归的类型参数

### 方法

```typescript
//question
// 实现一个 Curry 工具类型，用来实现函数类型的柯里化处理。具体的使用示例如下所示：
// type Curry<
//   F extends (...args: any[]) => any,
//   P extends any[] = Parameters<F>,
//   R = ReturnType<F>
// > = // 你的实现代码
// type F0 = Curry<() => Date>; // () => Date
// type F1 = Curry<(a: number) => Date>; // (arg: number) => Date
// type F2 = Curry<(a: number, b: string) => Date>; //  (arg_0: number) => (b: string) => Date

//answer
// type Curry<F extends (...args: any[]) => any, P extends any[] = Parameters<F>, R = ReturnType<F>> = P extends [infer A, ...infer B] ? (B['length'] extends 0 ? F : (arg: A) => Curry<(...args: B) => R>) : F
// type F0 = Curry<() => Date> // () => Date
// type F1 = Curry<(a: number) => Date> // (arg: number) => Date
// type F2 = Curry<(a: number, b: string) => Date> //  (arg_0: number) => (b: string) => Date
```

## No.21    Merge

> 实现一个 `Merge` 工具类型，用于把两个类型合并成一个新的类型。第二种类型（SecondType）的 `Keys` 将会覆盖第一种类型（FirstType）的 `Keys`。具体的使用示例如下所示：
>
> ```typescript
> type Foo = {
>     a: number;
>     b: string;
> };
> 
> type Bar = {
>     b: number;
> };
> 
> type Merge<FirstType, SecondType> = // 你的实现代码
> 
> const ab: Merge<Foo, Bar> = { a: 1, b: 2 };
> ```

### 分析：始终保持SecondType的优先级，所以先将FirstType中的SecondType的属性先排除掉，最后再将两种类型交叉

### 方法

```typescript
//question
// 实现一个 Merge 工具类型，用于把两个类型合并成一个新的类型。第二种类型（SecondType）的 Keys 将会覆盖第一种类型（FirstType）的 Keys。具体的使用示例如下所示：
// type Foo = {
//     a: number;
//     b: string;
// };
// type Bar = {
//     b: number;
// };
// type Merge<FirstType, SecondType> = // 你的实现代码
// const ab: Merge<Foo, Bar> = { a: 1, b: 2 };

//answer1
// type Merge<FirstType, SecondType> = {
//   [K in keyof (FirstType & SecondType)]: K extends keyof SecondType ? SecondType[K] : K extends keyof FirstType ? FirstType[K] : never
// }
//answer2😍
// type Merge <FirstType, SecondType> = Omit<FirstType, keyof SecondType> & SecondType;
// type Foo = {
//   a: number
//   b: string
// }
// type Bar = {
//   b: number
// }
// const ab: Merge<Foo, Bar> = { a: 1, b: 2 }
```

## No.22    RequireAtLeastOne

> 实现一个 `RequireAtLeastOne` 工具类型，它将创建至少含有一个给定 `Keys` 的类型，其余的 `Keys` 保持原样。具体的使用示例如下所示：
>
> ```typescript
> type Responder = {
>     text?: () => string;
>     json?: () => string;
>     secure?: boolean;
> };
> 
> type RequireAtLeastOne<
>     ObjectType,
>     KeysType extends keyof ObjectType = keyof ObjectType,
> > = // 你的实现代码
> 
> // 表示当前类型至少包含 'text' 或 'json' 键
> const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
>     json: () => '{"message": "ok"}',
>     secure: true
> };
> ```

### 分析：利用了联合类型作为泛型是 extends 会分发处理的特性，将ObjectType中的KeysType类型分别变为必选参数，最后再联合

### 方法

```typescript
//question
// 实现一个 RequireAtLeastOne 工具类型，它将创建至少含有一个给定 Keys 的类型，其余的 Keys 保持原样。具体的使用示例如下所示：
// type Responder = {
//     text?: () => string;
//     json?: () => string;
//     secure?: boolean;
// };
// type RequireAtLeastOne<
//     ObjectType,
//     KeysType extends keyof ObjectType = keyof ObjectType,
// > = // 你的实现代码
// 表示当前类型至少包含 'text' 或 'json' 键
// const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
//     json: () => '{"message": "ok"}',
//     secure: true
// };

//answer
type RequireAtLeastOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = KeysType extends keyof ObjectType ? ObjectType & Required<Pick<ObjectType, KeysType>> : never
type Responder = {
  text?: () => string
  json?: () => string
  secure?: boolean
}
type a = RequireAtLeastOne<Responder, 'text' | 'json'>
const responder: RequireAtLeastOne<Responder, 'text' | 'json'> = {
  json: () => '{"message": "ok"}',
  secure: true
}
```

## No.23    RemoveIndexSignature

> 实现一个 `RemoveIndexSignature` 工具类型，用于移除已有类型中的索引签名。具体的使用示例如下所示：
>
> ```typescript
> interface Foo {
>   [key: string]: any;
>   [key: number]: any;
>   bar(): void;
> }
> 
> type RemoveIndexSignature<T> = // 你的实现代码
> 
> type FooWithOnlyBar = RemoveIndexSignature<Foo>; //{ bar: () => void; }
> ```

### 分析：移除索引签名，即将对应的索引签名变为never即可，普通类型的属性为string|number|symbol，排除对应的类型即可

### 方法

```typescript
//question
// 实现一个 RemoveIndexSignature 工具类型，用于移除已有类型中的索引签名。具体的使用示例如下所示：
// interface Foo {
//   [key: string]: any;
//   [key: number]: any;
//   bar(): void;
// }
// type RemoveIndexSignature<T> = // 你的实现代码
// type FooWithOnlyBar = RemoveIndexSignature<Foo>; //{ bar: () => void; }

//answer1
// type RemoveIndexSignature<T> = {
//   [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K]
// }
//answer2
type RemoveIndexSignature<T> = {
  [k in keyof T as string extends k ? never : number extends k ? never : symbol extends k ? never : k]: T[k]
}
interface Foo {
  [key: string]: any
  [key: number]: any
  bar(): void
  0: any
}
type FooWithOnlyBar = RemoveIndexSignature<Foo>
```

## No.24    Mutable

> 实现一个 `Mutable` 工具类型，用于移除对象类型上所有属性或部分属性的 `readonly` 修饰符。具体的使用示例如下所示：
>
> ```typescript
> type Foo = {
>   readonly a: number;
>   readonly b: string;
>   readonly c: boolean;
> };
> 
> type Mutable<T, Keys extends keyof T = keyof T> = // 你的实现代码
> 
> const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };
> 
> mutableFoo.a = 3; // OK
> mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.
> ```

### 分析：总体思路为将需要去除readonly的那个属性挑出来去除readonly后，再与原来的对象交叉

### 方法

```typescript
//question
// 实现一个 Mutable 工具类型，用于移除对象类型上所有属性或部分属性的 readonly 修饰符。具体的使用示例如下所示：
// type Foo = {
//   readonly a: number;
//   readonly b: string;
//   readonly c: boolean;
// };
// type Mutable<T, Keys extends keyof T = keyof T> = // 你的实现代码
// const mutableFoo: Mutable<Foo, 'a'> = { a: 1, b: '2', c: true };
// mutableFoo.a = 3; // OK
// mutableFoo.b = '6'; // Cannot assign to 'b' because it is a read-only property.

//answer1
// type Simplify<T> = {
//   [K in keyof T]: T[K]
// }
// type Mutable<T, Keys extends keyof T = keyof T> = Simplify<
//   {
//     -readonly [K in Keys]: T[K]
//   } & Omit<T, Keys>
// >
//answer2
// type Mutable<T, Keys extends keyof T = keyof T> = {
//   [J in keyof T]: T[J]
// } & {
//   -readonly [K in Keys]: T[K]
// }

// type Foo1 = {
//   readonly a: number
//   readonly b: string
//   readonly c: boolean
// }
// const mutableFoo: Mutable<Foo1, 'a'> = { a: 1, b: '2', c: true }
// mutableFoo.a = 3 // OK
// mutableFoo.b = '6' // Cannot assign to 'b' because it is a read-only property.
```

## No.25    IsUnion

> 实现一个 `IsUnion` 工具类型，判断指定的类型是否为联合类型。具体的使用示例如下所示：
>
> ```typescript
> type IsUnion<T, U = T> = // 你的实现代码
> 
> type I0 = IsUnion<string|number> // true
> type I1 = IsUnion<string|never> // false
> type I2 =IsUnion<string|unknown> // false
> ```

### 分析：①如果是联合类型，那么他们的交叉类型必为never，如果不是，则就不是never②利用条件类型对于非裸类型不会被分解为多个分支的特性，为比较的类型用[]装饰，如果是联合类型的话 [U] extends [T] 一定为否

### 方法

```typescript
//question
// 实现一个 IsUnion 工具类型，判断指定的类型是否为联合类型。具体的使用示例如下所示：
// type IsUnion<T, U = T> = // 你的实现代码
// type I0 = IsUnion<string|number> // true
// type I1 = IsUnion<string|never> // false
// type I2 =IsUnion<string|unknown> // false

//answer1
// type UnionToIntersection1<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
// type IsUnion<T, U = T> = U extends UnionToIntersection1<T> ? false : true
//answer2
type IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never
type I0 = IsUnion<string | number> // true
type I1 = IsUnion<string | never> // false
type I2 = IsUnion<string | unknown> // false
type b = IsUnion<never>
```

## No.26    IsNever

> 实现一个 `IsNever` 工具类型，判断指定的类型是否为 `never` 类型。具体的使用示例如下所示：
>
> ```typescript
> type I0 = IsNever<never> // true
> type I1 = IsNever<never | string> // false
> type I2 = IsNever<null> // false
> ```

### 分析：never 是一个联合类型，因此要通过 [T] 将其变成普通类型，再去 extends

### 方法

```typescript
//question
// 实现一个 IsNever 工具类型，判断指定的类型是否为 never 类型。具体的使用示例如下所示：
// type I0 = IsNever<never> // true
// type I1 = IsNever<never | string> // false
// type I2 = IsNever<null> // false

//answer
type IsNever<T> = T[] extends never[] ? true : false
type I3 = IsNever<never> // true
type I4 = IsNever<never | string> // false
type I5 = IsNever<null> // false
```

## No.27    Reverse

> 实现一个 `Reverse` 工具类型，用于对元组类型中元素的位置颠倒，并返回该数组。元组的第一个元素会变成最后一个，最后一个元素变成第一个。
>
> ```typescript
> type Reverse<
>   T extends Array<any>,
>   R extends Array<any> = []
> > = // 你的实现代码
> 
> type R0 = Reverse<[]> // []
> type R1 = Reverse<[1, 2, 3]> // [3, 2, 1]
> ```

### 分析：每次取出数组的第一个元素作为下一次递归的最后一项，再将剩余的数组作为下一次递归 的前一项

### 方法

```typescript
//question
// 实现一个 Reverse 工具类型，用于对元组类型中元素的位置颠倒，并返回该数组。元组的第一个元素会变成最后一个，最后一个元素变成第一个。
// type Reverse<
//   T extends Array<any>,
//   R extends Array<any> = []
// > = // 你的实现代码
// type R0 = Reverse<[]> // []
// type R1 = Reverse<[1, 2, 3]> // [3, 2, 1]

//answer
type Reverse<T> = T extends [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : []
type R1 = Reverse<[1, 2, 3]>
```

## No.28    Split

> 实现一个 `Split` 工具类型，根据给定的分隔符（Delimiter）对包含分隔符的字符串进行切割。可用于定义 `String.prototype.split` 方法的返回值类型。具体的使用示例如下所示：
>
> ```typescript
> type Item = 'semlinker,lolo,kakuqo';
> 
> type Split<
>     S extends string, 
>     Delimiter extends string,
> > = // 你的实现代码
> 
> type ElementType = Split<Item, ','>; // ["semlinker", "lolo", "kakuqo"]
> ```

### 分析：从结构上出发，对字符串的第一项进行依次提取类型，结构大致为`${infer F}${Delimiter}${infer R}`，然后就是依次递归

### 方法

```typescript
// 实现一个 Split 工具类型，根据给定的分隔符（Delimiter）对包含分隔符的字符串进行切割。可用于定义 String.prototype.split 方法的返回值类型。具体的使用示例如下所示：
// type Item = 'semlinker,lolo,kakuqo';
// type Split<
//     S extends string,
//     Delimiter extends string,
// > = // 你的实现代码
// type ElementType = Split<Item, ','>; // ["semlinker", "lolo", "kakuqo"]

//answer
type Split<S extends string, Delimiter extends string> = S extends `${infer T}${Delimiter}${infer R}` ? [T, ...Split<R, Delimiter>] : [S]
type Item = 'semlinker,lolo,kakuqo'
type ElementType = Split<Item, ','>
```

## No.29    ToPath

> 实现一个 `ToPath` 工具类型，用于把属性访问（`.` 或 `[]`）路径转换为元组的形式。具体的使用示例如下所示：
>
> ```typescript
> type ToPath<S extends string> = // 你的实现代码
> 
> ToPath<'foo.bar.baz'> //=> ['foo', 'bar', 'baz']
> ToPath<'foo[0].bar.baz'> //=> ['foo', '0', 'bar', 'baz']
> ```

### 分析：依旧从结构上出发，${infer T}.${infer R}、${infer F}[${infer A}]，分别对应.和[]的结构

### 方法

```typescript
//question
// 实现一个 ToPath 工具类型，用于把属性访问（. 或 []）路径转换为元组的形式。具体的使用示例如下所示：
// type ToPath<S extends string> = // 你的实现代码
// ToPath<'foo.bar.baz'> //=> ['foo', 'bar', 'baz']
// ToPath<'foo[0].bar.baz'> //=> ['foo', '0', 'bar', 'baz']

//answer
type ToPath<S extends string> = S extends `${infer T}.${infer R}` ? (T extends `${infer F}[${infer A}]` ? [F, A, ...ToPath<R>] : [T, ...ToPath<R>]) : [S]
type a1 = ToPath<'foo.bar.baz'> //=> ['foo', 'bar', 'baz']
type a2 = ToPath<'foo[0].bar.baz'> //=> ['foo', '0', 'bar', 'baz']
```

## No.30    Chainable

> 完善 `Chainable` 类型的定义，使得 TS 能成功推断出 `result` 变量的类型。调用 `option` 方法之后会不断扩展当前对象的类型，使得调用 `get` 方法后能获取正确的类型。
>
> ```typescript
> declare const config: Chainable
> 
> type Chainable = {
>   option(key: string, value: any): any
>   get(): any
> }
> 
> const result = config
>   .option('age', 7)
>   .option('name', 'lolo')
>   .option('address', { value: 'XiaMen' })
>   .get()
> 
> type ResultType = typeof result  
> // 期望 ResultType 的类型是：
> // {
> //   age: number
> //   name: string
> //   address: {
> //     value: string
> //   }
> // }
> ```

### 分析：链式操作的前提是前一个操作的返回值保持一致，即这里的Chainable，即option方法的返回值类型，最后的get方法的返回值应该是之前所有option中键值对的集合，即所有键值对的交叉类型。每一次的option中的键值对都需要和前一次option作交叉，所以需要保存前一次option中的键值对，所以想到在Chainable中定义泛型变量初始值为{}

### 方法

```typescript
// 完善 Chainable 类型的定义，使得 TS 能成功推断出 result 变量的类型。调用 option 方法之后会不断扩展当前对象的类型，使得调用 get 方法后能获取正确的类型。
// declare const config: Chainable
// type Chainable = {
//   option(key: string, value: any): any
//   get(): any
// }
// const result = config
//   .option('age', 7)
//   .option('name', 'lolo')
//   .option('address', { value: 'XiaMen' })
//   .get()
// type ResultType = typeof result
// 期望 ResultType 的类型是：
// {
//   age: number
//   name: string
//   address: {
//     value: string
//   }
// }

//answer1
// type Simplify<T> = {
//   [P in keyof T]: T[P]
// }
// type Chainable<T = {}> = {
//   option<V, S extends string>(
//     key: S,
//     value: V
//   ): Chainable<
//     T & {
//       [P in keyof {
//         S: S
//       } as `${S}`]: V
//     }
//   >
//   get(): Simplify<T>
// }

//answer2
type ITypes = string | number | symbol
type Chainable<T = {}> = {
  option<K extends ITypes, V extends any>(key: K, value: V): Chainable<T & Record<K, V>>
  get(): T
}
```

## No.31    Repeat

> 实现一个 `Repeat` 工具类型，用于根据类型变量 `C` 的值，重复 `T` 类型并以元组的形式返回新的类型。具体的使用示例如下所示：
>
> ```typescript
> type Repeat<T, C extends number> = // 你的实现代码
> 
> type R0 = Repeat<0, 0>; // []
> type R1 = Repeat<1, 1>; // [1]
> type R2 = Repeat<number, 2>; // [number, number]
> ```

### 分析：整体思路是不断的往一个元组里添加类型，判断这个元组的length是否extends C，如果符合就返回元组

### 方法

```typescript
// 实现一个 Repeat 工具类型，用于根据类型变量 C 的值，重复 T 类型并以元组的形式返回新的类型。具体的使用示例如下所示：
// type Repeat<T, C extends number> = // 你的实现代码
// type R0 = Repeat<0, 0>; // []
// type R1 = Repeat<1, 1>; // [1]
// type R2 = Repeat<number, 2>; // [number, number]

//answer
type Repeat<T, C extends number, A extends any[] = []> = A['length'] extends C ? A : Repeat<T, C, [...A, T]>
```

## No.32    RepeatString

> 实现一个 `RepeatString` 工具类型，用于根据类型变量 `C` 的值，重复 `T` 类型并以字符串的形式返回新的类型。具体的使用示例如下所示：
>
> ```typescript
> type RepeatString<
>   T extends string,
>   C extends number,
> > = // 你的实现代码
> 
> type S0 = RepeatString<"a", 0>; // ''
> type S1 = RepeatString<"a", 2>; // 'aa'
> type S2 = RepeatString<"ab", 3>; // 'ababab'
> ```

### 分析：思路依旧是利用模板字面量，向字符串中添加类型，但是数字的比较只能利用 数组的 lenght属性来实现，字符串的 length属性在tsc阶段无法获取到真实长度，只能得到number类型，所以需要额外声明一个类型变量[]，来探测字符串的长度

### 方法

```typescript
// 实现一个 RepeatString 工具类型，用于根据类型变量 C 的值，重复 T 类型并以字符串的形式返回新的类型。具体的使用示例如下所示：
// type RepeatString<
//   T extends string,
//   C extends number,
// > = // 你的实现代码
// type S0 = RepeatString<"a", 0>; // ''
// type S1 = RepeatString<"a", 2>; // 'aa'
// type S2 = RepeatString<"ab", 3>; // 'ababab'

//answer
//数字的比较只能利用 数组的 lenght属性来实现，字符串的 length属性在tsc阶段无法获取到真实长度，只能得到number类型。
type RepeatString<
  T extends string,
  C extends number,
  S extends any[] = [], //  用于判断是否递归完毕
  U extends string = '' //  用于累加记录已遍历过的字符串
> = S['length'] extends C ? U : RepeatString<T, C, [...S, 1], `${U}${T}`>

type S0 = RepeatString<'a', 0> // ''
type S1 = RepeatString<'a', 2> // 'aa'
type S2 = RepeatString<'ab', 3> // 'ababab'

type a20 = '123456'['length'] //number
type a21 = [1, 2, 3, 4, 5, 6]['length'] //6
```

## No.33    ToNumber

> 实现一个 `ToNumber` 工具类型，用于实现把数值字符串类型转换为数值类型。具体的使用示例如下所示：
>
> ```typescript
> type ToNumber<T extends string> = // 你的实现代码
> 
> type T0 = ToNumber<"0">; // 0
> type T1 = ToNumber<"10">; // 10
> type T2 = ToNumber<"20">; // 20
> ```

### 分析：没有办法直接转，那么想到数组的长度，向一个数组中不断添加元素，最后用这个数组的`length`与T相比，如果extends则返回对应的length，所以需要一个数组存放元素，还需要一个数组的length值探测是否达到目标值

### 方法

```typescript
// 实现一个 ToNumber 工具类型，用于实现把数值字符串类型转换为数值类型。具体的使用示例如下所示：
// type ToNumber<T extends string> = // 你的实现代码
// type T0 = ToNumber<"0">; // 0
// type T1 = ToNumber<"10">; // 10
// type T2 = ToNumber<"20">; // 20

type ToNumber<T extends string, S extends any[] = [], L extends number = S['length']> = `${L}` extends T ? L : ToNumber<T, [...S, 1]>
type T0 = ToNumber<'0'> // 0
type T1 = ToNumber<'10'> // 10
type T2 = ToNumber<'20'> // 20
```

## No.34    SmallerThan

> 实现一个 `SmallerThan` 工具类型，用于比较数值类型的大小。具体的使用示例如下所示：
>
> ```typescript
> type SmallerThan<
>   N extends number,
>   M extends number,
> > = // 你的实现代码
> 
> type S0 = SmallerThan<0, 1>; // true
> type S1 = SmallerThan<2, 0>; // false
> type S2 = SmallerThan<8, 10>; // true
> ```

### 分析：数字的比较只能利用 数组的 lenght属性来实现，这里只需要比较大小，所以可以声明一个类型变量[]，不断的向其中添加元素，如果谁先extends数组的length，那么谁就是小的那个

### 方法

```typescript
// 实现一个 SmallerThan 工具类型，用于比较数值类型的大小。具体的使用示例如下所示：
// type SmallerThan<
//   N extends number,
//   M extends number,
// > = // 你的实现代码
// type S0 = SmallerThan<0, 1>; // true
// type S1 = SmallerThan<2, 0>; // false
// type S2 = SmallerThan<8, 10>; // true

//answer
type SmallerThan<N extends number, M extends number, A extends any[] = []> = N extends A['length'] ? true : M extends A['length'] ? false : SmallerThan<N, M, [...A, 1]>
type S00 = SmallerThan<0, 1> // true
type S11 = SmallerThan<2, 0> // false
type S22 = SmallerThan<8, 10> // true
```

## No.35    Add

> 实现一个 `Add` 工具类型，用于实现对数值类型对应的数值进行加法运算。具体的使用示例如下所示：
>
> ```typescript
> type Add<T, R> = // 你的实现代码
> 
> type A0 = Add<5, 5>; // 10
> type A1 = Add<8, 20> // 28
> type A2 = Add<10, 30>; // 40
> ```

### 分析：数字的比较只能利用 数组的 lenght属性来实现，ts中类型之间无法直接加减乘除，所以利用数组的长度，声明一个类型Arr，这个类型主要用来记录对应的数值的大小，通过调用两次，得到两个数组，最后再将两个数组通过扩展运算符合并，最后取这个数组的length就是两数之和

### 方法

```typescript
// 实现一个 Add 工具类型，用于实现对数值类型对应的数值进行加法运算。具体的使用示例如下所示：
// type Add<T, R> = // 你的实现代码
// type A0 = Add<5, 5>; // 10
// type A1 = Add<8, 20> // 28
// type A2 = Add<10, 30>; // 40

//answer
type GenArr<T extends number, S extends any[] = []> = S['length'] extends T ? S : GenArr<T, [...S, 1]>
type Add<T extends number, R extends number> = [...GenArr<T>, ...GenArr<R>]['length']
```

## No.36    Filter

> 实现一个 `Filter` 工具类型，用于根据类型变量 `F` 的值进行类型过滤。具体的使用示例如下所示：
>
> ```typescript
> type Filter<T extends any[], F> = // 你的实现代码
> 
> type F0 = Filter<[6, "lolo", 7, "semlinker", false], number>; // [6, 7]
> type F1 = Filter<["kakuqo", 2, ["ts"], "lolo"], string>; // ["kakuqo", "lolo"]
> type F2 = Filter<[0, true, any, "abao"], string>; // [any, "abao"]
> ```

### 分析：对数组的每一项进行检查，如果符合就存放到一个数组中，不符合就继续检查剩余项，*🔔any、never为联合类型，使用[]包装阻止类型分发*

### 方法

```typescript
// 实现一个 Filter 工具类型，用于根据类型变量 F 的值进行类型过滤。具体的使用示例如下所示：
// type Filter<T extends any[], F> = // 你的实现代码
// type F0 = Filter<[6, "lolo", 7, "semlinker", false], number>; // [6, 7]
// type F1 = Filter<["kakuqo", 2, ["ts"], "lolo"], string>; // ["kakuqo", "lolo"]
// type F2 = Filter<[0, true, any, "abao"], string>; // [any, "abao"]

//answer  🔔any、never为联合类型，使用[]包装阻止类型分发
type Filter<T extends any[], F, Result extends any[] = []> = T extends [infer N, ...infer L] ? (N[] extends F[] ? Filter<L, F, [...Result, N]> : Filter<L, F, Result>) : Result
type F0 = Filter<[6, 'lolo', 7, 'semlinker', false], number> // [6, 7]
type F1 = Filter<['kakuqo', 2, ['ts'], 'lolo'], string> // ["kakuqo", "lolo"]
type F2 = Filter<[0, true, any, 'abao'], string> // [any, "abao"]
```

## No.37    Flat

> 实现一个 `Flat` 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：
>
> ```typescript
> type Flat<T extends any[]> = // 你的实现代码
> 
> type F0 = Flat<[]> // []
> type F1 = Flat<['a', 'b', 'c']> // ["a", "b", "c"]
> type F2 = Flat<['a', ['b', 'c'], ['d', ['e', ['f']]]]> // ["a", "b", "c", "d", "e", "f"]
> ```

### 分析：对数组每一项进行判断，如果为数组，就递归拆分

### 方法

```typescript
// 实现一个 Flat 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：
// type Flat<T extends any[]> = // 你的实现代码
// type F0 = Flat<[]> // []
// type F1 = Flat<['a', 'b', 'c']> // ["a", "b", "c"]
// type F2 = Flat<['a', ['b', 'c'], ['d', ['e', ['f']]]]> // ["a", "b", "c", "d", "e", "f"]

type Flat<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flat<First>, ...Flat<Rest>]
    : [First, ...Flat<Rest>]
  : []
type F00 = Flat<[]> // []
type F11 = Flat<['a', 'b', 'c']> // ["a", "b", "c"]
type F22 = Flat<['a', ['b', 'c'], ['d', ['e', ['f']]]]> // ["a", "b", "c", "d", "e", "f"]
```

## No.38    StartsWith&EndsWith

> 实现 `StartsWith` 工具类型，判断字符串字面量类型 `T` 是否以给定的字符串字面量类型 `U` 开头，并根据判断结果返回布尔值。具体的使用示例如下所示：
>
> ```typescript
> type StartsWith<T extends string, U extends string> = // 你的实现代码
> 
> type S0 = StartsWith<'123', '12'> // true
> type S1 = StartsWith<'123', '13'> // false
> type S2 = StartsWith<'123', '1234'> // false
> ```
>
> 此外，继续实现 `EndsWith` 工具类型，判断字符串字面量类型 `T` 是否以给定的字符串字面量类型 `U` 结尾，并根据判断结果返回布尔值。具体的使用示例如下所示：
>
> ```typescript
> type EndsWith<T extends string, U extends string> = // 你的实现代码
> 
> type E0 = EndsWith<'123', '23'> // true
> type E1 = EndsWith<'123', '13'> // false
> type E2 = EndsWith<'123', '123'> // true
> ```

### 分析：用类型U作为模板字面量类型的首尾类型用来判断，T是否是以U开头、结尾的

### 方法

```typescript
// 实现 StartsWith 工具类型，判断字符串字面量类型 T 是否以给定的字符串字面量类型 U 开头，并根据判断结果返回布尔值。具体的使用示例如下所示：
// type StartsWith<T extends string, U extends string> = // 你的实现代码
// type S0 = StartsWith<'123', '12'> // true
// type S1 = StartsWith<'123', '13'> // false
// type S2 = StartsWith<'123', '1234'> // false

type StartsWith<T extends string, U extends string> = T extends `${U}${infer Rest}` ? true : false
type S000 = StartsWith<'123', '12'> // true
type S111 = StartsWith<'123', '13'> // false
type S222 = StartsWith<'123', '1234'> // false

// 此外，继续实现 EndsWith 工具类型，判断字符串字面量类型 T 是否以给定的字符串字面量类型 U 结尾，并根据判断结果返回布尔值。具体的使用示例如下所示：
// type EndsWith<T extends string, U extends string> = // 你的实现代码
// type E0 = EndsWith<'123', '23'> // true
// type E1 = EndsWith<'123', '13'> // false
// type E2 = EndsWith<'123', '123'> // true

type EndsWith<T extends string, U extends string> = T extends `${infer Rest}${U}` ? true : false
type E0 = EndsWith<'123', '23'> // true
type E11 = EndsWith<'123', '13'> // false
type E2 = EndsWith<'123', '123'> // true
```

## No.39    IsAny

> 实现 `IsAny` 工具类型，用于判断类型 `T` 是否为 `any` 类型。具体的使用示例如下所示：
>
> ```typescript
> type IsAny<T> = // 你的实现代码
> 
> type I0 = IsAny<never> // false
> type I1 = IsAny<unknown> // false
> type I2 = IsAny<any> // true
> ```

### 分析：除never外，any会吞噬掉其他类型的值，即any与其他类型相交叉为any，所以随意找两个不用的字面量类型，对T进行判断，如果其中一个值extends T与另一个值的交叉类型，那么这个类型就是any

### 方法

```typescript
// 实现 IsAny 工具类型，用于判断类型 T[] 是否为 any 类型。具体的使用示例如下所示：
// type IsAny<T[]> = // 你的实现代码
// type I0 = IsAny<never> // false
// type I1 = IsAny<unknown> // false
// type I2 = IsAny<any> // true

//除never外，any会吞噬掉其他类型的值，即any与其他类型相交叉为any
type IsAny<T> = 0 extends 1 & T ? true : false
// type IsAny<T> = T[] extends never[]
//   ? false
//   : T[] extends string[]
//   ? T[] extends number[]
//     ? T[] extends boolean[]
//       ? T[] extends object[]
//         ? T[] extends unknown[]
//           ? T[] extends symbol[]
//             ? T[] extends null[]
//               ? T[] extends undefined[]
//                 ? T[] extends bigint[]
//                   ? T[] extends any[]
//                     ? true
//                     : false
//                   : false
//                 : false
//               : false
//             : false
//           : false
//         : false
//       : false
//     : false
//   : false
type I00 = IsAny<never> // false
type I11 = IsAny<unknown> // false
type I22 = IsAny<any> // true
```

## No.40    AnyOf

> 实现 `AnyOf` 工具类型，只要数组中任意元素的类型非 [Falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy) 类型、 `{}` 类型或 `[]` 类型，则返回 `true`，否则返回 `false`。如果数组为空的话，则返回 `false`。具体的使用示例如下所示：
>
> ```typescript
> type AnyOf<T extends any[]> = // 你的实现代码
> 
> type A0 = AnyOf<[]>; // false
> type A1 = AnyOf<[0, '', false, [], {}]> // false
> type A2 = AnyOf<[1, "", false, [], {}]> // true
> ```

### 分析：对假值进行罗列，声明一个类型存储这些假值，基本类型也都属于对象类型，所以需要对{}额外判断

### 方法

```typescript
// 实现 AnyOf 工具类型，只要数组中任意元素的类型非 Falsy 类型、 {} 类型或 [] 类型，则返回 true，否则返回 false。如果数组为空的话，则返回 false。具体的使用示例如下所示：
// type AnyOf<T extends any[]> = // 你的实现代码
// type A0 = AnyOf<[]>; // false
// type A1 = AnyOf<[0, '', false, [], {}]> // false
// type A2 = AnyOf<[1, "", false, [], {}]> // true
type NotEmptyObject<T> = T extends {} ? ({} extends T ? false : true) : true
type Falsy = 0 | '' | false | []
type AnyOf<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends Falsy
    ? AnyOf<Rest>
    : NotEmptyObject<First>
  : false
type A0 = AnyOf<[]> // false
type A1 = AnyOf<[0, '', false, [], {}]> // false
type A2 = AnyOf<[1, '', false, [], {}]> // true
```

## No.41    Replace

> 实现 `Replace` 工具类型，用于实现字符串类型的替换操作。具体的使用示例如下所示：
>
> ```typescript
> type Replace<
>   S extends string,
>   From extends string,
>   To extends string
> > = // 你的实现代码 
> 
> type R0 = Replace<'', '', ''> // ''
> type R1 = Replace<'foobar', 'bar', 'foo'> // "foofoo"
> type R2 = Replace<'foobarbar', 'bar', 'foo'> // "foofoobar"
> ```
>
> 此外，继续实现 `ReplaceAll` 工具类型，用于实现替换所有满足条件的子串。具体的使用示例如下所示：
>
> ```typescript
> type ReplaceAll<
>   S extends string,
>   From extends string,
>   To extends string
> > = // 你的实现代码 
> 
> type R0 = ReplaceAll<'', '', ''> // ''
> type R1 = ReplaceAll<'barfoo', 'bar', 'foo'> // "foofoo"
> type R2 = ReplaceAll<'foobarbar', 'bar', 'foo'> // "foofoofoo"
> type R3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // "fobarfobar"
> ```

### 分析：1、已经确定目标值只会出现一次，那么直接对目标值进行一个判断，即目标值会出现在模板字符串的开头、中间、结尾，最后对匹配到的字符串进行一个替换2、要替换所有的，目标值，无非就是加一层递归判断而已，需要注意的是，避免一些多余的判断，例：已经确定目标值在字符串的中间位置，那么前面的那一个字符串就没必要进行递归，否则会导致递归过深

### 方法

```typescript
// 实现 Replace 工具类型，用于实现字符串类型的替换操作。具体的使用示例如下所示：
// type Replace<
//   S extends string,
//   From extends string,
//   To extends string
// > = // 你的实现代码
// type R0 = Replace<'', '', ''> // ''
// type R1 = Replace<'foobar', 'bar', 'foo'> // "foofoo"
// type R2 = Replace<'foobarbar', 'bar', 'foo'> // "foofoobar"

type Replace<S extends string, From extends string, To extends string> = S extends `${From}${infer Rest}`
  ? `${To}${Rest}`
  : S extends `${infer Head}${From}${infer Rest}`
  ? `${Head}${To}${Rest}`
  : S extends `${infer Head}${infer From}`
  ? `${Head}${To}`
  : S
type R0 = Replace<'', '', ''> // ''
type R11 = Replace<'foobar', 'bar', 'foo'> // "foofoo"
type R2 = Replace<'foobarbar', 'bar', 'foo'> // "foofoobar"

// 此外，继续实现 ReplaceAll 工具类型，用于实现替换所有满足条件的子串。具体的使用示例如下所示：
// type ReplaceAll<
//   S extends string,
//   From extends string,
//   To extends string
// > = // 你的实现代码
// type R0 = ReplaceAll<'', '', ''> // ''
// type R1 = ReplaceAll<'barfoo', 'bar', 'foo'> // "foofoo"
// type R2 = ReplaceAll<'foobarbar', 'bar', 'foo'> // "foofoofoo"
// type R3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // "fobarfobar"

type ReplaceAll<S extends string, From extends string, To extends string> = S extends `${From}`
  ? S
  : S extends `${From}${infer Rest}`
  ? `${To}${ReplaceAll<Rest, From, To>}`
  : S extends `${infer Head}${From}${infer Rest}`
  ? `${Head}${To}${ReplaceAll<Rest, From, To>}`
  : S extends `${infer Head}${infer From}`
  ? `${Head}${To}`
  : S
type R00 = ReplaceAll<'', '', ''> // ''
type R111 = ReplaceAll<'barfoo', 'bar', 'foo'> // "foofoo"
type R22 = ReplaceAll<'foobarbar', 'bar', 'foo'> // "foofoofoo"
type R33 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // "fobarfobar"
```

## No.42    IndexOf

> 实现 `IndexOf` 工具类型，用于获取数组类型中指定项的索引值。若不存在的话，则返回 `-1` 字面量类型。具体的使用示例如下所示：
>
> ```typescript
> type IndexOf<A extends any[], Item> = // 你的实现代码
> 
> type Arr = [1, 2, 3, 4, 5]
> type I0 = IndexOf<Arr, 0> // -1
> type I1 = IndexOf<Arr, 1> // 0
> type I2 = IndexOf<Arr, 3> // 2
> ```

### 分析：重新创建一个类型 变量[]，用于探测A每一项的类型以及保存对应的索引，当类型变量最终的长度与A的长度相等时，说明不存在该值，如果存在就返回类型变量的长度

### 方法

```typescript
// 实现 IndexOf 工具类型，用于获取数组类型中指定项的索引值。若不存在的话，则返回 -1 字面量类型。具体的使用示例如下所示：
// type IndexOf<A extends any[], Item> = // 你的实现代码
// type Arr = [1, 2, 3, 4, 5]
// type I0 = IndexOf<Arr, 0> // -1
// type I1 = IndexOf<Arr, 1> // 0
// type I2 = IndexOf<Arr, 3> // 2

type IndexOf<A extends any[], Item, Flag extends any[] = []> = Item extends A[Flag['length']]
  ? Flag['length']
  : Flag['length'] extends A['length']
  ? -1
  : IndexOf<A, Item, [...Flag, 1]>
type Arr = [1, 2, 3, 4, 5]
type I000 = IndexOf<Arr, 0> // -1
type I111 = IndexOf<Arr, 1> // 0
type I222 = IndexOf<Arr, 3> // 2
```

## No.43    Permutation

> 实现一个 `Permutation` 工具类型，当输入一个联合类型时，返回一个包含该联合类型的全排列类型数组。具体的使用示例如下所示：
>
> ```typescript
> type Permutation<T, K=T> = // 你的实现代码
> 
> // ["a", "b"] | ["b", "a"]
> type P0 = Permutation<'a' | 'b'>  // ['a', 'b'] | ['b' | 'a']
> // type P1 = ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"] 
> // | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
> type P1 = Permutation<'a' | 'b' | 'c'> 
> ```

### 分析：通过映射类型对联合类型进行一个拆分，每次提取一个联合类型的子类型，如果在联合类型中排除此类型后为never，说明这是唯一的、最后的类型那么直接返回[index]，如果不为never说明联合类型中还有其他类型，那么将index放在首位，再对联合类型的剩余类型放到index后递归展开，最后遍历类型对应的值，得到一个联合类型，即联合类型的全排列数组

### 方法

```typescript
// 实现一个 Permutation 工具类型，当输入一个联合类型时，返回一个包含该联合类型的全排列类型数组。具体的使用示例如下所示：
// type Permutation<T, K=T> = // 你的实现代码
// // ["a", "b"] | ["b", "a"]
// type P0 = Permutation<'a' | 'b'>  // ['a', 'b'] | ['b' | 'a']
// // type P1 = ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"]
// // | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
// type P1 = Permutation<'a' | 'b' | 'c'>

// type Permutation<T, K = T> = [T] extends [never] ? [] : K extends K ? [K, ...Permutation<Exclude<T, K>>] : never
type Permutation<T extends string | number | symbol> = {
  [index in T]: IsNever<Exclude<T, index>> extends true ? [index] : [index, ...Permutation<Exclude<T, index>>]
}[T]
type P0 = Permutation<'a' | 'b'> // ['a', 'b'] | ['b' | 'a']
type P1 = Permutation<'a' | 'b' | 'c'> // type P1 = ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"]| ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
```

## No.44    Unpacked

> 实现 `Unpacked` 工具类型，用于对类型执行 “拆箱” 操作。具体的使用示例如下所示：
>
> ```typescript
> type Unpacked<T> = // 你的实现代码
> 
> type T00 = Unpacked<string>;  // string
> type T01 = Unpacked<string[]>;  // string
> type T02 = Unpacked<() => string>;  // string
> type T03 = Unpacked<Promise<string>>;  // string
> type T04 = Unpacked<Unpacked<Promise<string>[]>>;  // string
> type T05 = Unpacked<any>;  // any
> type T06 = Unpacked<never>;  // never
> ```

### 分析：对包装的情况进行一个罗列，对症下药

### 方法

```typescript
// 实现 Unpacked 工具类型，用于对类型执行 “拆箱” 操作。具体的使用示例如下所示：
// type Unpacked<T> = // 你的实现代码
// type T00 = Unpacked<string>;  // string
// type T01 = Unpacked<string[]>;  // string
// type T02 = Unpacked<() => string>;  // string
// type T03 = Unpacked<Promise<string>>;  // string
// type T04 = Unpacked<Unpacked<Promise<string>[]>>;  // string
// type T05 = Unpacked<any>;  // any
// type T06 = Unpacked<never>;  // never

//answer
type Unpacked<T> = T extends (infer P)[]
  ? P
  : T extends (...args: any[]) => infer R
  ? R
  : T extends Promise<infer U>
  ? U
  : T
type T00 = Unpacked<string> // string
type T01 = Unpacked<string[]> // string
type T02 = Unpacked<() => string> // string
type T03 = Unpacked<Promise<string>> // string
type T04 = Unpacked<Unpacked<Promise<string>[]>> // string
type T05 = Unpacked<any> // any
type T06 = Unpacked<never> // never
```

## No.45    JsonifiedObject

> 实现 `JsonifiedObject` 工具类型，用于对 `object` 对象类型进行序列化操作。具体的使用示例如下所示：
>
> ```typescript
> type JsonifiedObject<T extends object> = // 你的实现代码
> 
> type MyObject = {
>   str: "literalstring",
>   fn: () => void,
>   date: Date,
>   customClass: MyClass,
>   obj: {
>     prop: "property",
>     clz: MyClass,
>     nested: { attr: Date }
>   },
> }
> 
> declare class MyClass {
>   toJSON(): "MyClass";
> }
> 
> /**
>  * type JsonifiedMyObject = {
>  *  str: "literalstring";
>  *  fn: never;
>  *  date: string;
>  *  customClass: "MyClass";
>  *  obj: JsonifiedObject<{
>  *    prop: "property";
>  *    clz: MyClass;
>  *    nested: {
>  *      attr: Date;
>  *    };
>  *   }>;
>  * }
> */
> type JsonifiedMyObject = Jsonified<MyObject>;
> declare let ex: JsonifiedMyObject;
> const z1: "MyClass" = ex.customClass;
> const z2: string = ex.obj.nested.attr;
> ```

### 分析：对每一种情况进行罗列，对号入座

### 方法

```typescript
// type JsonifiedObject<T extends object> = // 你的实现代码
// type MyObject = {
//   str: "literalstring",
//   fn: () => void,
//   date: Date,
//   customClass: MyClass,
//   obj: {
//     prop: "property",
//     clz: MyClass,
//     nested: { attr: Date }
//   },
// }
// declare class MyClass {
//   toJSON(): "MyClass";
// }
// /**
//  * type JsonifiedMyObject = {
//  *  str: "literalstring";
//  *  fn: never;
//  *  date: string;
//  *  customClass: "MyClass";
//  *  obj: JsonifiedObject<{
//  *    prop: "property";
//  *    clz: MyClass;
//  *    nested: {
//  *      attr: Date;
//  *    };
//  *   }>;
//  * }
// */
// type JsonifiedMyObject = Jsonified<MyObject>;
// declare let ex: JsonifiedMyObject;
// const z1: "MyClass" = ex.customClass;
// const z2: string = ex.obj.nested.attr;

type Jsonified<T extends object> = {
  [k in keyof T]: T[k] extends object
    ? 'toJSON' extends keyof T[k]
      ? T[k]['toJSON'] extends (...args: any[]) => infer R
        ? R
        : never
      : T[k] extends (...args: any[]) => any
      ? never
      : Jsonified<T[k]>
    : T[k]
}
declare class MyClass {
  toJSON(): 'MyClass'
}
type MyObject = {
  str: 'literalstring'
  fn: () => void
  date: Date
  customClass: MyClass
  obj: {
    prop: 'property'
    clz: MyClass
    nested: { attr: Date }
  }
}
type JsonifiedMyObject = Jsonified<MyObject>
```

## No.46    RequireAllOrNone

> 实现 `RequireAllOrNone` 工具类型，用于满足以下功能。即当设置 `age` 属性时，`gender` 属性也会变成必填。具体的使用示例如下所示：
>
> ```typescript
> interface Person {
>   name: string;
>   age?: number;
>   gender?: number;
> }
> 
> type RequireAllOrNone<T, K extends keyof T> = // 你的实现代码
> 
> const p1: RequireAllOrNone<Person, 'age' | 'gender'> = {
>   name: "lolo"
> };
> 
> const p2: RequireAllOrNone<Person, 'age' | 'gender'> = {
>   name: "lolo",
>   age: 7,
>   gender: 1
> };
> ```

### 分析：大致上分为两种情况，All的情况其实是由剩余的那个类型与选择的那几个类型的必选交叉，none的情况需要将选择的那几个类型排除，联想到交叉，将选出的那几个类型变为never，再考虑到类型的可选性，再将选出的那几个类型变为可选，那么最后交叉的结果就是：age:number|undefined&age:undefined

### 方法

```typescript
// 实现 RequireAllOrNone 工具类型，用于满足以下功能。即当设置 age 属性时，gender 属性也会变成必填。具体的使用示例如下所示：
// interface Person {
//   name: string;
//   age?: number;
//   gender?: number;
// }
// type RequireAllOrNone<T, K extends keyof T> = // 你的实现代码
// const p1: RequireAllOrNone<Person, 'age' | 'gender'> = {
//   name: "lolo"
// };
// const p2: RequireAllOrNone<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   age: 7,
//   gender: 1
// };

//answer✨
type RequireAllOrNone<T, K extends keyof T> = Omit<T, K> & (Required<Pick<T, K>> | Partial<Record<K, never>>)
interface Person {
  name: string
  age?: number
  gender?: number
}
type bb = RequireAllOrNone<Person, 'age' | 'gender'>
const p1: RequireAllOrNone<Person, 'age' | 'gender'> = {
  name: 'lolo'
}
const p2: RequireAllOrNone<Person, 'age' | 'gender'> = {
  name: 'lolo',
  age: 7,
  gender: 1
}
type simplify<T> = {
  [K in keyof T]: T[K]
}
type zzz = simplify<Omit<Person, 'age' | 'gender'> & Partial<Record<'age' | 'gender', never>>>
```

## No.47    RequireExactlyOne

> 实现 `RequireExactlyOne` 工具类型，用于满足以下功能。即只能包含 `age` 或 `gender` 属性，不能同时包含这两个属性。具体的使用示例如下所示：
>
> ```typescript
> interface Person {
>   name: string;
>   age?: number;
>   gender?: number;
> }
> 
> // 只能包含Keys中唯一的一个Key
> type RequireExactlyOne<T, Keys extends keyof T> = // 你的实现代码
> 
> const p1: RequireExactlyOne<Person, 'age' | 'gender'> = {
>   name: "lolo",
>   age: 7,
> };
> 
> const p2: RequireExactlyOne<Person, 'age' | 'gender'> = {
>   name: "lolo",
>   gender: 1
> };
> 
> // Error
> const p3: RequireExactlyOne<Person, 'age' | 'gender'> = {
>   name: "lolo",
>   age: 7,
>   gender: 1
> };
> ```

### 分析：利用联合类型 extends 实现分布执行，之后重点是 如何让联合类型规则只有其中某一个生效，在每一个上设置哪些禁止的属性为可选 never，总体由三者交叉而成，无关的那个类型&选出类型中的某一个类型&将另外的那个选出的类型排除

### 方法

```typescript
// 实现 RequireExactlyOne 工具类型，用于满足以下功能。即只能包含 age 或 gender 属性，不能同时包含这两个属性。具体的使用示例如下所示：
// interface Person {
//   name: string;
//   age?: number;
//   gender?: number;
// }
// // 只能包含Keys中唯一的一个Key
// type RequireExactlyOne<T, Keys extends keyof T> = // 你的实现代码
// const p1: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   age: 7,
// };
// const p2: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   gender: 1
// };
// // Error
// const p3: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   age: 7,
//   gender: 1
// };

//answer
type RequireExactlyOne<T, Keys extends keyof T, K extends keyof T = Keys> = Keys extends any
  ? Omit<T, K> & Required<Pick<T, Keys>> & Partial<Record<Exclude<K, Keys>, never>>
  : never
// interface Person {
//   name: string;
//   age?: number;
//   gender?: number;
// }
// const p11: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   age: 7,
// };
// const p22: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   gender: 1
// };
// // Error
// const p33: RequireExactlyOne<Person, 'age' | 'gender'> = {
//   name: "lolo",
//   age: 7,
//   gender: 1
// };
```

## No.48    ConsistsOnlyOf

> 实现 `ConsistsOnlyOf` 工具类型，用于判断 `LongString` 字符串类型是否由 0 个或多个 `Substring` 字符串类型组成。具体的使用示例如下所示：
>
> ```typescript
> type ConsistsOnlyOf<LongString extends string, Substring extends string> = // 你的实现代码
> 
> type C0 = ConsistsOnlyOf<'aaa', 'a'> //=> true
> type C1 = ConsistsOnlyOf<'ababab', 'ab'> //=> true
> type C2 = ConsistsOnlyOf<'aBa', 'a'> //=> false
> type C3 = ConsistsOnlyOf<'', 'a'> //=> true
> ```

### 分析：依次对字符串进行探测，是否extends`${Substring}${infer Rest}`,随着不断的探测，字符串也逐渐的缩短，直至为‘’就说明为true

### 方法

```typescript
type ConsistsOnlyOf<LongString extends string, Substring extends string> = LongString extends ''
  ? true
  : LongString extends `${Substring}${infer B}`
  ? ConsistsOnlyOf<B, Substring>
  : false
```

## No.49    UnionToArray

> 实现 `UnionToArray` 工具类型，用于将联合类型转换成元组类型。具体的使用示例如下所示：
>
> ```typescript
> type UnionToArray<U> = // 你的实现代码
> 
> type A0 = UnionToArray<'aaa' | 'bbb' | 'ccc'> //=> ['aaa' , 'bbb' , 'ccc']
> type A1 = UnionToArray<1 | 2 | 3 > //=> [1, 2, 3]
> type A2 = UnionToArray<{type:'input'} | {type:'select',hasOptions:boolean}> //=> [{type:'input'} ,{type:'select',hasOptions:boolean}]
> ```

### 分析：联合转元组，那么就一定要取出每一个类型放到一个数组中，联合类型由于extends分发的缘故所以无法直接从联合类型中取类型，所以可以先转为交叉类型，再对交叉类型依次取出最后一个类型，最后再对联合类型中的剩余类型进行递归

### 方法

```typescript
// 实现 UnionToArray 工具类型，用于将联合类型转换成元组类型。具体的使用示例如下所示：
// type UnionToArray<U> = // 你的实现代码
// type A0 = UnionToArray<'aaa' | 'bbb' | 'ccc'> //=> ['aaa' , 'bbb' , 'ccc']
// type A1 = UnionToArray<1 | 2 | 3 > //=> [1, 2, 3]
// type A2 = UnionToArray<{type:'input'} | {type:'select',hasOptions:boolean}> //=> [{type:'input'} ,{type:'select',hasOptions:boolean}]
type UnionToIntersection1<U> = (U extends any ? (arg: U) => any : never) extends (arg: infer I) => void ? I : never

type UnionToTuple1<T> = UnionToIntersection1<T extends any ? (t: T) => T : never> extends (_: any) => infer W
  ? [...UnionToTuple1<Exclude<T, W>>, W]
  : []
type A00 = UnionToTuple1<'aaa' | 'bbb' | 'ccc'> //=> ['aaa' , 'bbb' , 'ccc']
type A11 = UnionToTuple1<1 | 2 | 3> //=> [1, 2, 3]
type A22 = UnionToTuple1<{ type: 'input' } | { type: 'select'; hasOptions: boolean }> //=> [{type:'input'} ,{type:'select',hasOptions:boolean}]
```
