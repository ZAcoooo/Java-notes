# Java 知识点笔记

## 1. Java基础面试题

### 1.1 

---

## 2. Java集合面试题

### 2.1 数组与集合区别:

1. **长度**：
   - **数组**：固定长度的数据结构，一旦创建长度就无法改变。
   - **集合**：动态长度的数据结构，可以根据需要动态增加或减少元素。
   
2. **内容**：
   - **数组**：可以包含基本数据类型和对象。
   - **集合**：只能包含对象。

3. **访问元素方法**：
   - **数组**：可以直接访问元素。
   - **集合**：需要通过迭代器或其他方法访问元素。

#### 一些Java集合类：

1. **ArrayList**：动态数组，实现了 `List` 接口，支持动态增长。
2. **LinkedList**：双向链表，也实现了 `List` 接口，支持快速的插入和删除操作。
3. **HashMap**：基于哈希表的 `Map` 实现，存储键值对，通过键快速查找值。
4. **HashSet**：基于 `HashMap` 实现的 `Set` 集合，用于存储唯一元素。
5. **TreeMap**：基于红黑树实现的有序 `Map` 集合，可以按照键的顺序进行排序。
6. **LinkedHashMap**：基于哈希表和双向链表实现的 `Map` 集合，保持插入顺序或访问顺序。
7. **PriorityQueue**：优先队列，可以按照比较器或元素的自然顺序进行排序。

---

### 2.2 Java中的集合:

![Java集合汇总](https://raw.githubusercontent.com/ZAcoooo/Java-notes/refs/heads/main/images/Java-Collections-Summary.webp)

#### List:

`List` 是有序的 `Collection`，使用此接口能够精确控制每个元素的插入位置，用户可以根据索引访问 `List` 中元素。

- **有序**：元素在 `List` 中的存储顺序是固定的，即元素的插入顺序会被保留。
- **索引访问**：通过索引可以访问 `List` 中的元素，索引即元素在 `List` 中的顺序。

常用的实现类：

- **ArrayList**：容量可变的非线程安全列表，底层使用数组实现。支持快速随机访问，但插入和删除速度较慢。
  - **底层实现**：使用数组实现。
  - **扩容机制**：当数组容量满时，`ArrayList` 会将数组扩容到原来容量的 1.5 倍。
  - **查询效率**：支持随机访问，查询效率高。
  - **插入和删除操作**：插入或删除操作需要移动元素，速度较慢。


- **LinkedList**：本质是双向链表，插入和删除速度更快，但随机访问速度较慢。
  - **底层实现**：使用双向链表实现。
  - **查询效率**：不支持随机访问，查询效率低。
  - **插入和删除操作**：在链表的任意位置插入和删除元素效率较高，因为不需要移动其他元素。


#### Set:

`Set` 不允许存在重复的元素，与 `List` 不同，`Set` 中的元素是无序的。

- **无序**：`Set` 中的元素没有固定顺序，插入顺序和存储顺序不一定相同。不同的实现类可能会表现出不同的行为。

常用的实现类：

- **HashSet**：基于 `HashMap` 实现，没有顺序保证，元素的存储顺序可能会变化。由于 `HashSet` 是 `HashMap` 实现的，因此线程不安全。`HashMap` 的 Key 即 `HashSet` 存储的元素，所有 Key 都是用相同的 Value，一个名为 `PRESENT` 的 `Object` 类型常量（表示元素存在）。
  - **底层实现**：使用 `HashMap` 实现。
  - **唯一性**：通过 `HashMap` 的 Key 保证元素唯一性。
  - **无序性**：元素的存储顺序可能会变化，无法保证插入顺序。

- **LinkedHashSet**：继承自 `HashSet`，通过 `LinkedHashMap` 实现，使用双向链表维护元素的插入顺序。
  - **底层实现**：继承自 `HashSet`，使用 `LinkedHashMap` 实现。
  - **有序性**：保持插入顺序。每个元素有两个指针，一个指向上一个元素，一个指向下一个元素。

- **TreeSet**：基于 `TreeMap` 实现，元素按照自然顺序或指定的比较器排序。
  - **底层实现**：通过 `TreeMap` 实现，元素根据自然顺序或通过指定的比较器进行排序。
  - **有序性**：元素会根据比较规则自动排序。
  - **性能**：查找、插入和删除操作的时间复杂度为 O(log n)，效率较高。

#### Map:

`Map` 是一个键值对集合，存储键、值及它们之间的映射。`Key` 无序且唯一；`Value` 不要求有序，允许重复。

- **无序性**：`Map` 中的元素的键 (`Key`) 是无序的且唯一。每个键对应一个值 (`Value`)，值可以重复，但键不能重复。
- **索引访问**：没有继承 `Collection` 接口，从 `Map` 集合中检索元素时，只需提供 `Key` 键对象，就会返回对应的 `Value` 值对象。

常用的实现类：

- **HashMap**：JDK 1.8 之前，`HashMap` 由数组和链表组成，数组是 `HashMap` 的主体，链表则主要解决哈希冲突（“拉链法”解决冲突）。JDK 1.8 以后，`HashMap` 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树，减少搜索时间。
  - **底层实现**：由数组和链表组成。
  - **哈希冲突处理**：使用链表解决哈希冲突，JDK 1.8 后，当链表长度超过阈值时，转换为红黑树，提升性能。
  - **线程安全性**：`HashMap` 是非线程安全的。

- **LinkedHashMap**：`LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构（即由数组和链表或红黑树组成）。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
  - **底层实现**：继承自 `HashMap`，增加了双向链表。
  - **有序性**：保持插入顺序或访问顺序。

- **Hashtable**：数组和链表组成，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的。`Hashtable` 是线程安全的，但性能较差，现已不推荐使用。
  - **底层实现**：数组和链表实现。
  - **线程安全**：每个方法都使用 `synchronized` 锁，性能较差。
  - **不支持 `null` 键和值**：与 `HashMap` 不同，不允许使用 `null` 键或值。

- **TreeMap**：基于红黑树的有序 `Map` 实现，元素根据自然顺序或指定的比较器排序。
  - **底层实现**：基于红黑树。
  - **有序性**：元素根据自然顺序或通过指定的比较器进行排序。
  - **性能**：查找、插入和删除操作的时间复杂度为 O(log n)。

- **ConcurrentHashMap**：线程安全的 `Map`，底层由节点数组、链表和红黑树组成。JDK 1.8 以前使用 `Segment` 锁，1.8 以后使用 `volatile` + `CAS` 或 `synchronized` 实现线程安全。
  - **底层实现**：Node 数组、链表和红黑树。
  - **线程安全性**：通过分段锁、`volatile` 和 `CAS` 操作确保线程安全。
  - **性能**：相比 `Hashtable` 和 `synchronized` 的 `HashMap`，`ConcurrentHashMap` 更高效。

---

### 2.3 Java中的线程安全的集合：

#### 在 `java.util` 包中的线程安全的类主要有 2 个，其他都是非线程安全的。

- **Vector**：线程安全的动态数组，其内部方法基本都经过 `synchronized` 修饰。如果不需要线程安全，不建议使用 `Vector`，因为同步会带来额外的性能开销。
  - `Vector` 内部是使用对象数组来保存数据，可以根据需要自动增加容量。当数组已满时，会创建新的数组，并拷贝原有数组的数据。

- **Hashtable**：线程安全的哈希表。`Hashtable` 的加锁方法是给每个方法加上 `synchronized` 关键字，这样锁住的是整个 `Table` 对象。不支持 `null` 键和值，由于同步带来的性能开销，`Hashtable` 已经很少被推荐使用。如果需要保证线程安全的哈希表，推荐使用 `ConcurrentHashMap`。

#### `java.util.concurrent` 包提供的都是线程安全的集合：

##### 并发 Map：

- **ConcurrentHashMap**：
  - 它与 `HashTable` 的主要区别是加锁粒度的不同。
  - 在 JDK 1.7，`ConcurrentHashMap` 使用的是分段锁（Segment 锁），每个 Segment 含有整个 table 的一部分，这样不同分段之间的并发操作互不影响。
  - 在 JDK 1.8，取消了 Segment 字段，直接在 table 元素上加锁，进一步减小了并发冲突的概率。
  - 对于 `put` 操作：
    - 如果 Key 对应的数组元素为 `null`，则通过 CAS（Compare and Swap）操作将其设置为当前值。
    - 如果 Key 对应的数组元素（链表表头或树的根元素）不为 `null`，则对该元素使用 `synchronized` 关键字申请锁，然后进行操作。
    - 如果该 `put` 操作使得当前链表长度超过一定阈值，则将该链表转换为红黑树，提高寻址效率。

- **ConcurrentSkipListMap**：
  - 实现了一个基于 SkipList（跳表）算法的可排序的并发集合。
  - SkipList 是一种可以在对数预期时间内完成搜索、插入、删除等操作的数据结构，通过维护多个指向其他元素的“跳跃”链接来实现高效查找。

##### 并发 Set：

- **ConcurrentSkipListSet**：
  - 是线程安全的有序集合，底层使用 `ConcurrentSkipListMap` 实现。

- **CopyOnWriteArraySet**：
  - 是线程安全的 Set 实现，是线程安全的无序集合，可以理解为线程安全的 `HashSet`。
  - `CopyOnWriteArraySet` 和 `HashSet` 都继承自共同的父类 `AbstractSet`，但它们的实现不同：
    - `HashSet` 是通过“散列表”实现的。
    - `CopyOnWriteArraySet` 是通过“动态数组（`CopyOnWriteArrayList`）”实现的，而不是散列表。

#### 并发 List：

- **CopyOnWriteArrayList**：
  - 它是 `ArrayList` 的线程安全的变体，其中所有写操作（`add`、`set` 等）都通过对底层数组进行全新复制来实现，允许存储 `null` 元素。
  - 即当对象进行写操作时，使用了 `Lock` 锁做同步处理，内部拷贝了原数组，并在新数组上进行添加操作，最后将新数组替换掉旧数组；若进行的读操作，则直接返回结果，操作过程中不需要进行同步。

#### 并发 Queue：

- **ConcurrentLinkedQueue**：
  - 是一个适用于高并发场景下的队列，它通过无锁的方式（CAS）实现了高并发状态下的高性能。
  - 通常，`ConcurrentLinkedQueue` 的性能要好于 `BlockingQueue`。

- **BlockingQueue**：
  - 与 `ConcurrentLinkedQueue` 的使用场景不同，`BlockingQueue` 的主要功能并不是在于提升高并发时的队列性能，而在于简化多线程间的数据共享。
  - `BlockingQueue` 提供一种读写阻塞等待的机制：
    - 如果消费者速度较快，则 `BlockingQueue` 可能被清空，此时消费线程再试图从 `BlockingQueue` 读取数据时就会被阻塞。
    - 反之，如果生产线程较快，则 `BlockingQueue` 可能会被装满，此时生产线程再试图向 `BlockingQueue` 队列装入数据时，会被阻塞等待。

#### 并发 Deque：

- **LinkedBlockingDeque**：
  - 是一个线程安全的双端队列实现。它的内部使用链表结构，每一个节点都维护了一个前驱节点和一个后驱节点。
  - `LinkedBlockingDeque` 没有进行读写锁的分离，因此同一时间只能有一个线程对其进行操作。

- **ConcurrentLinkedDeque**：
  - `ConcurrentLinkedDeque` 是一种基于链接节点的无限并发链表。可以安全地并发执行插入、删除和访问操作。
  - 当许多线程同时访问一个公共集合时，`ConcurrentLinkedDeque` 是一个合适的选择。

---

### 2.4 Collections和Collection的区别：

- **Collection** 是 Java 集合框架中的一个接口，它是所有集合类的基础接口。它定义了一组通用的操作和方法，如添加、删除、遍历等，用于操作和管理一组对象。`Collection` 接口有许多实现类，如 `List`、`Set` 和 `Queue` 等。

- **Collections**（注意有一个s）是 Java 提供的一个工具类，位于 `java.util` 包中。它提供了一系列静态方法，用于对集合进行操作和算法。`Collections` 类中的方法包括排序、查找、替换、反转、随机化等等。这些方法可以对实现了 `Collection` 接口的集合进行操作，如 `List` 和 `Set`。

---

### 2.5 集合遍历的方法：

- **普通 for 循环**：可以使用带有索引的普通 `for` 循环来遍历 `List`。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   for (int i = 0; i < list.size(); i++) {
      String element = list.get(i);
      System.out.println(element);
   }
   ```

- **增强 for 循环（for-each 循环）**：用于循环访问数组或集合中的元素，简化了迭代过程。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   for (String element : list) {
      System.out.println(element);
   }
   ```

- **Iterator 迭代器**：可以使用迭代器来遍历集合，特别适用于需要删除元素的情况，避免了 `ConcurrentModificationException`。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   Iterator<String> iterator = list.iterator();
   while(iterator.hasNext()) {
      String element = iterator.next();
      System.out.println(element);
   }
   ```

- **ListIterator 列表迭代器**：`ListIterator` 是 `Iterator` 的子类，支持双向访问列表，并且可以在迭代过程中修改元素。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   ListIterator<String> listIterator= list.listIterator();
   while(listIterator.hasNext()) {
      String element = listIterator.next();
      System.out.println(element);
   }
   ```

- **使用 forEach 方法**：Java 8 引入了 `forEach` 方法，可以对集合进行快速遍历，简化了代码，支持传入 Lambda 表达式。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   list.forEach(element -> System.out.println(element));
   ```

- **Stream API**：Java 8 的 `Stream` API 提供了丰富的函数式操作，可以对集合进行过滤、映射等操作，支持链式调用。
   ```java
   List<String> list = new ArrayList<>();
   list.add("A");
   list.add("B");
   list.add("C");

   list.stream().forEach(element -> System.out.println(element));
   ```
