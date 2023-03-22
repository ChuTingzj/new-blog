---
title: "Rust"
description: "record for rust"
---
## 输出到命令行

Rust 输出文字的方式主要有两种：println!() 和 print!()。这两个"函数"都是向命令行输出字符串的方法，区别仅在于前者会在输出的最后附加输出一个换行符。当用这两个"函数"输出信息的时候，第一个参数是格式字符串，后面是一串可变参数，对应着格式字符串中的"占位符"，但是，Rust 中格式字符串中的占位符不是 **"% + 字母"** 的形式，而是一对 **{}**。

```rust
fn main(){
    let a = 12
    println!("a is {}",a)
}
//a is 12 
fn main(){
    let a = 12
    println!("a is {0}, a again is {0}", a); 
}
//a is 12 ,a again is 12 
```

在 {} 之间可以放一个数字，它将把之后的可变参数当作一个数组来访问，下标从 0 开始。如果要输出 **{** 或 **}** 怎么办呢？格式字符串中通过 **{{** 和 **}}** 分别转义代表 { 和 }。但是其他常用转义字符与 C 语言里的转义字符一样，都是反斜杠开头的形式。

```rust
fn main(){
    println!("{{}")
}
// {}
```

## 变量

Rust 是强类型语言，但具有自动判断变量类型的能力。如果要声明变量，需要使用 let 关键字

> Rust 语言为了高并发安全而做的设计：在语言层面尽量少的让变量的值可以改变。所以 a 的值不可变。但这不意味着 a 不是"变量"（英文中的 variable），官方文档称 a 这种变量为"不可变变量"。

```rust
let a = 123;
//以下三行代码都是被禁止的
//a = "abc"; 当声明 a 是 123 以后，a 就被确定为整型数字，不能把字符串类型的值赋给它
//a = 4.56; 自动转换数字精度有损失，Rust 语言不允许精度有损失的自动数据类型转换。
//a = 456;  a 不是个可变变量。
```

使变量变得"可变"（mutable）只需一个 mut 关键字

```rust
let mut a = 123;
a = 456;
```

### 常量和不可变变量

在 Rust 中，以下程序是合法的

```rust
let a = 123;   // 可以编译，但可能有警告，因为该变量没有被使用
let a = 456;
```

但是如果 a 是常量就不合法，变量的值可以"重新绑定"，但在"重新绑定"以前不能私自被改变，这样可以确保在每一次"绑定"之后的区域里编译器可以充分的推理程序逻辑。

```rust
const a: i32 = 123; //有符号 32 位整型变量
//❌
//let a = 456;
```

```rust
let mut a = 2;
a = 5;
let a = 8;
println!("a is {}",a)
// a is 8
```

### 重影

重影就是指变量的名称可以被重新使用的机制

```rust
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;
    println!("The value of x is: {}", x
}
//The value of x is: 12
```

重影与可变变量的赋值不是一个概念，重影是指用同一个名字重新代表另一个变量实体，其类型、可变属性和值都可以变化。但可变变量赋值仅能发生值的变化。

```rust
let mut s = "123";
//❌
// s = s.len(); // 不能给字符串变量赋整型值
```

## 数据类型

### 整数型

整型变量，按比特位长度和有无符号划分种类，1字节=8位(bit)

isize 和 usize 两种整数类型是用来衡量数据大小的，它们的位长度取决于所运行的目标平台，如果是 32 位架构的处理器将使用 32 位位长度整型。

| 位长度     | 有符号(-(2^n-1)~2^n-1-1)                                       | 无符号(0~2^n-1)                        |
| ------- | ----------------------------------------------------------- | ----------------------------------- |
| 8-bit   | i8（-128 到 127）                                              | u8（0 到 255）                         |
| 16-bit  | i16（-32768 到 32767）                                         | u16（0 到 65,535）                     |
| 32-bit  | i32（-2147483648 到 2147483647）                               | u32（0 到 4294967295）                 |
| 64-bit  | i64（-9,223,372,036,854,775,808 到 9,223,372,036,854,775,807） | u64（0 到 18,446,744,073,709,551,615） |
| 128-bit | i128                                                        | u128                                |
| arch    | isize                                                       | usize                               |

### 浮点型

> Rust 与其它语言一样支持 32 位浮点数（f32）和 64 位浮点数（f64）。默认情况下，64.0 将表示 64 位浮点数，因为现代计算机处理器对两种浮点数计算的速度几乎相同，但 64 位浮点数精度更高。
>
> Rust 不支持 **++** 和 **--**，因为这两个运算符出现在变量的前后会影响代码可读性，减弱了开发者对变量改变的意识能力。

```rust
fn main() {
    let x = 2.0; // f64
    let y: f32 = 3.0; // f32
}
```

### 布尔型

布尔型用 bool 表示，值只能为 true 或 false

### 字符型

字符型用 char 表示。

Rust的 char 类型大小为 4 个字节，代表 Unicode标量值，这意味着它可以支持中文，日文和韩文字符等非英文字符甚至表情符号和零宽度空格在 Rust 中都是有效的 char 值

### 复合类型

元组用一对 ( ) 包括的一组数据，可以包含不同种类的数据

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
// tup.0 等于 500
// tup.1 等于 6.4
// tup.2 等于 1
let (x, y, z) = tup;
// y 等于 6.4
```

数组用一对 [ ] 包括的同类型数据。

```rust
let a = [1, 2, 3, 4, 5];
// a 是一个长度为 5 的整型数组

let b = ["January", "February", "March"];
// b 是一个长度为 3 的字符串数组

let c: [i32; 5] = [1, 2, 3, 4, 5];
// c 是一个长度为 5 的 i32 数组

let d = [3; 5];
// 等同于 let d = [3, 3, 3, 3, 3];

let first = a[0];
let second = a[1];
// 数组访问

a[0] = 123; // 错误：数组 a 不可变
let mut a = [1, 2, 3];
a[0] = 4; // 正确
```

## 注释

Rust 可以用 **///** 作为说明文档注释的开头

```rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let x = add(1, 2);
///
/// ```

fn add(a: i32, b: i32) -> i32 {
    return a + b;
}

fn main() {
    println!("{}",add(2,3));
}
```

程序中的函数 add 就会拥有一段优雅的注释，并可以显示在 IDE 中：

![](https://www.runoob.com/wp-content/uploads/2020/04/comment-rust.png)

## 函数

### 函数体

Rust 中可以在一个用 {} 包括的块里编写一个较为复杂的表达式

```rust
fn main() {
    let x = 5;

    let y = {
        let x = 3;
        x + 1
    };

    println!("x 的值为 : {}", x);
    println!("y 的值为 : {}", y);
}
```

### 函数返回值

Rust 函数声明返回值类型的方式：在参数声明之后用 -> 来声明函数返回值的类型

```rust
fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

但是 Rust 不支持自动返回值类型判断！如果没有明确声明函数返回值的类型，函数将被认为是"纯过程"，不允许产生返回值，return 后面不能有返回值表达式。这样做的目的是为了让公开的函数能够形成可见的公报。

## 条件语句

条件表达式 number < 5 不需要用小括号包括（注意，不需要不是不允许）；但是 Rust 中的 if 不存在单语句不用加 {} 的规则，不允许使用一个语句代替一个块

```rust
fn main() {
    let a = 12;
    let b;
    if a > 0 {
        b = 1;
    }  
    else if a < 0 {
        b = -1;
    }  
    else {
        b = 0;
    }
    println!("b is {}", b);
}   }
}
```

Rust 中的条件表达式必须是 bool 类型，例如下面的程序是错误的：

```rust
fn main() {
    let number = 3;
    if number {   // 报错，expected `bool`, found integerrustc(E0308)
        println!("Yes");
    }
}
```

```rust
//两个函数体表达式的类型必须一样！且必须有一个 else 及其后的表达式块
fn main() {
    let a = 3;
    let number = if a > 0 { 1 } else { -1 };
    println!("number 为 {}", number);
}
```

## 循环

### while

```rust
fn main() {
    let mut number = 1;
    while number != 4 {
        println!("{}", number);
        number += 1;
    }
    println!("EXIT");
}
```

在 C 语言中 for 循环使用三元语句控制循环，但是 Rust 中没有这种用法，需要用 while 循环来代替：

```c
int i;
for (i = 0; i < 10; i++) {
    // 循环体
}
```

```rust
let mut i = 0;
while i < 10 {
    // 循环体
    i += 1;
}
```

### for

for 循环是最常用的循环结构，常用来遍历一个线性数据结构（比如数组）。for 循环遍历数组：

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    for i in a.iter() {
        println!("值为 : {}", i);
    }
}
```

```rust
fn main() {
let a = [10, 20, 30, 40, 50];
    for i in 0..5 {
        println!("a[{}] = {}", i, a[i]);
    }
}
```

### loop

某个循环无法在开头和结尾判断是否继续进行循环，必须在循环体中间某处控制循环的进行。如果遇到这种情况，我们经常会在一个 while (true) 循环体里实现中途退出循环的操作。

Rust 语言有原生的无限循环结构 —— loop：

```rust
fn main() {
    let s = ['R', 'U', 'N', 'O', 'O', 'B'];
    let mut i = 0;
    loop {
        let ch = s[i];
        if ch == 'O' {
            break;
        }
        println!("\'{}\'", ch);
        i += 1;
    }
}
```

loop 循环可以通过 break 关键字类似于 return 一样使整个循环退出并给予外部一个返回值。这是一个十分巧妙的设计，因为 loop 这样的循环常被用来当作查找工具使用，如果找到了某个东西当然要将这个结果交出去：

```rust
fn main() {
    let s = ['R', 'U', 'N', 'O', 'O', 'B'];
    let mut i = 0;
    let location = loop {
        let ch = s[i];
        if ch == 'O' {
            break i;
        }
        i += 1;
    };
    println!(" \'O\' 的索引为 {}", location);
}
```

## 所有权

> 计算机程序必须在运行时管理它们所使用的内存资源。
>
> 大多数的编程语言都有管理内存的功能：
>
> C/C++ 这样的语言主要通过手动方式管理内存，开发者需要手动的申请和释放内存资源。但为了提高开发效率，只要不影响程序功能的实现，许多开发者没有及时释放内存的习惯。所以手动管理内存的方式常常造成资源浪费。
>
> Java 语言编写的程序在虚拟机（JVM）中运行，JVM 具备自动回收内存资源的功能。但这种方式常常会降低运行时效率，所以 JVM 会尽可能少的回收资源，这样也会使程序占用较大的内存资源。
>
> 所有权对大多数开发者而言是一个新颖的概念，它是 Rust 语言为高效使用内存而设计的语法机制。所有权概念是为了让 Rust 在编译阶段更有效地分析内存资源的有用性以实现内存管理而诞生的概念。

### 所有权规则

所有权有以下三条规则：

- Rust 中的每个值都有一个变量，称为其所有者。

- 一次只能有一个所有者。
  
  ```rust
  let a = 1;
  let a = 2;
  println!("a is {}",a);
  //a is 2
  ```

- 当所有者不在程序运行范围时，该值将被删除。
  
  ```rust
  {
      // 在声明以前，变量 s 无效
      let s = "runoob";
      // 这里是变量 s 的可用范围
  }
  // 变量范围已经结束，变量 s 无效
  ```

### 内存与分配

> 如果我们定义了一个变量并给它赋予一个值，这个变量的值存在于内存中。这种情况很普遍。但如果我们需要储存的数据长度不确定（比如用户输入的一串字符串），我们就无法在定义时明确数据长度，也就无法在编译阶段令程序分配固定长度的内存空间供数据储存使用。（有人说分配尽可能大的空间可以解决问题，但这个方法很不文明）。这就需要提供一种在程序运行时程序自己申请使用内存的机制——堆。本章所讲的所有"内存资源"都指的是堆所占用的内存空间。
>
> 有分配就有释放，程序不能一直占用某个内存资源。因此决定资源是否浪费的关键因素就是资源有没有及时的释放。

```c
{
    char *s = strdup("runoob");
    free(s); // 释放 s 资源
}
```

Rust 中没有调用 free 函数来释放字符串 s 的资源（我知道这样在 C 语言中是不正确的写法，因为 "runoob" 不在堆中，这里假设它在）。Rust 之所以没有明示释放的步骤是因为在变量范围结束的时候，Rust 编译器自动添加了调用释放资源函数的步骤。

这种机制看似很简单了：它不过是帮助程序员在适当的地方添加了一个释放资源的函数调用而已。

### 变量与数据交互

#### 移动

变量与数据交互方式主要有移动（Move）和克隆（Clone）两种

这个程序将值 5 绑定到变量 x，然后将 x 的值复制并赋值给变量 y。现在栈中将有两个值 5。此情况中的数据是"基本数据"类型的数据，不需要存储到堆中，仅在栈中的数据的"移动"方式是直接复制，这不会花费更长的时间或更多的存储空间

```rust
let x = 5;
let y = x;
```

第一步产生一个 String 对象，值为 "hello"。其中 "hello" 可以认为是类似于长度不确定的数据，需要在堆中存储。

第二步的情况略有不同（**这不是完全真的，仅用来对比参考**）：

![](https://www.runoob.com/wp-content/uploads/2020/04/rust-ownership1.png)

如图所示：两个 String 对象在栈中，每个 String 对象都有一个指针指向堆中的 "hello" 字符串。在给 s2 赋值时，只有栈中的数据被复制了，堆中的字符串依然还是原来的字符串。

```rust
let s1 = String::from("hello");
let s2 = s1;
```

当变量超出范围时，Rust 自动调用释放资源函数并清理该变量的堆内存。但是 s1 和 s2 都被释放的话堆区中的 "hello" 被释放两次，这是不被系统允许的。为了确保安全，在给 s2 赋值时 s1 已经无效了。没错，在把 s1 的值赋给 s2 以后 s1 将不可以再被使用。下面这段程序是错的：

```rust
let s1 = String::from("hello");
let s2 = s1; 
println!("{}, world!", s1); // 错误！s1 已经失效
```

所以实际情况是：

![](https://www.runoob.com/wp-content/uploads/2020/04/rust-ownership2.png)

#### 克隆

Rust会尽可能地降低程序的运行成本，所以默认情况下，长度较大的数据存放在堆中，且采用移动的方式进行数据交互。但如果需要将数据单纯的复制一份以供他用，可以使用数据的第二种交互方式——克隆。

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1 = {}, s2 = {}", s1, s2);
}
//s1 = hello, s2 = hello
```

### 函数的所有权

```rust
fn main() {
    let s = String::from("hello");
    // s 被声明有效

    takes_ownership(s);
    // s 的值被当作参数传入函数，相当于又开辟了一个内存空间
    // 所以可以当作 s 已经被移动，从这里开始已经无效

    let x = 5;
    // x 被声明有效

    makes_copy(x);
    // x 的值被当作参数传入函数
    // 但 x 是基本类型，依然有效
    // 在这里依然可以使用 x 却不能使用 s

} // 函数结束, x 无效, 然后是 s. 但 s 已被移动, 所以不用被释放


fn takes_ownership(some_string: String) {
    // 一个 String 参数 some_string 传入，有效
    println!("{}", some_string);
} // 函数结束, 参数 some_string 在这里释放

fn makes_copy(some_integer: i32) {
    // 一个 i32 参数 some_integer 传入，有效
    println!("{}", some_integer);
} // 函数结束, 参数 some_integer 是基本类型, 无需释放
```

### 函数返回值的所有权

被当作函数返回值的变量所有权将会被移动出函数并返回到调用函数的地方，而不会直接被无效释放。

```rust
fn main() {
    let s1 = gives_ownership();
    // gives_ownership 移动它的返回值到 s1

    let s2 = String::from("hello");
    // s2 被声明有效

    let s3 = takes_and_gives_back(s2);
    // s2 被当作参数移动, s3 获得返回值所有权
} // s3 无效被释放, s2 被移动, s1 无效被释放.

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    // some_string 被声明有效

    return some_string;
    // some_string 被当作返回值移动出函数
}

fn takes_and_gives_back(a_string: String) -> String { 
    // a_string 被声明有效

    a_string  // a_string 被当作返回值移出函数
}
```

### 引用

实质上"引用"是变量的间接访问方式。

& 运算符可以取变量的"引用"。

当一个变量的值被引用时，变量本身不会被认定无效。因为"引用"并没有在栈中复制变量的值：

![](https://www.runoob.com/wp-content/uploads/2020/04/F25111E7-C5D3-464A-805D-D2186A30C8A0.jpg)

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = &s1;
    println!("s1 is {}, s2 is {}", s1, s2);
}
//s1 is hello, s2 is hello
```

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
//The length of 'hello' is 5.
```

引用不会获得值的所有权。

引用只能租借（Borrow）值的所有权。

引用本身也是一个类型并具有一个值，这个值记录的是别的值所在的位置，但引用不具有所指值的所有权

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = &s1;
    //❌
    let s3 = s1;// s2 租借的 s1 已经将所有权移动到 s3，所以 s2 将无法继续租借使用 s1 的所有权
    println!("{}", s2);
}


fn main() {
    let s1 = String::from("hello");
    let mut s2 = &s1;
    let s3 = s1;
    s2 = &s3; // 重新从 s3 租借所有权
    println!("{}", s2);
}
```

#### 不可变引用

既然引用不具有所有权，即使它租借了所有权，它也只享有使用权（这跟租房子是一个道理）。

如果尝试利用租借来的权利来修改数据会被阻止：

```rust
fn main() {
    let s1 = String::from("run");
    let s2 = &s1;
    println!("{}", s2);
    s2.push_str("oob"); // 错误，禁止修改租借的值
    println!("{}", s2);
}
```

#### 可变引用

当然，也存在一种可变的租借方式，就像你租一个房子，如果物业规定房主可以修改房子结构，房主在租借时也在合同中声明赋予你这种权利，你是可以重新装修房子的：

```rust
fn main() {
    let mut s1 = String::from("run");
    // s1 是可变的

    let s2 = &mut s1;
    // s2 是可变的引用

    s2.push_str("oob");
    println!("{}", s2);
}
```

#### 多重引用

> Rust 对可变引用的这种设计主要出于对并发状态下发生数据访问碰撞的考虑，在编译阶段就避免了这种事情的发生。
>
> 由于发生数据访问碰撞的必要条件之一是数据被至少一个使用者写且同时被至少一个其他使用者读或写，所以在一个值被可变引用时不允许再次被任何引用。

可变引用不允许多重引用，但不可变引用可以：

```rust
let mut s = String::from("hello");
//❌
let r1 = &mut s;
let r2 = &mut s;

println!("{}, {}", r1, r2);
```

#### 垂悬引用

> 这是一个换了个名字的概念，如果放在有指针概念的编程语言里它就指的是那种没有实际指向一个真正能访问的数据的指针（注意，不一定是空指针，还有可能是已经释放的资源）。它们就像失去悬挂物体的绳子，所以叫"垂悬引用"。
>
> "垂悬引用"在 Rust 语言里不允许出现，如果有，编译器会发现它。

伴随着 dangle 函数的结束，其局部变量的值本身没有被当作返回值，被释放了。但它的引用却被返回，这个引用所指向的值已经不能确定的存在，故不允许其出现。

```rust
fn main() {
    //❌
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");
    &s
}
```

## Slice切片

切片（Slice）是对数据值的部分引用。

**x..y** 表示 **[x, y)** 的数学含义。.. 两边可以没有运算数：

..y 等价于 0..y
x.. 等价于位置 x 到数据结束
.. 等价于位置 0 到结束

### 字符串切片

```rust
fn main() {
    let s = String::from("broadcast");

    let part1 = &s[0..5];
    let part2 = &s[5..9];

    println!("{}={}+{}", s, part1, part2);
}
//broadcast=broad+cast
```

被切片引用的字符串禁止更改其值

```rust
fn main() {
    let mut s:String = String::from("runoob");
    let slice = &s[0..3];
    s.push_str("yes!"); // 错误
    println!("slice = {}", slice);
}
```

#### 字符串类型

在 Rust 中有两种常用的字符串类型：str 和 String。

①str 是 Rust 核心语言类型，就是本章一直在讲的字符串切片（String Slice），常常以引用的形式出现（&str）。凡是用双引号包括的字符串常量整体的类型性质都是 **&str**

②String 类型是 Rust 标准公共库提供的一种数据类型，它的功能更完善——它支持字符串的追加、清空等实用的操作。String 和 str 除了同样拥有一个字符开始位置属性和一个字符串长度属性以外还有一个容量（capacity）属性。

String 和 str 都支持切片，切片的结果是 &str 类型的数据。

切片结果必须是引用类型，但开发者必须自己明示这一点

```rust
let s = "hello";
let slice = &s[0..3];
//将 String 转换成 &str：
let s1 = String::from("hello");
let s2 = &s1[..];
```

### 非字符串切片

```rust
fn main() {
    let arr = [1, 3, 5, 7, 9];
    let part = &arr[0..3];
    for i in part.iter() {
        println!("{}", i);
    }
}
```

## 结构体

> Rust 中的结构体（Struct）与元组（Tuple）都可以将若干个类型不一定相同的数据捆绑在一起形成整体，但结构体的每个成员和其本身都有一个名字，这样访问它成员的时候就不用记住下标了。元组常用于非定义的多值传递，而结构体用于规范常用的数据结构。结构体的每个成员叫做"字段"。

### 结构体实例

```rust
struct Site {
    domain: String,
    name: String,
    nation: String,
    found: u32
}
let runoob = Site {
    domain: String::from("www.runoob.com"),
    name: String::from("RUNOOB"),
    nation: String::from("China"),
    found: 2013
};
//正在实例化的结构体有字段名称和现存变量名称一样的，可以简化书写
let domain = String::from("www.runoob.com");
let name = String::from("RUNOOB");
let runoob = Site {
    domain,  // 等同于 domain : domain,
    name,    // 等同于 name : name,
    nation: String::from("China"),
    traffic: 2013
};
//新建一个结构体的实例，其中大部分属性需要被设置成与现存的一个结构体属性一样，仅需更改其中的一两个字段的值
//❗这种语法不允许一成不变的复制另一个结构体实例，意思就是说至少重新设定一个字段的值才能引用其他实例的值。
let site = Site {
    domain: String::from("www.runoob.com"),
    name: String::from("RUNOOB"),
    ..runoob
};
```

### 元组结构体

> 元组结构体是一种形式是元组的结构体。
>
> 与元组的区别是它有名字和固定的类型格式。它存在的意义是为了处理那些需要定义类型（经常使用）又不想太复杂的简单数据：

```rust
struct Color(u8, u8, u8);
struct Point(f64, f64);

let black = Color(0, 0, 0);
let origin = Point(0.0, 0.0);


println!("black = ({}, {}, {})", black.0, black.1, black.2);
println!("origin = ({}, {})", origin.0, origin.1);
```

### 单元结构体

结构体可以只作为一种象征而无需任何成员：

```rust
struct UnitStruct;
```

我们称这种没有身体的结构体为单元结构体（Unit Struct）。

### 结构体的所有权

> 结构体必须掌握字段值所有权，因为结构体失效的时候会释放所有字段。
>
> 这就是为什么案例中使用了 String 类型而不使用 &str 的原因。
>
> 但这不意味着结构体中不定义引用型字段，这需要通过"生命周期"机制来实现。

#### 输出结构体

调试中，完整地显示出一个结构体实例是非常有用的。但如果我们手动的书写一个格式会非常的不方便。所以 Rust 提供了一个方便地输出一整个结构体的方法

```rust
#[derive(Debug)]

struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    println!("rect1 is {:?}", rect1);
    //rect1 is Rectangle{width:30,height:50}
    //如果属性较多的话可以使用另一个占位符 {:#?}
    /*rect1 is Rectangle{
        width:30,
        height:50
    }*/
}
```

### 结构体方法

> 方法（Method）和函数（Function）类似，只不过它是用来操作结构体实例的。
>
> 如果你学习过一些面向对象的语言，那你一定很清楚函数一般放在类定义里并在函数中用 this 表示所操作的实例。
>
> Rust 语言不是面向对象的，从它所有权机制的创新可以看出这一点。但是面向对象的珍贵思想可以在 Rust 实现。
>
> 结构体方法的第一个参数必须是 &self，不需声明类型，因为 self 不是一种风格而是关键字。
>
> 结构体 impl 块可以写几次，效果相当于它们内容的拼接！

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    fn wider(&self, rect: &Rectangle) -> bool {
        self.width > rect.width
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 40, height: 20 };

    println!("rect1's area is {}", rect1.area());
    //rect1's area is 1500
    println!("{}", rect1.wider(&rect2));
    //false
}
```

### 结构体关联函数

> 之所以"结构体方法"不叫"结构体函数"是因为"函数"这个名字留给了这种函数：它在 impl 块中却没有 &self 参数。
>
> 这种函数不依赖实例，但是使用它需要声明是在哪个 impl 块中的。
>
> 一直使用的 String::from 函数就是一个"关联函数"。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn create(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }
}

fn main() {
    let rect = Rectangle::create(30, 50);
    println!("{:?}", rect);
    //Rectangle { width: 30, height: 50 }
}
```

## 枚举类

```rust
#[derive(Debug)]

enum Book {
    Papery, Electronic
}

fn main() {
    let book = Book::Papery;
    println!("{:?}", book);
    //Papery
}
```

### 添加属性描述

```rust
enum Book {
    Papery(u32),
    Electronic(String),
}

let book = Book::Papery(1001);
let ebook = Book::Electronic(String::from("url://..."));
```

为属性命名，可以用结构体语法

```rust
enum Book {
    Papery { index: u32 },
    Electronic { url: String },
}
let book = Book::Papery{index: 1001};
```

### match语法

> 枚举的目的是对某一类事物的分类，分类的目的是为了对不同的情况进行描述。基于这个原理，往往枚举类最终都会被分支结构处理（许多语言中的 switch ）。 switch 语法很经典，但在 Rust 中并不支持，很多语言摒弃 switch 的原因都是因为 switch 容易存在因忘记添加 break 而产生的串接运行问题，Java 和 C# 这类语言通过安全检查杜绝这种情况出现。
>
> Rust 通过 match 语句来实现分支结构（枚举类型无法通过if判断[==]）。

```rust
/*
    match 枚举类实例 {
    分类1 => 返回值表达式,
    分类2 => 返回值表达式,
    ...
}
//所有返回值表达式的类型必须一样！
*/
enum Book {
    Papery(u32),
    Electronic {url: String},
}
let book = Book::Papery(1001);

match book {
    Book::Papery(i) => {
        println!("{}", i);
    },
    Book::Electronic { url } => {
        println!("{}", url);
    }
}
//Papery book 1001
```

match 除了能够对枚举类进行分支选择以外，还可以对整数、浮点数、字符和字符串切片引用（&str）类型的数据进行分支选择。其中，浮点数类型被分支选择虽然合法，但不推荐这样使用，因为精度问题可能会导致分支错误。

对非枚举类进行分支选择时必须注意处理例外情况，即使在例外情况下没有任何要做的事，例外情况用下划线 _ 表示：

```rust
fn main() {
    let t = "abc";
    match t {
        "abc" => println!("Yes"),
        _ => {},
    }
}
```

### Option枚举类

> Option 是 Rust 标准库中的枚举类，这个类用于填补 Rust 不支持 null 引用的空白。
>
> 许多语言支持 null 的存在（C/C++、Java），这样很方便，但也制造了极大的问题，null 的发明者也承认这一点，"一个方便的想法造成累计 10 亿美元的损失"。
>
> null 经常在开发者把一切都当作不是 null 的时候给予程序致命一击：毕竟只要出现一个这样的错误，程序的运行就要彻底终止。
>
> 为了解决这个问题，很多语言默认不允许 null，但在语言层面支持 null 的出现（常在类型前面用 ? 符号修饰）。
>
> Java 默认支持 null，但可以通过 @NotNull 注解限制出现 null，这是一种应付的办法。
>
> Rust 在语言层面彻底不允许空值 null 的存在，但无奈null 可以高效地解决少量的问题，所以 Rust 引入了 Option 枚举类：
>
> 由于 Option 是 Rust 编译器默认引入的，在使用时可以省略 Option:: 直接写 None 或者 Some()。

```rust
enum Option<T> {
    Some(T),
    None,
}
```

如果你想针对 opt 执行某些操作，你必须判断它是否是 **Option::None**

```rust
fn main() {
    let opt = Option::Some("Hello");
    match opt {
        Option::Some(something) => {
            println!("{}", something);
        },
        Option::None => {
            println!("opt is nothing");
        }
    }
}
```

#### 初始值为空

如果你的变量刚开始是空值，你体谅一下编译器，它怎么知道值不为空的时候变量是什么类型的呢？

所以初始值为空的 Option 必须明确类型：

```rust
fn main() {
    let opt: Option<&str> = Option::None;
    match opt {
        Option::Some(something) => {
            println!("{}", something);
        },
        Option::None => {
            println!("opt is nothing");
        }
    }
}
```

#### 包含值的分支选择

```rust
fn main() {
        let t = Some(64);
        match t {
                Some(64) => println!("Yes"),
                _ => println!("No"),
        }
}
```

### if let语法

> 可以在之后添加一个 else 块来处理例外情况。
>
> if let 语法可以认为是只区分两种情况的 match 语句的"语法糖"

```rust
if let 匹配值 = 源变量 {
    语句块
}
```

```rust
let i = 0;
match i {
    0 => println!("zero"),
    _ => {},
}
```

使用if let简化后

```rust
let i = 0;
if let 0 = i {
    println!("zero");
}
```

## 组织管理

> 任何一门编程语言如果不能组织代码都是难以深入的，几乎没有一个软件产品是由一个源文件编译而成的。
>
> 对于一个工程来讲，组织代码是十分重要的。
>
> Rust 中有三个重要的组织概念：箱、包、模块。

### 箱（crates）

> "箱"是二进制程序文件或者库文件，存在于"包"中。
>
> "箱"是树状结构的，它的树根是编译器开始运行时编译的源文件所编译的程序。

### 包（package）

> 当我们使用 Cargo 执行 new 命令创建 Rust 工程时，工程目录下会建立一个 Cargo.toml 文件。工程的实质就是一个包，包必须由一个 Cargo.toml 文件来管理，该文件描述了包的基本信息以及依赖项。
>
> 一个包最多包含一个库"箱"，可以包含任意数量的二进制"箱"，但是至少包含一个"箱"（不管是库还是二进制"箱"）。
>
> 当使用 cargo new 命令创建完包之后，src 目录下会生成一个 main.rs 源文件，Cargo 默认这个文件为二进制箱的根，编译之后的二进制箱将与包名相同。

### 模块（module）

> 对于一个软件工程来说，我们往往按照所使用的编程语言的组织规范来进行组织，组织模块的主要结构往往是树。Java 组织功能模块的主要单位是类，而 JavaScript 组织模块的主要方式是 function。
>
> 这些先进的语言的组织单位可以层层包含，就像文件系统的目录结构一样。Rust 中的组织单位是模块（Module）。

```rust
mod nation {
    mod government {
        fn govern() {}
    }
    mod congress {
        fn legislate() {}
    }
    mod court {
        fn judicial() {}
    }
}
```

```textile
nation
 ├── government
 │ └── govern
 ├── congress
 │ └── legislate
 └── court
   └── judicial
```

在文件系统中，目录结构往往以斜杠在路径字符串中表示对象的位置，Rust 中的路径分隔符是 :: 。

路径分为绝对路径和相对路径。绝对路径从 crate 关键字开始描述。相对路径从 self 或 super 关键字或一个标识符开始描述。

```rust
crate::nation::government::govern();
nation::government::govern();
```

#### 访问权限

> Rust 中有两种简单的访问权：公共（public）和私有（private）。
>
> 默认情况下，如果不加修饰符，模块中的成员访问权将是私有的。
>
> 如果想使用公共权限，需要使用 pub 关键字。
>
> 对于私有的模块，只有在与其平级的位置或下级的位置才能访问，不能从其外部访问。

```rust
mod nation {
    pub mod government {
        pub fn govern() {}
    }

    mod congress {
        pub fn legislate() {}
    }

    mod court {
        fn judicial() {
            super::congress::legislate();
        }
    }
}

fn main() {
    nation::government::govern();
}
```

#### 模块中的结构体

如果模块中定义了结构体，结构体除了其本身是私有的以外，其字段也默认是私有的。所以如果想使用模块中的结构体以及其字段，需要 pub 声明

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}
pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);
}
fn main() {
    eat_at_restaurant()
}
```

#### 模块中的枚举

枚举类枚举项可以内含字段，但不具备类似的性质

```rust
mod SomeModule {
    pub enum Person {
        King {
            name: String
        },
        Quene
    }
}

fn main() {
    let person = SomeModule::Person::King{
        name: String::from("Blue")
    };
    match person {
        SomeModule::Person::King {name} => {
            println!("{}", name);
        }
        _ => {}
    }
}
```

#### 模块化

```rust
// second_module.rs
pub fn message() -> String {
    String::from("This is the 2nd module.")
}
```

```rust
// main.rs
mod second_module;

fn main() {
    println!("This is the main module.");
    println!("{}", second_module::message());
}
```

#### use关键字

use 关键字能够将模块标识符引入当前作用域

```rust
mod nation {
    pub mod government {
        pub fn govern() {}
    }
}

use crate::nation::government::govern;

fn main() {
    govern();
}
```

有些情况下存在两个相同的名称，且同样需要导入，我们可以使用 as 关键字为标识符添加别名

```rust
mod nation {
    pub mod government {
        pub fn govern() {}
    }
    pub fn govern() {}
}

use crate::nation::government::govern;
use crate::nation::govern as nation_govern;

fn main() {
    nation_govern();
    govern();
}
```

use 关键字可以与 pub 关键字配合使用

```rust
mod nation {
    pub mod government {
        pub fn govern() {}
    }
    pub use government::govern;
}

fn main() {
    nation::govern();
}
```

## 错误处理

> Rust 有一套独特的处理异常情况的机制，它并不像其它语言中的 try 机制那样简单。
>
> 首先，程序中一般会出现两种错误：可恢复错误和不可恢复错误。
>
> 可恢复错误的典型案例是文件访问错误，如果访问一个文件失败，有可能是因为它正在被占用，是正常的，我们可以通过等待来解决。
>
> 但还有一种错误是由编程中无法解决的逻辑错误导致的，例如访问数组末尾以外的位置。
>
> 大多数编程语言不区分这两种错误，并用 Exception （异常）类来表示错误。在 Rust 中没有 Exception。
>
> 对于可恢复错误用 Result<T, E> 类来处理，对于不可恢复错误使用 panic! 宏来处理。

### 不可恢复错误

#### panic!宏

程序并不能如约运行到 println!("Hello, Rust") ，而是在 panic! 宏被调用时停止了运行。

不可恢复的错误一定会导致程序受到致命的打击而终止运行。

```rust
fn main() {
    panic!("error occured");
    println!("Hello, Rust");
}
//thread 'main' panicked at 'error occured', src\main.rs:3:5
//note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace.
```

#### 回溯

回溯是不可恢复错误的另一种处理方式，它会展开运行的栈并输出所有的信息，然后程序依然会退出。上面的省略号省略了大量的输出信息，我们可以找到我们编写的 panic! 宏触发的错误。

```shell
$env:RUST_BACKTRACE=1 ; cargo run
```

### 可恢复的错误

> 此概念十分类似于 Java 编程语言中的异常。实际上在 C 语言中我们就常常将函数返回值设置成整数来表达函数遇到的错误，在 Rust 中通过 Result<T, E> 枚举类作返回值来进行异常表达

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### Result类型

在 Rust 标准库中可能产生异常的函数的返回值都是 Result 类型的。例如：当我们尝试打开一个文件时

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
    match f {
        Ok(file) => {
            println!("File opened successfully.");
        },
        Err(err) => {
            println!("Failed to open the file.");
        }
    }
}
```

#### 以不可恢复处理

如果想使一个可恢复错误按不可恢复错误处理，Result 类提供了两个办法：unwrap() 和 expect(message: &str)

```rust
use std::fs::File;

fn main() {
    let f1 = File::open("hello.txt").unwrap();
    let f2 = File::open("hello.txt").expect("Failed to open.");
}
```

### 错误传递

之前所讲的是接收到错误的处理方式，但是如果我们自己编写一个函数在遇到错误时想传递出去怎么办呢？

```rust
fn f(i: i32) -> Result<i32, bool> {
    if i >= 0 { Ok(i) }
    else { Err(false) }
}

fn main() {
    let r = f(10000);
    if let Ok(v) = r {
        println!("Ok: f(-1) = {}", v);
    } else {
        println!("Err");
    }
}
```

这段程序中函数 f 是错误的根源，现在我们再写一个传递错误的函数 g

```rust
fn g(i: i32) -> Result<i32, bool> {
    let t = f(i);
    return match t {
        Ok(i) => Ok(i),
        Err(b) => Err(b)
    };
}
```

函数 g 传递了函数 f 可能出现的错误（这里的 g 只是一个简单的例子，实际上传递错误的函数一般还包含很多其它操作）。

这样写有些冗长，Rust 中可以在 Result 对象后添加 ? 操作符将（同类的 Err（对应包裹的值）判断为true） 直接传递出去

? 符的实际作用是将 Result 类非异常的值直接取出，如果有异常就将异常 Result 返回出去。

所以，? 符仅用于返回值类型为 Result<T, E> 的函数，其中 E 类型必须和 ? 所处理的 Result 的 E 类型一致

```rust
fn f(i: i32) -> Result<i32, bool> {
    if i >= 0 { Ok(i) }
    else { Err(false) }
}

fn g(i: i32) -> Result<i32, bool> {
    let t = f(i)?;
    Ok(t) // 因为确定 t 不是 Err, t 在这里已经是 i32 类型，判断为true返回，否则返回Err(false)
}

fn main() {
    let r = g(10000);
    if let Ok(v) = r {
        println!("Ok: g(10000) = {}", v);
    } else {
        println!("Err");
    }
}
```

### kind方法

到此为止，Rust 似乎没有像 try 块一样可以令任何位置发生的同类异常都直接得到相同的解决的语法，但这样并不意味着 Rust 实现不了：我们完全可以把 try 块在独立的函数中实现，将所有的异常都传递出去解决。实际上这才是一个分化良好的程序应当遵循的编程方法：应该注重独立功能的完整性。

但是这样需要判断 Result 的 Err 类型，获取 Err 类型的函数是 kind()。

```rust
use std::io;
use std::io::Read;
use std::fs::File;

fn read_text_from_file(path: &str) -> Result<String, io::Error> {
    let mut f = File::open(path)?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}

fn main() {
    let str_file = read_text_from_file("hello.txt");
    match str_file {
        Ok(s) => println!("{}", s),
        Err(e) => {
            match e.kind() {
                io::ErrorKind::NotFound => {
                    println!("No such file");
                },
                _ => {
                    println!("Cannot read the file");
                }
            }
        }
    }
}
```

## 泛型和特性(trait)

> 泛型是一个编程语言不可或缺的机制。
>
> C++ 语言中用"模板"来实现泛型，而 C 语言中没有泛型的机制，这也导致 C 语言难以构建类型复杂的工程。
>
> 泛型机制是编程语言用于表达类型抽象的机制，一般用于功能确定、数据类型待定的类，如链表、映射表等。

### 函数中的泛型

```rust
fn max<T>(array: &[T]) -> T {
    let mut max_index = 0;
    let mut i = 1;
    while i < array.len() {
        if array[i] > array[max_index] {
            max_index = i;
        }
        i += 1;
    }
    array[max_index]
}
```

### 结构体和枚举类中的泛型

```rust
struct Point<T> {
    x: T,
    y: T
}
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("p.x = {}", p.x());
}
let p1 = Point {x: 1, y: 2};
let p2 = Point {x: 1.0, y: 2.0};


enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

```rust
struct Point<T,U>{
    x:T,
    y:U
}
impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}
```

### 特性

> 特性（trait）概念接近于 Java 中的接口（Interface），但两者不完全相同。特性与接口相同的地方在于它们都是一种行为规范，可以用于标识哪些类有哪些方法
>
> Rust 同一个类可以实现多个特性，每个 impl 块只能实现一个。

```rust
impl <特性名> for <所实现的类型名>
```

```rust
trait Descriptive {
    fn describe(&self) -> String;
}
struct Person {
    name: String,
    age: u8
}

impl Descriptive for Person {
    fn describe(&self) -> String {
        format!("{} {}", self.name, self.age)
    }
}
```

#### 默认特性

> 这是特性与接口的不同点：接口只能规范方法而不能定义方法，但特性可以定义方法作为默认方法，因为是"默认"，所以对象既可以重新定义方法，也可以不重新定义方法使用默认的方法

```rust
trait Descriptive {
    fn describe(&self) -> String {
        String::from("[Object]")
    }
}

struct Person {
    name: String,
    age: u8
}

impl Descriptive for Person {
    fn describe(&self) -> String {
        format!("{} {}", self.name, self.age)
    }
}

fn main() {
    let cali = Person {
        name: String::from("Cali"),
        age: 24
    };
    println!("{}", cali.describe());
    //Cali 24
}
```

#### 作为参数的特性

> 很多情况下我们需要传递一个函数做参数，例如回调函数、设置按钮事件等。在 Java 中函数必须以接口实现的类实例来传递，在 Rust 中可以通过传递特性参数来实现

任何实现了 Descriptive 特性的对象都可以作为这个函数的参数，这个函数没必要了解传入对象有没有其他属性或方法，只需要了解它一定有 Descriptive 特性规范的方法就可以了。当然，此函数内也无法使用其他的属性与方法。

```rust
fn output(object: impl Descriptive) {
    println!("{}", object.describe());
}
fn output<T: Descriptive>(object: T) {
    println!("{}", object.describe());
}
```

特性作类型表示时如果涉及多个特性，可以用 + 符号表示

```rust
fn notify(item: impl Summary + Display)
fn notify<T: Summary + Display>(item: T)
```

复杂的实现关系可以使用 where 关键字简化

```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: T, u: U)

fn some_function<T, U>(t: T, u: U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
```

#### 作为返回值的特性

但是有一点，特性做返回值只接受实现了该特性的对象做返回值且在同一个函数中所有可能的返回值类型必须完全一样。比如结构体 A 与结构体 B 都实现了特性 Trait，

```rust
fn person() -> impl Descriptive {
    Person {
        name: String::from("Cali"),
        age: 24
    }
}
```

#### 基于条件的实现

impl 功能十分强大，我们可以用它实现类的方法。但对于泛型类来说，有时我们需要区分一下它所属的泛型已经实现的方法来决定它接下来该实现的方法

```rust
// A<T> 类型必须在 T 已经实现 B 和 C 特性的前提下才能有效实现此 impl 块
struct A<T> {}

impl<T: B + C> A<T> {
    fn d(&self) {}
}
```

## 生命周期

> Rust 生命周期机制是与所有权机制同等重要的资源管理机制。
>
> 之所以引入这个概念主要是应对复杂类型系统中资源管理的问题。
>
> 引用是对待复杂类型时必不可少的机制，毕竟复杂类型的数据不能被处理器轻易地复制和计算。
>
> 但引用往往导致极其复杂的资源管理问题

```rust
{
    let r;

    {
        let x = 5;
        r = &x;
    }

    println!("r: {}", r);
}
```

![](https://www.runoob.com/wp-content/uploads/2020/04/rust-lifetime1.png)

上图中的绿色范围 'a 表示 r 的生命周期，蓝色范围 'b 表示 x 的生命周期。很显然，'b 比 'a 小得多，引用必须在值的生命周期以内才有效。

> 一直以来我们都在结构体中使用 String 而不用 &str，原因是返回值引用可能会返回过期的引用

这段程序中虽然经过了比较，但 r 被使用的时候源值 s1 和 s2 都已经失效了。当然我们可以把 r 的使用移到 s1 和 s2 的生命周期范围以内防止这种错误的发生，但对于函数来说，它并不能知道自己以外的地方是什么情况，它为了保障自己传递出去的值是正常的，必选所有权原则消除一切危险。。

```rust
fn longer(s1: &str, s2: &str) -> &str {
    if s2.len() > s1.len() {
        s2
    } else {
        s1
  }
}
fn main() {
    let r;
    {
        let s1 = "rust";
        let s2 = "ecmascript";
        r = longer(s1, s2);
    }
    println!("{} is longer", r);
}
```

### 注释

> 生命周期注释是描述引用生命周期的办法。
>
> 虽然这样并不能够改变引用的生命周期，但可以在合适的地方声明两个引用的生命周期一致。
>
> 生命周期注释用单引号开头，跟着一个小写字母单词：

```rust
&i32        // 常规引用
&'a i32     // 含有生命周期注释的引用
&'a mut i32 // 可变型含有生命周期注释的引用


fn longer<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s2.len() > s1.len() {
        s2
    } else {
        s1
    }
}
```

### 结构体中的字符串切片

```rust
fn main() {
    struct Str<'a> {
        content: &'a str
    }
    impl<'a> Str<'a> {
        fn get_content(&self) -> &str {
            self.content
        }
    }
    let s = Str {
        content: "string_slice"
    };
    println!("s.content = {}", s.content);
    //s.content = string_slice
}
```

### 静态生命周期

生命周期注释有一个特别的：'static 。所有用双引号包括的字符串常量所代表的精确数据类型都是 &'static str ，'static 所表示的生命周期从程序运行开始到程序运行结束。

## 文件IO

> std::fs 模块中的 File 类是描述文件的类，可以用于打开文件，再打开文件之后，我们可以使用 File 的 read 方法按流读取文件的下面一些字节到缓冲区（缓冲区是一个 u8 数组），读取的字节数等于缓冲区的长度。

### 获取环境参数

```rust
fn main() {
    let args = std::env::args();
    println!("{:?}", args);
}
//Args { inner: ["D:\\rust\\greeting\\target\\debug\\greeting.exe"] }
```

### 获取命令行输入

```rust
use std::io::stdin;

fn main() {
let mut str_buf = String::new();

    stdin().read_line(&mut str_buf)
        .expect("Failed to read line.");

    println!("Your input line is \n{}", str_buf);
}
```

### 文件读取

```rust
use std::fs;

fn main() {
    let text = fs::read_to_string("D:\\text.txt").unwrap();
    println!("{}", text);
} 
```

但如果要读取的文件是二进制文件，我们可以用 read 函数读取 u8 类型集合

```rust
use std::fs;

fn main() {
    let content = fs::read("D:\\text.txt").unwrap();
    println!("{:?}", content);
}
```

对于一些底层程序来说，传统的按流读取的方式依然是无法被取代的，因为更多情况下文件的大小可能远超内存容量。

Rust 中的文件流读取方式

```rust
use std::io::prelude::*;
use std::fs;

fn main() {
    let mut buffer = [0u8; 5];
    let mut file = fs::File::open("D:\\text.txt").unwrap();
    file.read(&mut buffer).unwrap();
    println!("{:?}", buffer);
    file.read(&mut buffer).unwrap();
    println!("{:?}", buffer);
}
//[84, 104, 105, 115, 32] 
//[105, 115, 32, 97, 32]
```

### 文件写入

文件写入分为一次性写入和流式写入。流式写入需要打开文件，打开方式有"新建"（create）和"追加"（append）两种

#### 一次性写入

执行程序之后， D:\text.txt 文件的内容将会被重写为 FROM RUST PROGRAM 。所以，一次性写入请谨慎使用！因为它会直接删除文件内容（无论文件多么大）。如果文件不存在就会创建文件

```rust
use std::fs;

fn main() {
    fs::write("D:\\text.txt", "FROM RUST PROGRAM")
        .unwrap();
}
```

#### 流式写入

使用流的方式写入文件内容，可以使用 std::fs::File 的 create 方法

打开的文件一定存放在可变的变量中才能使用 File 的方法

```rust
use std::io::prelude::*;
use std::fs::File;

fn main() {
    let mut file = File::create("D:\\text.txt").unwrap();
    file.write("FROM RUST PROGRAM").unwrap();
}
```

#### OpenOptions类

File 类中不存在 append 静态方法（附加内容），但是我们可以使用 OpenOptions 来实现用特定方法打开文件

```rust
use std::io::prelude::*;
use std::fs::OpenOptions;

fn main() -> std::io::Result<()> {

    let mut file = OpenOptions::new()
            .append(true).open("D:\\text.txt")?;

    file.write(" APPEND WORD")?;

    Ok(())
}
```

OpenOptions 是一个灵活的打开文件的方法，它可以设置打开权限，除append 权限以外还有 read 权限和 write 权限，如果我们想以读写权限打开一个文件

```rust
use std::io::prelude::*;
use std::fs::OpenOptions;

fn main() -> std::io::Result<()> {

    let mut file = OpenOptions::new()
            .read(true).write(true).open("D:\\text.txt")?;

    file.write("COVER")?;

    Ok(())
}
```

## 集合与字符串

> 集合（Collection）是数据结构中最普遍的数据存放形式，Rust 标准库中提供了丰富的集合类型帮助开发者处理数据结构的操作

### 向量

向量（Vector）是一个存放多值的单数据结构，该结构将相同类型的值线性的存放在内存中。

向量是线性表，在 Rust 中的表示是 Vec<T>。

向量的使用方式类似于列表（List），我们可以通过这种方式创建指定类型的向量

```rust
let vector: Vec<i32> = Vec::new(); // 创建类型为 i32 的空向量
let vector = vec![1, 2, 4, 8];     // 通过数组创建向量
```

#### push方法

我们使用线性表常常会用到追加的操作，但是追加和栈的 push 操作本质是一样的，所以向量只有 push 方法来追加单个元素

```rust
fn main() {
    let mut vector = vec![1, 2, 4, 8];
    vector.push(16);
    vector.push(32);
    vector.push(64);
    println!("{:?}", vector);
    //[1, 2, 4, 8, 16, 32, 64]
}
```

#### append方法

append 方法用于将一个向量拼接到另一个向量的尾部

```rust
fn main() {
    let mut v1: Vec<i32> = vec![1, 2, 4, 8];
    let mut v2: Vec<i32> = vec![16, 32, 64];
    v1.append(&mut v2);
    println!("{:?}", v1);
    //[1, 2, 4, 8, 16, 32, 64]    
}
```

#### get方法

get 方法用于取出向量中的值

```rust
fn main() {
    let mut v = vec![1, 2, 4, 8];
    println!("{}", match v.get(0) {
        Some(value) => value.to_string(),
        None => "None".to_string()
    });
}
```

因为向量的长度无法从逻辑上推断，get 方法无法保证一定取到值，所以 get 方法的返回值是 Option 枚举类，有可能为空。

这是一种安全的取值方法，但是书写起来有些麻烦。如果你能够保证取值的下标不会超出向量下标取值范围，你也可以使用数组取值语法

```rust
fn main() {
    let v = vec![1, 2, 4, 8];
    println!("{}", v[1]);
}
```

#### 遍历

```rust
fn main() {
    let v = vec![100, 32, 57];
    for i in &v {
            println!("{}", i);
    }
}
```

```rust
//如果遍历过程中需要更改变量的值
fn main() {
    let mut v = vec![100, 32, 57];
    for i in &mut v {
        *i += 50;
    }
}
```

### 字符串

#### 类型转换

```rust
let one = 1.to_string();         // 整数到字符串
let float = 1.3.to_string();     // 浮点数到字符串
let slice = "slice".to_string(); // 字符串切片到字符串
```

#### 追加字符串

```rust
let mut s = String::from("run");
s.push_str("oob"); // 追加字符串切片
s.push('!');       // 追加字符
```

#### 拼接字符串

```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = s1 + "-" + &s2 + "-" + &s3;
```

使用 format! 宏

```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = format!("{}-{}-{}", s1, s2, s3);
```

#### 字符串长度

```rust
let s = "hello";
let len = s.len();//5


let s = "你好";
let len = s.len();//6 中文是 UTF-8 编码的，每个字符长 3 字节，所以长度为6


let s = "hello你好";
let len = s.chars().count();//7 一共有 7 个字符。统计字符的速度比统计数据长度的速度慢得多
```

#### 获取单个字符

nth 函数是从迭代器中取出某值的方法，请不要在遍历中这样使用！因为 UTF-8 每个字符的长度不一定相等！

此用法有可能肢解一个 UTF-8 字符！那样会报错

```rust
fn main() {
    let s = String::from("EN中文");
    let a = s.chars().nth(2);
    println!("{:?}", a);
}
```

```rust
fn main() {
    let s = String::from("EN中文");
    let sub = &s[0..2];
    println!("{}", sub);
}
```

#### 遍历

```rust
fn main() {
    let s = String::from("hello中文");
    for c in s.chars() {
        println!("{}", c);
    }
}
```

### 映射表

键值散列映射表（Hash Map）

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();

    map.insert("color", "red");
    map.insert("size", "10 m^2");

    println!("{}", map.get("color").unwrap());
}
```

Rust 的映射表是十分方便的数据结构，当使用 insert 方法添加新的键值对的时候，如果已经存在相同的键，会直接覆盖对应的值。如果你想"安全地插入"，就是在确认当前不存在某个键时才执行的插入动作，可以这样

```rust
//如果没有键为 "color" 的键值对就添加它并设定值为 "red"，否则将跳过
map.entry("color").or_insert("red");


//在已经确定有某个键的情况下如果想直接修改对应的值，有更快的办法
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert(1, "a");

    if let Some(x) = map.get_mut(&1) {
        *x = "b";
    }
}
```

#### 遍历

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();

    map.insert("color", "red");
    map.insert("size", "10 m^2");

    for p in map.iter() {
        println!("{:?}", p);
    }
}
```

## 面向对象

### 封装

> 封装就是对外显示的策略，在 Rust 中可以通过模块的机制来实现最外层的封装，并且每一个 Rust 文件都可以看作一个模块，模块内的元素可以通过 pub 关键字对外明示。这一点在"组织管理"章节详细叙述过。
>
> "类"往往是面向对象的编程语言中常用到的概念。"类"封装的是数据，是对同一类数据实体以及其处理方法的抽象。在 Rust 中，我们可以使用结构体或枚举类来实现类的功能

```rust
pub struct ClassName {
    pub field: Type,
}

pub impl ClassName {
    fn some_method(&self) {
        // 方法函数体
    }
}

pub enum EnumName {
    A,
    B,
}

pub impl EnumName {
    fn some_method(&self) {

    }
}
```

```rust
second.rs
pub struct ClassName {
    field: i32,
}

impl ClassName {
    pub fn new(value: i32) -> ClassName {
        ClassName {
            field: value
        }
    }

    pub fn public_method(&self) {
        println!("from public method");
        self.private_method();
    }

    fn private_method(&self) {
        println!("from private method");
    }
}
main.rs
mod second;
use second::ClassName;

fn main() {
    let object = ClassName::new(1024);
    object.public_method();
}
```

### 继承

几乎其他的面向对象的编程语言都可以实现"继承"，并用"extend"词语来描述这个动作。

继承是多态（Polymorphism）思想的实现，多态指的是编程语言可以处理多种类型数据的代码。在 Rust 中，通过特性（trait）实现多态。有关特性的细节已在"特性"章节给出。但是特性无法实现属性的继承，只能实现类似于"接口"的功能，所以想继承一个类的方法最好在"子类"中定义"父类"的实例。

总结地说，Rust 没有提供跟继承有关的语法糖，也没有官方的继承手段（完全等同于 Java 中的类的继承），但灵活的语法依然可以实现相关的功能。

## 并发

> 安全高效的处理并发是 Rust 诞生的目的之一，主要解决的是服务器高负载承受能力。
>
> 并发（concurrent）的概念是指程序不同的部分独立执行，这与并行（parallel）的概念容易混淆，并行强调的是"同时执行"。
>
> 并发往往会造成并行。

### 线程

> 线程（thread）是一个程序中独立运行的一个部分。
>
> 线程不同于进程（process）的地方是线程是程序以内的概念，程序往往是在一个进程中执行的。
>
> 在有操作系统的环境中进程往往被交替地调度得以执行，线程则在进程以内由程序进行调度。
>
> 由于线程并发很有可能出现并行的情况，所以在并行中可能遇到的死锁、延宕错误常出现于含有并发机制的程序。
>
> 为了解决这些问题，很多其它语言（如 Java、C#）采用特殊的运行时（runtime）软件来协调资源，但这样无疑极大地降低了程序的执行效率。
>
> C/C++ 语言在操作系统的最底层也支持多线程，且语言本身以及其编译器不具备侦察和避免并行错误的能力，这对于开发者来说压力很大，开发者需要花费大量的精力避免发生错误。
>
> Rust 不依靠运行时环境，这一点像 C/C++ 一样。
>
> 但 Rust 在语言本身就设计了包括所有权机制在内的手段来尽可能地把最常见的错误消灭在编译阶段，这一点其他语言不具备。
>
> 但这不意味着我们编程的时候可以不小心，迄今为止由于并发造成的问题还没有在公共范围内得到完全解决，仍有可能出现错误，并发编程时要尽量小心！
>
> Rust 中通过 `std::thread::spawn` 函数创建新线程

这个结果在某些情况下顺序有可能变化，但总体上是这样打印出来的。

此程序有一个子线程，目的是打印 5 行文字，主线程打印三行文字，但很显然随着主线程的结束，spawn 线程也随之结束了，并没有完成所有打印。

```rust
use std::thread;
use std::time::Duration;

fn spawn_function() {
    for i in 0..5 {
        println!("spawned thread print {}", i);
        thread::sleep(Duration::from_millis(1));
    }
}

fn main() {
    thread::spawn(spawn_function);

    for i in 0..3 {
        println!("main thread print {}", i);
        thread::sleep(Duration::from_millis(1));
    }
}

/*main thread print 0
spawned thread print 0
main thread print 1
spawned thread print 1
main thread print 2
spawned thread print 2*/
```

## cargo指令

```shell
cargo build //构建项目
cargo run //运行项目
cargo update //更新项目中的crates
cargo check //检查项目中的代码，速度比cargo build快
cargo new projectName //新建项目
```
