# 1. Java基础面试题

## 1.1 概念

### Java特点
- **平台无关性**：Java编译器将源代码编译成字节码（bytecode），该字节码可以在任何安装了Java虚拟机（JVM）的系统上运行。
- **面向对象**：Java是一门严格的面向对象编程语言，几乎一切都是对象。面向对象编程（OOP）特性使得代码更易于维护和重用，包括类（class）、对象（object）、继承（inheritance）、多态（polymorphism）、抽象（abstraction）和封装（encapsulation）。
- **内存管理**：Java有自己的垃圾回收机制，自动管理内存和回收不再使用的对象，从而减少内存泄漏和其他内存相关的问题。

### Java为什么是跨平台的？
Java能支持跨平台主要依赖于JVM。  
JVM是一个软件，不同的平台有不同的版本。我们编写的Java源码，编译后会生成一种 `.class` 文件，称为字节码文件。Java虚拟机就是负责将字节码文件翻译成特定平台下的机器码然后运行。

而这个过程中，我们编写的Java程序没有做任何改变，仅仅是通过JVM这一“中间层”，就能在不同平台上运行，真正实现了“**一次编译，到处运行**”的目的。  

编译的结果不是生成机器码，而是生成字节码，字节码不能直接运行，必须通过JVM翻译成机器码才能运行。不同平台下编译生成的字节码是一样的，但是由JVM翻译成的机器码却不一样。

所以，运行Java程序必须有JVM的支持，因为编译的结果不是机器码，必须要经过JVM的再次翻译才能执行。即使你将Java程序打包成可执行文件（例如 `.exe`），仍然需要JVM的支持。

跨平台的是Java程序，不是JVM。JVM是用C/C++开发的，是编译后的机器码，不能跨平台，不同平台下需要安装不同版本的JVM。

### JVM、JDK、JRE三者关系
![JDK-JRE-JVM](images/JDK-JRE-JVM.webp)

它们之间的关系如下：
- **JDK** 是Java开发工具包，是开发Java程序所需的工具集合。它包含了JVM、编译器（`javac`）、调试器（`jdb`）等开发工具，以及一系列的类库（如Java标准库和开发工具库）。JDK提供了开发、编译、调试和运行Java程序所需的全部工具和环境。
- **JRE** 是Java程序运行所需的最小环境。它包含了JVM和一组Java类库，用于支持Java程序的执行。
- **JVM** 是Java虚拟机，是Java程序运行的环境。它负责将Java字节码（由Java编译器生成）解释或编译成机器码，并执行程序。JVM提供了内存管理、垃圾回收、安全性等功能，使得Java程序具备跨平台性。

### 为什么Java解释和编译都有？
首先在Java经过编译之后生成字节码文件，接下来进入JVM中，就有两个步骤：编译和解释，如下图：
![Java-Compile](images/Java-Compile.webp)

- **编译性**：Java源代码首先被编译成字节码，JIT会把编译过的机器码保存起来，以备下次使用。
- **解释性**：JVM中有一个方法调用计数器，当累计计数大于一定值的时候，就使用JIT进行编译生成机器码文件。否则就是用解释器进行解释执行，然后字节码也是经过解释器进行解释运行的。

所以Java既是编译型语言也是解释性语言，默认采用的是解释器和编译器混合的模式。

### JVM是什么
JVM是Java虚拟机，主要工作是解释自己的指令集（即字节码）并映射到本地的CPU指令集和OS的系统调用。  

JVM屏蔽了与操作系统平台相关的信息，使得Java程序只需要生成在Java虚拟机上运行的目标代码（字节码），就可在多种平台上不加修改地运行，这也是Java能够“**一次编译，到处运行**”的原因。

### 编译型语言和解释型语言的区别
- **编译型语言**：在程序执行之前，整个源代码会被编译成机器码或者字节码，生成可执行文件。执行时直接运行编译后的代码，速度快，但跨平台性较差。
- **解释型语言**：在程序执行时，逐行解释执行源代码，不生成独立的可执行文件。通常由解释器动态解释并执行代码，跨平台性好，但执行速度相对较慢。

典型的编译型语言如C、C++，典型的解释型语言如Python、JavaScript。

### Python和Java区别是什么？
- **Java** 是一种已编译的编程语言，Java编译器将源代码编译为字节码，而字节码则由Java虚拟机执行。
- **Python** 是一种解释语言，会在执行程序的同时进行翻译。

## 1.2 数据类型

### 八种基本的数据类型

Java支持数据类型分为两类：基本数据类型和引用数据类型。

基本数据类型共有8种，可以分为三类：

- 数值型：整数类型（`byte`、`short`、`int`、`long`）和浮点类型（`float`、`double`）
- 字符型：`char`
- 布尔型：`boolean`

![Data-Structure](images/Java-Basic/Data-Structure.webp)

8种基本数据类型的默认值、位数、取值范围，如下表所示：

![Data-Structure-Value](images/Java-Basic/Data-Structure-Value.webp)

> **说明：**
> - `Float` 和 `Double` 的最小值和最大值都是以科学记数法的形式输出的，结尾的 “E+数字” 表示 E 之前的数字要乘以 10 的多少倍。比如 `3.14E3` 就是 `3.14 × 1000 = 3140`，`3.14E-3` 就是 `3.14 / 1000 = 0.00314`。
> - Java八种基本数据类型的字节数：
>     - 1 字节：`byte`、`boolean`
>     - 2 字节：`short`、`char`
>     - 4 字节：`int`、`float`
>     - 8 字节：`long`、`double`
> - 浮点数的默认类型为 `double`（如果需要声明一个常量为 `float` 型，则必须要在末尾加上 `f` 或 `F`）。
> - 整数的默认类型为 `int`（声明 `Long` 型在末尾加上 `l` 或 `L`）。
> - 八种基本数据类型的包装类：除了 `char` 对应的是 `Character`，`int` 类型的是 `Integer`，其他都是首字母大写。
> - `char` 类型是无符号的，不能为负，所以是从 0 开始的。

---

### `long` 和 `int` 可以互转吗？

可以的，Java中的 `long` 和 `int` 可以相互转换。由于 `long` 类型的范围比 `int` 类型大，因此将 `int` 转换为 `long` 是安全的，而将 `long` 转换为 `int` 可能会导致数据丢失或溢出。

- 将 `int` 转换为 `long` 可以通过直接赋值或强制类型转换来实现。
- 将 `long` 转换为 `int` 需要使用强制类型转换，但需要注意潜在的数据丢失或溢出问题。

> 在将 `long` 转换为 `int` 时，如果 `longValue` 的值超出了 `int` 类型的范围，转换结果将是截断后的低位部分。因此，在进行转换之前，建议先检查 `longValue` 的值是否在 `int` 类型的范围内，以避免数据丢失或溢出的问题。

---

### 数据类型转换方式你知道哪些？

- **自动类型转换（隐式转换）**：当目标类型的范围大于源类型时，Java 会自动将源类型转换为目标类型，不需要显式的类型转换。例如，将 `int` 转换为 `long`、将 `float` 转换为 `double` 等。

- **强制类型转换（显式转换）**：当目标类型的范围小于源类型时，需要使用强制类型转换将源类型转换为目标类型。这可能导致数据丢失或溢出。例如，将 `long` 转换为 `int`、将 `double` 转换为 `int` 等。语法为：`目标类型 变量名 = (目标类型) 源类型`。

- **字符串转换**：Java 提供了将字符串表示的数据转换为其他类型数据的方法。例如，将字符串转换为整型 `int`，可以使用 `Integer.parseInt()` 方法；将字符串转换为浮点型 `double`，可以使用 `Double.parseDouble()` 方法等。

- **数值之间的转换**：Java 提供了一些数值类型之间的转换方法，如将整型转换为字符型、将字符型转换为整型等。这些转换方式可以通过类型的包装类来实现，例如 `Character` 类、`Integer` 类等提供了相应的转换方法。

### 类型互转会出现什么问题吗？

- **数据丢失**：当将一个范围较大的数据类型转换为一个范围较小的数据类型时，可能会发生数据丢失。例如，将一个 `long` 类型的值转换为 `int` 类型时，如果 `long` 值超出了 `int` 类型的范围，转换结果将是截断后的低位部分，高位部分的数据将丢失。
- **数据溢出**：当数值超过目标数据类型的表示范围时，可能会发生数据溢出，通常出现在将范围更大的数据类型强制转换为范围更小的数据类型时。例如，将一个 long 类型的值转换为 int 类型时，如果值超出 int 类型的最大或最小范围，数值将发生回绕（溢出）。而将小范围数据类型转换为大范围数据类型时，不会发生数据溢出，因为大范围可以容纳小范围的值。
- **精度损失**：在进行浮点数类型的转换时，可能会发生精度损失。由于浮点数的表示方式不同，将一个单精度浮点数 (`float`) 转换为双精度浮点数 (`double`) 时，精度可能会损失。
- **类型不匹配导致的错误**：在进行类型转换时，需要确保源类型和目标类型是兼容的。如果两者不兼容，会导致编译错误或运行时错误。

### 为什么用 `BigDecimal` 不用 `double`？

`double` 会出现精度丢失的问题，`double` 执行的是二进制浮点运算，二进制有些情况下不能准确地表示一个小数，就像十进制不能准确地表示 `1/3`（`1/3 = 0.3333...`），也就是说，二进制表示小数时只能够表示能够用 `1/(2^n)` 的和的任意组合，但是 `0.1` 不能够精确表示，因为它不能够表示成为 `1/(2^n)` 的和的形式。

在 Java 中进行浮点数运算时，会出现丢失精度的问题。那么我们如果在进行商品价格计算的时候，就会出现问题。很有可能造成我们手中有 `0.06` 元，却无法购买一个 `0.05` 元和一个 `0.01` 元的商品。因为如上所示，它们两个的总和为 `0.060000000000000005`。这无疑是一个很严重的问题，尤其是当电商网站的并发量上去的时候，出现的问题将是巨大的，可能会导致无法下单，或者对账出现问题。

而 `BigDecimal` 是精确计算的，因此一般牵涉到金钱的计算时，都使用 `BigDecimal`。

我们创建了两个 `BigDecimal` 对象 `num1` 和 `num2`，分别表示 `0.1` 和 `0.2` 这两个十进制数。然后，我们使用 `add()` 方法计算它们的和，并使用 `multiply()` 方法计算它们的乘积。最后，我们通过 `System.out.println()` 打印结果。

这样的使用 `BigDecimal` 可以确保精确的十进制数值计算，避免了使用 `double` 可能出现的舍入误差。需要注意的是，在创建 `BigDecimal` 对象时，应该使用字符串作为参数，而不是直接使用浮点数值，以避免浮点数精度丢失。

### 装箱和拆箱是什么？

装箱（Boxing）和拆箱（Unboxing）是将基本数据类型和对应的包装类之间进行转换的过程。

~~~java
Integer i = 10;  //装箱
int n = i;   //拆箱
~~~

自动装箱主要发生在两种情况，一种是赋值时，另一种是在方法调用的时候。

**赋值时**  
这是最常见的一种情况，在 Java 1.5 以前我们需要手动地进行转换才行，而现在所有的转换都是由编译器来完成。

~~~java
//before autoboxing
Integer iObject = Integer.valueOf(3);
int iPrimitive = iObject.intValue();

//after java5
Integer iObject = 3; //autoboxing - primitive to wrapper conversion
int iPrimitive = iObject; //unboxing - object to primitive conversion
~~~

**方法调用时**  
当我们在方法调用时，我们可以传入原始数据值或者对象，同样编译器会帮我们进行转换。

~~~java
public static Integer show(Integer iParam){
   System.out.println("autoboxing example - method invocation i: " + iParam);
   return iParam;
}
~~~

**自动装箱和拆箱示例**

~~~java
//autoboxing and unboxing in method invocation
show(3); //autoboxing
int result = show(3); //unboxing because return type of method is Integer
~~~

`show` 方法接受 `Integer` 对象作为参数，当调用 `show(3)` 时，会将 `int` 值转换成对应的 `Integer` 对象，这就是所谓的自动装箱，`show` 方法返回 `Integer` 对象，而 `int result = show(3);` 中 `result` 为 `int` 类型，所以这时候发生自动拆箱操作，将 `show` 方法返回的 `Integer` 对象转换成 `int` 值。

**自动装箱的弊端**  
自动装箱有一个问题，那就是在一个循环中进行自动装箱操作的情况，如下面的例子就会创建多余的对象，影响程序的性能。

~~~java
Integer sum = 0; 
for(int i=1000; i<5000; i++){   
    sum+=i; 
} 
~~~

上面的代码 `sum+=i` 可以看成 `sum = sum + i`，但是 `+` 这个操作符不适用于 `Integer` 对象，首先 `sum` 进行自动拆箱操作，进行数值相加操作，最后发生自动装箱操作转换成 `Integer` 对象。其内部变化如下：

~~~java
int result = sum.intValue() + i; 
Integer sum = new Integer(result);
~~~

由于我们这里声明的 `sum` 为 `Integer` 类型，在上面的循环中会创建将近 4000 个无用的 `Integer` 对象，在这样庞大的循环中，会降低程序的性能并且加重了垃圾回收的工作量。因此在我们编程时，需要注意到这一点，正确地声明变量类型，避免因为自动装箱引起的性能问题。

#### Java为什么要有Integer？

`Integer` 是 `int` 类型的包装类，它将 `int` 类型包装成 `Object` 对象。对象封装有很多好处，可以把属性（数据）和处理这些数据的方法结合在一起。例如，`Integer` 就有 `parseInt()` 等方法来专门处理 `int` 类型相关的数据。

在 Java 中，绝大部分方法或类都是用来处理类类型对象的。如 `ArrayList` 集合类只能存储对象类型的元素，如果想把一个 `int` 型的数据存入 `list` 中，就必须将它包装成 `Integer` 类。

**泛型中的应用**  
在 Java 中，泛型只能使用引用类型，不能使用基本类型。因此，如果要在泛型中使用 `int` 类型，必须使用 `Integer` 包装类。例如，假设我们有一个列表，想要将其元素排序，并将排序结果存储在一个新的列表中。如果我们使用基本数据类型 `int`，无法直接使用 `Collections.sort()` 方法。但如果我们使用 `Integer` 包装类，则可以轻松地使用该方法。

~~~java
List<Integer> list = new ArrayList<>();
list.add(3);
list.add(1);
list.add(2);
Collections.sort(list);
System.out.println(list);
~~~

**转换中的应用**  
在 Java 中，基本类型和引用类型不能直接进行转换，必须使用包装类来实现。例如，将一个 `int` 类型的值转换为 `String` 类型，必须首先将其转换为 `Integer` 类型，再转换为 `String` 类型。

~~~java
int i = 10;
Integer integer = new Integer(i);
String str = integer.toString();
System.out.println(str);
~~~

**集合中的应用**  
Java 集合只能存储对象，而不能存储基本数据类型。因此，如果要将 `int` 类型的数据存储在集合中，必须使用 `Integer` 包装类。例如，假设我们有一个列表，想要计算列表中所有元素的和。如果我们使用基本数据类型 `int`，需要使用循环遍历列表并将每个元素相加。但如果我们使用 `Integer` 包装类，则可以直接使用 `stream()` 方法来计算和。

~~~java
List<Integer> list = new ArrayList<>();
list.add(3);
list.add(1);
list.add(2);
int sum = list.stream().mapToInt(Integer::intValue).sum();
System.out.println(sum);
~~~

#### Integer相比int有什么优点？

`int` 是 Java 中的原始数据类型，而 `Integer` 是 `int` 的包装类。

**`Integer` 和 `int` 的区别：**

- **基本类型和引用类型**：`int` 是基本数据类型，`Integer` 是引用类型。基本数据类型是 Java 中最基本的数据类型，不需要实例化就能使用。而引用类型则需要通过实例化对象来使用。这意味着，使用 `int` 存储一个整数时，不需要额外的内存分配，而使用 `Integer` 时，必须为对象分配内存。在性能方面，基本数据类型的操作通常比对应的引用类型快。
  
- **自动装箱和拆箱**：`Integer` 作为 `int` 的包装类，可以实现自动装箱和拆箱。自动装箱是指将基本类型转化为相应的包装类类型，自动拆箱则是将包装类类型转化为基本类型。这使得 Java 程序员更加方便地进行数据类型转换。例如，当需要将 `int` 类型的值赋给 `Integer` 变量时，Java 会自动将 `int` 类型转换为 `Integer` 类型；同样地，当将 `Integer` 类型的值赋给 `int` 变量时，Java 会自动将 `Integer` 类型转换为 `int` 类型。

- **空指针异常**：`int` 变量可以直接赋值为 0，而 `Integer` 变量必须通过实例化对象来赋值。如果对一个未经初始化的 `Integer` 变量进行操作，会抛出空指针异常。这是因为它被赋予了 `null` 值，而 `null` 无法进行自动拆箱。

#### 那为什么还要保留int类型？

包装类是引用类型，对象的引用和对象本身是分开存储的。而基本类型数据，变量对应的内存块直接存储数据本身。因此，基本类型数据在读写效率方面，比包装类高效。除此之外，在 64 位 JVM 上，在开启引用压缩的情况下，一个 `Integer` 对象占用 16 个字节的内存空间，而一个 `int` 类型数据只占用 4 字节的内存空间，前者对空间的占用是后者的 4 倍。

也就是说，无论是读写效率，还是存储效率，基本类型都比包装类高效。

- 使用 int 时，可以获得更高的性能和更低的内存开销，尤其是在大量数值运算和数据处理时。
- 使用 Integer 时，虽然会引入额外的内存和性能开销，但它为一些场景提供了对象特性，如可以存储到集合类中、提供丰富的方法、支持自动装箱/拆箱等。

#### 说一下 Integer 的缓存

Java 的 `Integer` 类内部实现了一个静态缓存池，用于存储特定范围内的整数值对应的 `Integer` 对象。

默认情况下，这个范围是 -128 至 127。当通过 `Integer.valueOf(int)` 方法创建一个在这个范围内的整数对象时，并不会每次都生成新的对象实例，而是复用缓存中的现有对象，会直接从内存中取出，而不需要新建一个对象。

## 1.3 面向对象

### 怎么理解面向对象？简单说说封装继承多态

面向对象是一种编程范式，它将现实世界中的事物抽象为对象，对象具有属性（字段）和行为（方法）。面向对象编程的设计思想是以对象为中心，通过对象之间的交互来完成程序的功能，具有灵活性和可扩展性，通过封装和继承可以更好地应对需求变化。

Java面向对象的三大特性包括：封装、继承、多态。

- **封装**：将对象的属性和行为结合在一起，对外隐藏对象的内部细节，仅通过对象提供的接口与外界交互。封装的目的是增强安全性和简化编程，使得对象更加独立。
- **继承**：一种可以使子类自动共享父类数据结构和方法的机制。它是代码复用的重要手段，通过继承可以建立类与类之间的层次关系，使得结构更加清晰。
- **多态**：同一操作作用于不同的对象时，可以有不同的解释和行为。多态性允许不同类的对象对同一消息做出响应，具体行为由对象的实际类型决定。多态性可以分为编译时多态（重载）和运行时多态（重写）。

### 多态体现在哪几个方面？

多态在面向对象编程中可以体现在以下几个方面：

- **方法重载**：同一类中可以有多个同名方法，它们具有不同的参数列表（参数类型、数量或顺序不同）。虽然方法名相同，但根据传入的参数不同，编译器会在编译时确定调用哪个方法。  
示例：对于一个 add 方法，可以定义为 add(int a, int b) 和 add(double a, double b)。
- **方法重写**：子类能够提供对父类中同名方法的具体实现。在运行时，JVM会根据对象的实际类型确定调用哪个版本的方法。
示例：在一个动物类中，定义一个 sound 方法，子类 Dog 可以重写该方法以实现 bark，而 Cat 可以实现 meow。
- **接口与实现**：多个类可以实现同一个接口，并且用接口类型的引用来调用这些类的方法。这使得程序在面对不同具体实现时保持一贯的调用方式。  
示例：多个类（如 Dog, Cat）都实现了一个 Animal 接口，当用 Animal 类型的引用来调用 makeSound 方法时，会触发对应的实现。
- **向上转型和向下转型**：在Java中，可以使用父类类型的引用指向子类对象，这是向上转型。向下转型是将父类引用转回其子类类型，但在执行前需要确认引用实际指向的对象类型以避免 ClassCastException。

### 多态解决了什么问题？

多态是指子类可以替换父类，在实际运行过程中，调用子类的方法实现。多态这种特性也需要编程语言提供特殊的语法机制来实现，比如继承、接口类。

多态可以提高代码的扩展性和复用性，是很多设计模式、设计原则、编程技巧的代码实现基础。比如策略模式、基于接口而非实现编程、依赖倒置原则、里式替换原则、利用多态去掉冗长的 if-else 语句等等。

### 面向对象的设计原则你知道有哪些吗

面向对象编程中的六大原则：

- **单一职责原则（SRP）**：一个类应该只有一个引起它变化的原因，即一个类应该只负责一项职责。  
例子：考虑一个员工类，它应该只负责管理员工信息，而不应负责其他无关工作。
- **开放封闭原则（OCP）**：软件实体应该对扩展开放，对修改封闭。  
例子：通过制定接口来实现这一原则，比如定义一个图形类，然后让不同类型的图形继承这个类，而不需要修改图形类本身。
- **里氏替换原则（LSP）**：子类对象应该能够替换掉所有父类对象。  
例子：一个正方形是一个矩形，但如果修改一个矩形的高度和宽度时，正方形的行为应该如何改变就是一个违反里氏替换原则的例子。
- **接口隔离原则（ISP）**：客户端不应该依赖那些它不需要的接口，即接口应该小而专。  
例子：通过接口抽象层来实现底层和高层模块之间的解耦，比如使用依赖注入。
- **依赖倒置原则（DIP）**：高层模块不应该依赖低层模块，二者都应该依赖于抽象；抽象不应该依赖于细节，细节应该依赖于抽象。  
例子：如果一个公司类包含部门类，应该考虑使用合成/聚合关系，而不是将公司类继承自部门类。
- **最少知识原则 (Law of Demeter)**：一个对象应当对其他对象有最少的了解，只与其直接的朋友交互。

### 重载与重写有什么区别？

- **重载（Overloading）**指的是在同一个类中，可以有多个同名方法，它们具有不同的参数列表（参数类型、参数个数或参数顺序不同），编译器根据调用时的参数类型来决定调用哪个方法。
- **重写（Overriding）**指的是子类可以重新定义父类中的方法，方法名、参数列表和返回类型必须与父类中的方法一致，通过@override注解来明确表示这是对父类方法的重写。

### 抽象类和普通类区别？

- **实例化**：普通类可以直接实例化对象，而抽象类不能被实例化，只能被继承。
- **方法实现**：普通类中的方法可以有具体的实现，而抽象类中的方法可以有实现也可以没有实现。
- **继承**：一个类可以继承一个普通/抽象类，但可以同时实现多个接口。
- **实现限制**：普通类可以被其他类继承和使用(可以直接创建对象)，而抽象类一般用于作为基类(不可以直接创建对象)，被其他类继承和扩展使用。

### Java抽象类和接口的区别是什么？

两者的特点：

- 抽象类用于描述类的共同特性和行为，可以有成员变量、构造方法和具体方法。适用于有明显继承关系的场景。
- 接口用于定义行为规范，可以多实现，只能有常量和抽象方法（Java 8 以后可以有默认方法和静态方法）。适用于定义类的能力或功能。

两者的区别：

- **实现方式**：实现接口的关键字为implements，继承抽象类的关键字为extends。一个类可以实现多个接口，但一个类只能继承一个抽象类。所以，使用接口可以间接地实现多重继承。
- **方法方式**：接口只有定义，不能有方法的实现，java 1.8中可以定义default方法体，而抽象类可以有定义与实现，方法可在抽象类中实现。
- **访问修饰符**：接口成员变量默认为public static final，必须赋初值，不能被修改；其所有的成员方法都是public、abstract的。抽象类中成员变量默认default，可在子类中被重新定义，也可被重新赋值；抽象方法被abstract修饰，不能被private、static、synchronized和native等修饰，必须以分号结尾，不带花括号。
- **变量**：抽象类可以包含实例变量和静态变量，而接口只能包含常量（即静态常量）。

### 抽象类能加final修饰吗？

不能，Java中的抽象类是用来被继承的，而final修饰符用于禁止类被继承或方法被重写，因此，抽象类和final修饰符是互斥的，不能同时使用。

### 接口里面可以定义哪些方法？

**抽象方法**  
抽象方法是接口的核心部分，所有实现接口的类都必须实现这些方法。抽象方法默认是 public 和 abstract，这些修饰符可以省略。

~~~java
public interface Animal {
    void makeSound();
}
~~~

**默认方法**  
默认方法是在 Java 8 中引入的，允许接口提供具体实现。实现类可以选择重写默认方法。

~~~java
public interface Animal {
    void makeSound();
    
    default void sleep() {
        System.out.println("Sleeping...");
    }
}
~~~

**静态方法**  
静态方法也是在 Java 8 中引入的，它们属于接口本身，可以通过接口名直接调用，而不需要实现类的对象。

~~~java
public interface Animal {
    void makeSound();
    
    static void staticMethod() {
        System.out.println("Static method in interface");
    }
}
~~~

**私有方法**  
私有方法是在 Java 9 中引入的，用于在接口中为默认方法或其他私有方法提供辅助功能。这些方法不能被实现类访问，只能在接口内部使用。

~~~java
public interface Animal {
    void makeSound();
    
    default void sleep() {
        System.out.println("Sleeping...");
        logSleep();
    }
    
    private void logSleep() {
        System.out.println("Logging sleep");
    }
}
~~~

### 抽象类可以被实例化吗？
在Java中，抽象类本身不能被实例化。

这意味着不能使用new关键字直接创建一个抽象类的对象。抽象类的存在主要是为了被继承，它通常包含一个或多个抽象方法（由abstract关键字修饰且无方法体的方法），这些方法需要在子类中被实现。

抽象类可以有构造器，这些构造器在子类实例化时会被调用，以便进行必要的初始化工作。然而，这个过程并不是直接实例化抽象类，而是创建了子类的实例，间接地使用了抽象类的构造器。

例如：

~~~java
public abstract class AbstractClass {
    public AbstractClass() {
        // 构造器代码
    }
    
    public abstract void abstractMethod();
}

public class ConcreteClass extends AbstractClass {
    public ConcreteClass() {
        super(); // 调用抽象类的构造器
    }
    
    @Override
    public void abstractMethod() {
        // 实现抽象方法
    }
}

// 下面的代码可以运行
ConcreteClass obj = new ConcreteClass();
~~~

在这个例子中，ConcreteClass继承了AbstractClass并实现了抽象方法abstractMethod()。当我们创建ConcreteClass的实例时，AbstractClass的构造器被调用，但这并不意味着AbstractClass被实例化；实际上，我们创建的是ConcreteClass的一个对象。

简而言之，抽象类不能直接实例化，但通过继承抽象类并实现所有抽象方法的子类是可以被实例化的。

### 接口可以包含构造函数吗？
在接口中，不可以有构造方法,在接口里写入构造方法时，编译器提示：Interfaces cannot have constructors，因为接口不会有自己的实例的，所以不需要有构造函数。

为什么呢？构造函数就是初始化class的属性或者方法，在new的一瞬间自动调用，那么问题来了Java的接口，都不能new 那么要构造函数干嘛呢？根本就没法调用

### 解释Java中的静态变量和静态方法
在Java中，静态变量和静态方法是与类本身关联的，而不是与类的实例（对象）关联。它们在内存中只存在一份，可以被类的所有实例共享。

**静态变量**

静态变量（也称为类变量）是在类中使用static关键字声明的变量。它们属于类而不是任何具体的对象。主要的特点：

- 共享性：所有该类的实例共享同一个静态变量。如果一个实例修改了静态变量的值，其他实例也会看到这个更改。
- 初始化：静态变量在类被加载时初始化，只会对其进行一次分配内存。
- 访问方式：静态变量可以直接通过类名访问，也可以通过实例访问，但推荐使用类名。

示例：

~~~java
public class MyClass {
    static int staticVar = 0; // 静态变量

    public MyClass() {
        staticVar++; // 每创建一个对象，静态变量自增
    }
    
    public static void printStaticVar() {
        System.out.println("Static Var: " + staticVar);
    }
}

// 使用示例
MyClass obj1 = new MyClass();
MyClass obj2 = new MyClass();
MyClass.printStaticVar(); // 输出 Static Var: 2
~~~

**静态方法**

静态方法是在类中使用static关键字声明的方法。类似于静态变量，静态方法也属于类，而不是任何具体的对象。主要的特点：

- 无实例依赖：静态方法可以在没有创建类实例的情况下调用。对于静态方法来说，不能直接访问非静态的成员变量或方法，因为静态方法没有上下文的实例。
- 访问静态成员：静态方法可以直接调用其他静态变量和静态方法，但不能直接访问非静态成员。
- 多态性：静态方法不支持重写（Override），但可以被隐藏（Hide）。

~~~java
public class MyClass {
    static int count = 0;

    // 静态方法
    public static void incrementCount() {
        count++;
    }

    public static void displayCount() {
        System.out.println("Count: " + count);
    }
}

// 使用示例
MyClass.incrementCount(); // 调用静态方法
MyClass.displayCount();   // 输出 Count: 1
~~~

**使用场景**

- 静态变量：常用于需要在所有对象间共享的数据，如计数器、常量等。
- 静态方法：常用于助手方法（utility methods）、获取类级别的信息或者是没有依赖于实例的数据处理。

### 非静态内部类和静态内部类的区别？
区别包括：

- 非静态内部类依赖于外部类的实例，而静态内部类不依赖于外部类的实例。(实例)
- 非静态内部类可以访问外部类的实例变量和方法，而静态内部类只能访问外部类的静态成员。
- 非静态内部类不能定义静态成员，而静态内部类可以定义静态成员。
- 非静态内部类在外部类实例化后才能实例化，而静态内部类可以独立实例化。
- 非静态内部类可以访问外部类的私有成员，而静态内部类不能直接访问外部类的私有成员，需要通过实例化外部类来访问。

### 非静态内部类可以直接访问外部方法，编译器是怎么做到的？
非静态内部类可以直接访问外部方法是因为编译器在生成字节码时会为非静态内部类维护一个指向外部类实例的引用。

这个引用使得非静态内部类能够访问外部类的实例变量和方法。编译器会在生成非静态内部类的构造方法时，将外部类实例作为参数传入，并在内部类的实例化过程中建立外部类实例与内部类实例之间的联系，从而实现直接访问外部方法的功能。

### 有一个父类和子类，都有静态的成员变量、静态构造方法和静态方法，在我new一个子类对象的时候，加载顺序是怎么样的？
当你实例化一个子类对象时，静态成员变量、静态构造方法和静态方法的加载顺序遵循以下步骤：

1. 在创建子类对象之前，首先会加载父类的静态成员变量和静态代码块（构造方法无法被 static 修饰，因此这里是静态代码块）。这个加载是在类首次被加载时进行的，且只会发生一次。
2. 接下来，加载子类的静态成员变量和静态代码块。这一过程也只发生一次，即当首次使用子类的相关代码时。
3. 之后，执行实例化子类对象的过程。这时会呼叫父类构造方法，然后是子类的构造方法。

具体加载顺序可以简要总结为：

- 父类静态成员变量、静态代码块（如果有）
- 子类静态成员变量、静态代码块（如果有）
- 父类构造方法（实例化对象时）
- 子类构造方法（实例化对象时）

示例代码：

~~~java
class Parent {
    static {
        System.out.println("Parent static block");
    }
    static int parentStaticVar = 10;

    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    static {
        System.out.println("Child static block");
    }
    static int childStaticVar = 20;

    Child() {
        System.out.println("Child constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        Child c = new Child();
    }
}
~~~

输出结果：

- Parent static block
- Child static block
- Parent constructor
- Child constructor

从输出可以看出，在创建 Child 类型对象时，首先执行父类的静态块，然后是子类的静态块，最后才是父类和子类的构造函数。这清晰地展示了加载的顺序。

## 1.4 深拷贝和浅拷贝

### 深拷贝和浅拷贝的区别？
**浅拷贝**  
- 只复制对象本身及其内部的值类型字段。  
- 对于引用类型字段，复制的是引用地址，原对象与拷贝对象共享相同的引用对象。  

**深拷贝**  
- 复制对象本身及其内部所有字段，包括值类型和引用类型。  
- 对于引用类型字段，会递归复制其内容，生成独立的新对象，彼此不共享引用。 

### 实现深拷贝的三种方式

#### 1. **实现 `Cloneable` 接口并重写 `clone()` 方法**
- 要求对象及其所有引用类型字段都实现 `Cloneable` 接口，并重写 `clone()` 方法。  
- 在 `clone()` 方法中，需手动递归克隆引用类型字段，确保对象的每个层级都被复制。  

#### 2. **使用序列化和反序列化**
- 通过将对象序列化为字节流，再从字节流反序列化为新对象来实现深拷贝。  
- 要求对象及其所有引用类型字段都实现 `Serializable` 接口，适用于复杂对象的深度复制。  

#### 3. **手动递归复制**
- 针对特定对象结构，手动递归复制对象及其所有引用类型字段。  
- 适用于对象结构不复杂的情况，灵活性高，但需要手动处理每个字段的复制逻辑。


## 1.5 泛型

### 什么是泛型？
- 泛型允许类、接口和方法在定义时使用一个或多个类型参数，这些类型参数在使用时可以被指定为具体的类型。  
- 其主要目的是在**编译时提供更强的类型检查**，并在编译后能够保留类型信息，避免运行时出现类型转换异常。

### 为什么需要泛型？
1. **代码复用性**  
   - 适用于多种数据类型，使用相同的代码逻辑，避免为不同数据类型编写重复代码。  

2. **类型安全**  
   - 泛型中的类型在使用时指定，避免了强制类型转换，编译器会在编译期进行类型检查，减少运行时的 `ClassCastException` 异常。  

3. **编译时检查**  
   - 泛型引入了类型约束，能在**编译前**进行严格的类型检查，提升代码的健壮性，减少潜在的类型错误。  

## 1.6 对象

### Java 创建对象的方式：
1. **使用 `new` 关键字**  
   - 通过 `new` 关键字直接调用类的构造方法创建对象，最常用的方式。

2. **使用 `Class` 类的 `newInstance()` 方法**  
   - 通过**反射机制**，使用 `Class` 类的 `newInstance()` 方法创建对象，要求该类必须有一个无参构造器。（JDK 9 及之后推荐使用 `Constructor` 类的 `newInstance()` 方法）

3. **使用 `Constructor` 类的 `newInstance()` 方法**  
   - 通过 `java.lang.reflect.Constructor` 对象获取特定构造方法并调用 `newInstance()`，可用于调用**私有构造方法**。

4. **使用 `clone()` 方法**  
   - 如果类实现了 `Cloneable` 接口，可以通过 `Object` 类的 `clone()` 方法复制对象，属于**浅拷贝**。

5. **使用反序列化**  
   - 通过实现 `Serializable` 接口，先将对象序列化为字节流保存或传输，之后通过反序列化还原为对象。

### new 出的对象什么时候回收？

Java 使用 **垃圾回收器（Garbage Collector，GC）** 自动管理内存，回收不再使用的对象，具体回收时机由 GC 的算法和策略决定，常见回收判断方法如下：

1. **引用计数法**（已淘汰）  
   - 记录对象被引用的次数，计数为 0 时对象被回收。此方法无法处理**循环引用**问题，Java 垃圾回收器不使用此算法。

2. **可达性分析算法**（主流算法）  
   - 以 **GC Roots**（如栈帧中的局部变量、静态变量、JNI 引用）为起点，遍历引用链，无法到达的对象会被标记为**可回收**。  
   - GC Roots 包括：
     - 栈中引用的对象（方法中的局部变量、输入参数等）。
     - 类的静态属性引用的对象。
     - 常量引用的对象（如 `String` 常量池）。
     - JNI（Native 方法）引用的对象。

3. **终结器（Finalizer）**  
   - 如果对象重写了 `finalize()` 方法，GC 会在回收前调用它进行资源释放，但由于执行时间不确定，**不推荐使用**。

### Java 垃圾回收器的常用算法：
1. **标记-清除算法**  
   - 标记需要回收的对象，随后清除这些对象，存在**内存碎片**问题。

2. **复制算法**  
   - 将存活对象复制到新区域，清空原区域，适用于**年轻代**。

3. **标记-整理算法**  
   - 标记存活对象，移动至内存一端，清理无效对象，适用于**老年代**。

4. **分代回收**  
   - 根据对象生命周期将内存分为：
   - 年轻代（Young Generation）：存活时间短，使用复制算法。
   - 老年代（Old Generation）：存活时间长，使用标记-整理算法。
   - 永久代（PermGen，JDK 8 之前）或元空间（Metaspace，JDK 8 之后）：存储类的元数据。

### 触发垃圾回收的条件：
- **内存不足**（堆空间耗尽、方法区溢出等）。
- **手动调用 `System.gc()`**（不建议，可能不会立即执行）。
- **对象生命周期结束**（如方法执行完毕、引用置空）。

## 1.7 反射

### 什么是反射？
Java 反射机制是指程序在**运行时**可以动态获取类的完整信息（如属性、方法、构造器等），并且可以创建对象、访问字段、调用方法。反射赋予 Java 强大的**动态性**，使其能够在**编译期**未知的情况下操作对象和类。

### 反射的主要特性：
1. **运行时类信息访问**  
   - 获取类的**全限定名**、**包名**、**父类**、**接口**、**构造方法**、**字段**、**方法**等。
   
2. **动态对象创建**  
   - 通过 `Class` 类的 `newInstance()` 方法或 `Constructor` 类的 `newInstance()` 方法，**动态**地创建对象，即使类名在**编译期**未知。

3. **动态方法调用**  
   - 通过 `Method` 类的 `invoke()` 方法，**动态**地调用类的**公有或私有**方法。

4. **访问和修改字段**  
   - 通过 `Field` 类的 `get()` 和 `set()` 方法，**动态**地获取和修改类的字段值，**包括私有字段**。

---

### 反射的常见应用场景：

1. **动态加载数据库驱动**
   - 例如在 JDBC 中，根据实际情况加载 MySQL、Oracle、PostgreSQL 等数据库驱动。

~~~java
// 通过反射加载 MySQL 驱动
Class.forName("com.mysql.cj.jdbc.Driver");

// 通过反射加载 Oracle 驱动
Class.forName("oracle.jdbc.OracleDriver");
~~~

2. **依赖注入（DI）与 Spring 框架的 IOC**
   - Spring 框架利用反射实现**对象的动态创建和依赖注入**，通过 XML、注解等配置动态装载 Bean。

~~~java
// 通过反射创建对象实例
Class<?> clazz = Class.forName("com.example.MyService");
Object obj = clazz.getDeclaredConstructor().newInstance();
~~~

3. **工具类实现（如 JSON 序列化与反序列化）**
   - 序列化库如 `Jackson`、`Fastjson`，使用反射将对象转换为 JSON 字符串，或将 JSON 字符串转换为对象。

~~~java
// 通过反射获取类的字段值
Field[] fields = obj.getClass().getDeclaredFields();
for (Field field : fields) {
    field.setAccessible(true);  // 访问私有字段
    System.out.println(field.getName() + "=" + field.get(obj));
}
~~~

4. **注解处理（Annotation Processing）**
   - 通过反射解析类或方法上的**自定义注解**，如 `@Autowired`, `@Controller`。

~~~java
// 解析类中的自定义注解
Class<?> clazz = MyController.class;
if (clazz.isAnnotationPresent(Controller.class)) {
    System.out.println(clazz.getName() + " 被 @Controller 标注");
}
~~~

---

### 反射的常用类：
- `Class`：表示类的元信息，主要用于获取类的结构。
- `Constructor`：表示类的构造方法，主要用于**创建对象**。
- `Method`：表示类的方法，主要用于**方法调用**。
- `Field`：表示类的字段，主要用于**属性访问**。

---

### 反射的性能影响与优化：
- **性能消耗**：反射绕过编译器的检查，直接操作字节码，性能略低于常规调用。
- **优化方式**：
    - **缓存反射对象**（如 `Method`、`Field`）。
    - 避免频繁调用 `Class.forName()`，可以通过**单例模式**复用对象。

## 1.8 注解

### Java注解的原理
注解本质是一个继承了 `Annotation` 接口的特殊接口，其具体实现类是 Java 运行时生成的动态代理类。

通过反射获取注解时，返回的是 Java 运行时生成的动态代理对象。通过代理对象调用自定义注解的方法，会最终调用 `AnnotationInvocationHandler` 的 `invoke` 方法。该方法会从 `memberValues` 这个 `Map` 中索引出对应的值，而 `memberValues` 的来源是 Java 常量池。

---

### Java注解的作用域
注解的作用域（Scope）指的是注解可以应用在哪些程序元素上，例如类、方法、字段等。Java 注解的作用域可以分为三种：

1. **类级别作用域**  
   用于描述类的注解，通常放置在类定义的上面，可以用来指定类的一些属性，如类的访问级别、继承关系、注释等。

2. **方法级别作用域**  
   用于描述方法的注解，通常放置在方法定义的上面，可以用来指定方法的一些属性，如方法的访问级别、返回值类型、异常类型、注释等。

3. **字段级别作用域**  
   用于描述字段的注解，通常放置在字段定义的上面，可以用来指定字段的一些属性，如字段的访问级别、默认值、注释等。

除了这三种作用域，Java 还提供了其他一些注解作用域，例如构造函数作用域和局部变量作用域。这些注解作用域可以用来对构造函数和局部变量进行描述和注释。

## 1.9 异常

### Java的异常体系
Java的异常体系主要基于两大类：`Throwable` 类及其子类。`Throwable` 有两个重要的子类：`Error` 和 `Exception`，它们分别代表了不同类型的异常情况。

1. **Error（错误）**  
   表示运行时环境的错误。错误是程序无法处理的严重问题，如系统崩溃、虚拟机错误、动态链接失败等。通常，程序不应该尝试捕获这类错误。例如，`OutOfMemoryError`、`StackOverflowError` 等。

2. **Exception（异常）**  
   表示程序本身可以处理的异常条件。异常分为两大类：

   - **非运行时异常**：这类异常在编译时期就必须被捕获或者声明抛出。它们通常是外部错误，如文件不存在（`FileNotFoundException`）、类未找到（`ClassNotFoundException`）等。非运行时异常强制程序员处理这些可能出现的问题，增强了程序的健壮性。
   - **运行时异常**：这类异常包括运行时异常（`RuntimeException`）和错误（`Error`）。运行时异常由程序错误导致，如空指针访问（`NullPointerException`）、数组越界（`ArrayIndexOutOfBoundsException`）等。运行时异常是不需要在编译时强制捕获或声明的。

---

### Java异常处理
异常处理是通过使用 `try-catch` 语句块来捕获和处理异常。以下是 Java 中常用的异常处理方式：

1. **try-catch语句块**  
   用于捕获并处理可能抛出的异常。`try` 块中包含可能抛出异常的代码，`catch` 块用于捕获并处理特定类型的异常。可以有多个 `catch` 块来处理不同类型的异常。

2. **throw语句**  
   用于手动抛出异常。可以根据需要在代码中使用 `throw` 语句主动抛出特定类型的异常。

3. **throws关键字**  
   用于在方法声明中声明可能抛出的异常类型。如果一个方法可能抛出异常，但不想在方法内部进行处理，可以使用 `throws` 关键字将异常传递给调用者来处理。

4. **finally块**  
   用于定义无论是否发生异常都会执行的代码块。通常用于释放资源，确保资源的正确关闭。

---

### 抛出异常为什么不用throws？
如果异常是未检查异常或者在方法内部被捕获和处理了，那么就不需要使用 `throws`。

- **Unchecked Exceptions**：未检查异常（unchecked exceptions）是继承自 `RuntimeException` 类或 `Error` 类的异常，编译器不强制要求进行异常处理。因此，对于这些异常，不需要在方法签名中使用 `throws` 来声明。示例包括 `NullPointerException`、`ArrayIndexOutOfBoundsException` 等。
- **捕获和处理异常**：另一种常见情况是，在方法内部捕获了可能抛出的异常，并在方法内部处理它们，而不是通过 `throws` 子句将它们传递到调用者。这种情况下，方法可以处理异常而无需在方法签名中使用 `throws`。

---

### try-catch中的语句运行情况
`try` 块中的代码将按顺序执行，如果抛出异常，将在 `catch` 块中进行匹配和处理，然后程序将继续执行 `catch` 块之后的代码。如果没有匹配的 `catch` 块，异常将被传递给上一层调用的方法。

---

### `#try{return “a”} finally{return “b”}` 这条语句返回啥？
`finally` 块中的 `return` 语句会覆盖 `try` 块中的 `return` 返回，因此，该语句将返回 `"b"`。

## 1.10 Object

### == 与 equals 有什么区别？
对于字符串变量来说，使用 `"=="` 和 `"equals"` 比较字符串时，其比较方法不同：

- **"=="** 比较两个变量本身的值，即两个对象在内存中的首地址。
- **"equals"** 比较字符串包含内容是否相同。

对于非字符串变量来说，如果没有对 `equals()` 进行重写的话，`"=="` 和 `equals` 方法的作用是相同的，都是用来比较对象在堆内存中的首地址，即用来比较两个引用变量是否指向同一个对象。

- **==**：比较的是两个字符串内存地址（堆内存）的数值是否相等，属于数值比较；
- **equals()**：比较的是两个字符串的内容，属于内容比较。

---

### StringBuffer 和 StringBuilder 区别是什么？

#### 区别：
- **String** 是 Java 中基础且重要的类，被声明为 `final class`，是不可变字符串。由于其不可变性，拼接字符串时会产生很多无用的中间对象，如果频繁进行拼接会影响性能。
- **StringBuffer** 就是为了解决频繁拼接字符串时产生很多中间对象的问题而提供的一个类。它是一个线程安全的可修改的字符序列。它提供了 `append` 和 `insert` 方法，可以将字符串添加到已有序列的末尾或指定位置。
- **StringBuilder** 是 JDK1.5 发布的，它与 `StringBuffer` 本质上没有区别，区别在于 `StringBuilder` 去掉了保证线程安全的部分，减少了开销。

#### 线程安全：
- **StringBuffer**：线程安全。
- **StringBuilder**：线程不安全。

#### 速度：
- 一般情况下，速度从快到慢为：`StringBuilder > StringBuffer > String`，当然这是相对的，不是绝对的。

#### 使用场景：
- **操作少量的数据**：使用 `String`。
- **单线程操作大量数据**：使用 `StringBuilder`。
- **多线程操作大量数据**：使用 `StringBuffer`。

## 1.11 Java 1.8 新特性

### Java中Stream的API介绍

Java 8引入了Stream API，它提供了一种高效且易于使用的数据处理方式，特别适合集合对象的操作，如过滤、映射、排序等。Stream API不仅可以提高代码的可读性和简洁性，还能利用多核处理器的优势进行并行处理。让我们通过两个具体的例子来感受下Java Stream API带来的便利，对比在Stream API引入之前的传统做法。

#### 案例1：过滤并收集满足条件的元素

**问题场景**：从一个列表中筛选出所有长度大于3的字符串，并收集到一个新的列表中。

**没有Stream API的做法**：

~~~java
List<String> originalList = Arrays.asList("apple", "fig", "banana", "kiwi");
List<String> filteredList = new ArrayList<>();

for (String item : originalList) {
    if (item.length() > 3) {
        filteredList.add(item);
    }
}
~~~

这段代码需要显式地创建一个新的ArrayList，并通过循环遍历原列表，手动检查每个元素是否满足条件，然后添加到新列表中。

**使用Stream API的做法**：

~~~java
List<String> originalList = Arrays.asList("apple", "fig", "banana", "kiwi");
List<String> filteredList = originalList.stream()
                                        .filter(s -> s.length() > 3)
                                        .collect(Collectors.toList());
~~~

这里，我们直接在原始列表上调用 `.stream()` 方法创建了一个流，使用 `.filter()` 中间操作筛选出长度大于3的字符串，最后使用 `.collect(Collectors.toList())` 终端操作将结果收集到一个新的列表中。代码更加简洁明了，逻辑一目了然。

#### 案例2：计算列表中所有数字的总和

**问题场景**：计算一个数字列表中所有元素的总和。

**没有Stream API的做法**：

~~~java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = 0;
for (Integer number : numbers) {
    sum += number;
}
~~~

这个传统的 `for-each` 循环遍历列表中的每一个元素，累加它们的值来计算总和。

**使用Stream API的做法**：

~~~java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
                 .mapToInt(Integer::intValue)
                 .sum();
~~~

通过Stream API，我们可以先使用 `.mapToInt()` 将Integer流转换为IntStream（这是为了高效处理基本类型），然后直接调用 `.sum()` 方法来计算总和，极大地简化了代码。

### Stream流的并行API是什么？

并行流（ParallelStream）是Stream API中的一种扩展，它可以让流中的操作并行执行，从而提高处理效率。并行流通过将源数据分为多个子流对象进行多线程操作，然后将处理的结果再汇总为一个流对象来实现并行计算。

底层是通过使用通用的 ForkJoinPool 线程池来实现的，即将一个任务拆分成多个“小任务”并行计算，再把多个“小任务”的结果合并成总的计算结果。

#### 并行流的特点：
1. **多线程处理**：并行流会自动利用多个处理器核心，将任务分成多个子任务并行执行。
2. **ForkJoinPool**：它使用了 ForkJoinPool 线程池，并为每个CPU分配一个任务。
3. **数据分割**：并行流通过将数据拆分为多个子流来实现并行处理，最终将结果合并。

#### 使用并行流的注意事项：
- 对于**CPU密集型**的任务，使用并行流能够有效提高性能。
- 对于**I/O密集型**的任务，使用并行流的效果较差，可能并不适合使用并行流，因为 I/O 操作的瓶颈通常不在 CPU 上，线程的上下文切换可能反而导致性能下降。

#### 示例代码：

~~~java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
int sum = numbers.parallelStream()  // 使用并行流
                 .mapToInt(Integer::intValue)
                 .sum();
~~~

在这个例子中，`parallelStream()` 会将 `numbers` 列表的数据分成多个子任务进行并行计算，最终计算总和。

#### 小结：
- **并行流**通过多核处理器分配多个线程来提升任务的执行效率，尤其在处理大量数据时。
- 对于**I/O密集型**任务，通常不推荐使用并行流。


## 1.12 序列号
怎么把一个对象从一个jvm转移到另一个jvm?
使用序列化和反序列化：将对象序列化为字节流，并将其发送到另一个 JVM，然后在另一个 JVM 中反序列化字节流恢复对象。这可以通过 Java 的 ObjectOutputStream 和 ObjectInputStream 来实现。
使用消息传递机制：利用消息传递机制，比如使用消息队列（如 RabbitMQ、Kafka）或者通过网络套接字进行通信，将对象从一个 JVM 发送到另一个。这需要自定义协议来序列化对象并在另一个 JVM 中反序列化。
使用远程方法调用（RPC）：可以使用远程方法调用框架，如 gRPC，来实现对象在不同 JVM 之间的传输。远程方法调用可以让你在分布式系统中调用远程 JVM 上的对象的方法。
使用共享数据库或缓存：将对象存储在共享数据库（如 MySQL、PostgreSQL）或共享缓存（如 Redis）中，让不同的 JVM 可以访问这些共享数据。这种方法适用于需要共享数据但不需要直接传输对象的场景。

序列化和反序列化让你自己实现你会怎么做?
Java 默认的序列化虽然实现方便，但却存在安全漏洞、不跨语言以及性能差等缺陷。

无法跨语言： Java 序列化目前只适用基于 Java 语言实现的框架，其它语言大部分都没有使用 Java 的序列化框架，也没有实现 Java 序列化这套协议。因此，如果是两个基于不同语言编写的应用程序相互通信，则无法实现两个应用服务之间传输对象的序列化与反序列化。
容易被攻击：Java 序列化是不安全的，我们知道对象是通过在 ObjectInputStream 上调用 readObject() 方法进行反序列化的，这个方法其实是一个神奇的构造器，它可以将类路径上几乎所有实现了 Serializable 接口的对象都实例化。这也就意味着，在反序列化字节流的过程中，该方法可以执行任意类型的代码，这是非常危险的。
序列化后的流太大：序列化后的二进制流大小能体现序列化的性能。序列化后的二进制数组越大，占用的存储空间就越多，存储硬件的成本就越高。如果我们是进行网络传输，则占用的带宽就更多，这时就会影响到系统的吞吐量。
我会考虑用主流序列化框架，比如FastJson、Protobuf来替代Java 序列化。

如果追求性能的话，Protobuf 序列化框架会比较合适，Protobuf 的这种数据存储格式，不仅压缩存储数据的效果好， 在编码和解码的性能方面也很高效。Protobuf 的编码和解码过程结合.proto 文件格式，加上 Protocol Buffer 独特的编码格式，只需要简单的数据运算以及位移等操作就可以完成编码与解码。可以说 Protobuf 的整体性能非常优秀。

将对象转为二进制字节流具体怎么实现?
其实，像序列化和反序列化，无论这些可逆操作是什么机制，都会有对应的处理和解析协议，例如加密和解密，TCP的粘包和拆包，序列化机制是通过序列化协议来进行处理的，和 class 文件类似，它其实是定义了序列化后的字节流格式，然后对此格式进行操作，生成符合格式的字节流或者将字节流解析成对象。

在Java中通过序列化对象流来完成序列化和反序列化：

ObjectOutputStream：通过writeObject(）方法做序列化操作。
ObjectInputStrean：通过readObject()方法做反序列化操作。
只有实现了Serializable或Externalizable接口的类的对象才能被序列化，否则抛出异常！

实现对象序列化：

让类实现Serializable接口：
import java.io.Serializable;

public class MyClass implements Serializable {
    // class code
}

import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

MyClass obj = new MyClass();
try {
    FileOutputStream fileOut = new FileOutputStream("object.ser");
    ObjectOutputStream out = new ObjectOutputStream(fileOut);
    out.writeObject(obj);
    out.close();
    fileOut.close();
} catch (IOException e) {
    e.printStackTrace();
}


import java.io.FileInputStream;
import java.io.ObjectInputStream;

MyClass newObj = null;
try {
    FileInputStream fileIn = new FileInputStream("object.ser");
    ObjectInputStream in = new ObjectInputStream(fileIn);
    newObj = (MyClass) in.readObject();
    in.close();
    fileIn.close();
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}

通过以上步骤，对象obj会被序列化并写入到文件"object.ser"中，然后通过反序列化操作，从文件中读取字节流并恢复为对象newObj。这种方式可以方便地将对象转换为字节流用于持久化存储、网络传输等操作。需要注意的是，要确保类实现了Serializable接口，并且所有成员变量都是Serializable的才能被正确序列化。



## 1.13 设计模式

volatile和sychronized如何实现单例模式
public class SingleTon {

    // volatile 关键字修饰变量 防止指令重排序
    private static volatile SingleTon instance = null;
    private SingleTon(){}
     
    public static  SingleTon getInstance(){
        if(instance == null){
            //同步代码块 只有在第一次获取对象的时候会执行到 ，第二次及以后访问时 instance变量均非null故不会往下执行了 直接返回啦
            synchronized(SingleTon.class){
                if(instance == null){
                    instance = new SingleTon();
                }
            }
        }
        return instance;
    }
}
正确的双重检查锁定模式需要需要使用 volatile。volatile主要包含两个功能。

保证可见性。使用 volatile 定义的变量，将会保证对所有线程的可见性。
禁止指令重排序优化。
由于 volatile 禁止对象创建时指令之间重排序，所以其他线程不会访问到一个未初始化的对象，从而保证安全性。
代理模式和适配器模式有什么区别？
目的不同：代理模式主要关注控制对对象的访问，而适配器模式则用于接口转换，使不兼容的类能够一起工作。
结构不同：代理模式一般包含抽象主题、真实主题和代理三个角色，适配器模式包含目标接口、适配器和被适配者三个角色。
应用场景不同：代理模式常用于添加额外功能或控制对对象的访问，适配器模式常用于让不兼容的接口协同工作。

## 1.14 I/O
Java怎么实现网络IO高并发编程？
可以用 Java NIO ，是一种同步非阻塞的I/O模型，也是I/O多路复用的基础。

传统的BIO里面socket.read()，如果TCP RecvBuffer里没有数据，函数会一直阻塞，直到收到数据，返回读到的数据， 如果使用BIO要想要并发处理多个客户端的i/o，那么会使用多线程模式，一个线程专门处理一个客户端 io，这种模式随着客户端越来越多，所需要创建的线程也越来越多，会急剧消耗系统的性能。

NIO 是基于I/O多路复用实现的，它可以只用一个线程处理多个客户端I/O，如果你需要同时管理成千上万的连接，但是每个连接只发送少量数据，例如一个聊天服务器，用NIO实现会更好一些。
BIO、NIO、AIO区别是什么？
BIO（blocking IO）：就是传统的 java.io 包，它是基于流模型实现的，交互的方式是同步、阻塞方式，也就是说在读入输入流或者输出流时，在读写动作完成之前，线程会一直阻塞在那里，它们之间的调用是可靠的线性顺序。优点是代码比较简单、直观；缺点是 IO 的效率和扩展性很低，容易成为应用性能瓶颈。
NIO（non-blocking IO） ：Java 1.4 引入的 java.nio 包，提供了 Channel、Selector、Buffer 等新的抽象，可以构建多路复用的、同步非阻塞 IO 程序，同时提供了更接近操作系统底层高性能的数据操作方式。
AIO（Asynchronous IO） ：是 Java 1.7 之后引入的包，是 NIO 的升级版本，提供了异步非堵塞的 IO 操作方式，所以人们叫它 AIO（Asynchronous IO），异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。

NIO是怎么实现的？
NIO是一种同步非阻塞的IO模型，所以也可以叫NON-BLOCKINGIO。同步是指线程不断轮询IO事件是否就绪，非阻塞是指线程在等待IO的时候，可以同时做其他任务。

同步的核心就Selector（I/O多路复用），Selector代替了线程本身轮询IO事件，避免了阻塞同时减少了不必要的线程消耗；非阻塞的核心就是通道和缓冲区，当IO事件就绪时，可以通过写到缓冲区，保证IO的成功，而无需线程阻塞式地等待。

NIO由一个专门的线程处理所有IO事件，并负责分发。事件驱动机制，事件到来的时候触发操作，不需要阻塞的监视事件。线程之间通过wait,notify通信，减少线程切换。

NIO主要有三大核心部分：Channel(通道)，Buffer(缓冲区), Selector。传统IO基于字节流和字符流进行操作，而NIO基于Channel和Buffer(缓冲区)进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。

Selector(选择区)用于监听多个通道的事件（比如：连接打开，数据到达）。因此，单个线程可以监听多个数据通道。

你知道有哪个框架用到NIO了吗？
Netty。

Netty 的 I/O 模型是基于非阻塞 I/O 实现的，底层依赖的是 NIO 框架的多路复用器 Selector。采用 epoll 模式后，只需要一个线程负责 Selector 的轮询。当有数据处于就绪状态后，需要一个事件分发器（Event Dispather），它负责将读写事件分发给对应的读写事件处理器（Event Handler）。事件分发器有两种设计模式：Reactor 和 Proactor，Reactor 采用同步 I/O， Proactor 采用异步 I/O。
Reactor 实现相对简单，适合处理耗时短的场景，对于耗时长的 I/O 操作容易造成阻塞。Proactor 性能更高，但是实现逻辑非常复杂，适合图片或视频流分析服务器，目前主流的事件驱动模型还是依赖 select 或 epoll 来实现。

## 1.15 其他

有一个学生类，想按照分数排序，再按学号排序，应该怎么做？
可以使用Comparable接口来实现按照分数排序，再按照学号排序。首先在学生类中实现Comparable接口，并重写compareTo方法，然后在compareTo方法中实现按照分数排序和按照学号排序的逻辑。

public class Student implements Comparable<Student> {
    private int id;
    private int score;

    // 构造方法和其他属性、方法省略

    @Override
    public int compareTo(Student other) {
        if (this.score != other.score) {
            return Integer.compare(other.score, this.score); // 按照分数降序排序
        } else {
            return Integer.compare(this.id, other.id); // 如果分数相同，则按照学号升序排序
        }
    }
}
然后在需要对学生列表进行排序的地方，使用Collections.sort()方法对学生列表进行排序即可：

List<Student> students = new ArrayList<>();
// 添加学生对象到列表中
Collections.sort(students);


Native方法解释一下
在Java中，native方法是一种特殊类型的方法，它允许Java代码调用外部的本地代码，即用C、C++或其他语言编写的代码。native关键字是Java语言中的一种声明，用于标记一个方法的实现将在外部定义。

在Java类中，native方法看起来与其他方法相似，只是其方法体由native关键字代替，没有实际的实现代码。例如：
public class NativeExample {
    public native void nativeMethod();
}
要实现native方法，你需要完成以下步骤：

生成JNI头文件：使用javah工具从你的Java类生成C/C++的头文件，这个头文件包含了所有native方法的原型。
编写本地代码：使用C/C++编写本地方法的实现，并确保方法签名与生成的头文件中的原型匹配。
编译本地代码：将C/C++代码编译成动态链接库（DLL，在Windows上），共享库（SO，在Linux上）
加载本地库：在Java程序中，使用System.loadLibrary()方法来加载你编译好的本地库，这样JVM就能找到并调用native方法的实现了。