# Java 知识点笔记

## 1. Java基础面试题

### 1.1 数据类型

## 2. Java集合面试题

### 数组与集合区别:

1. 长度：
   - 数组是固定长度的数据结构，一旦创建长度就无法改变。
   - 集合是动态长度的数据结构，可以根据需要动态增加或减少元素。
2. 内容：
   - 数组可以包含基本数据类型和对象。
   - 集合只能包含对象。
3. 访问元素方法：
   - 数组可以直接访问元素。
   - 集合需要通过迭代器或其他方法访问元素。

#### 一些Java集合类：

1. ArrayList：动态数组，实现了List接口，支持动态增长。
2. LinkedList：双向链表，也实现了List接口，支持快速的插入和删除操作。
3. HashMap：基于哈希表的Map实现，存储键值对，通过键快速查找值。
4. HashSet：基于HashMap实现的Set集合，用于存储唯一元素。
5. TreeMap：基于红黑树实现的有序Map集合，可以按照键的顺序进行排序。
6. LinkedHashMap：基于哈希表和双向链表实现的Map集合，保持插入顺序或访问顺序。
7. PriorityQueue：优先队列，可以按照比较器或元素的自然顺序进行排序。

### Java中的集合:

![Java集合汇总]()

#### List:

List是有序的Collection，使用此接口能够精确的控制每个元素的插入位置，用户能根据索引访问List中元素。常用的实现List的类有LinkedList，ArrayList，Vector，Stack。

    ● 有序意味着元素在 List 中的存储顺序是固定的，即元素的插入顺序会被保留。
    ● 你可以通过索引来访问 List 中的元素，这个索引就是元素在 List 中的顺序。

- ArrayList是容量可变的非线程安全列表，其底层使用数组实现。当几何扩容时，会创建更大的数组，并把原数组复制到新数组。ArrayList支持对元素的快速随机访问，但插入与删除速度很慢。
- LinkedList本质是一个双向链表，与ArrayList相比，其插入和删除速度更快，但随机访问速度更慢。

#### Set:

Set不允许存在重复的元素，与List不同，set中的元素是无序的。常用的实现有HashSet，LinkedHashSet和TreeSet。

    ● 无序意味着 Set 中的元素没有固定顺序，插入顺序和存储顺序不一定相同。不同的实现类可能会表现出不同的行为。
    ● HashSet：它没有任何顺序保证，元素的存储顺序可能会变化。插入顺序和输出顺序是完全不相关的。
    ● LinkedHashSet：它保持的是插入顺序。
    ● TreeSet：它是基于红黑树实现的，元素会根据自然顺序（或者通过指定的比较器）排序。

- HashSet通过HashMap实现，HashMap的Key即HashSet存储的元素，所有Key都是用相同的Value，一个名为PRESENT的Object类型常量。使用Key保证元素唯一性，但不保证有序性。由于HashSet是HashMap实现的，因此线程不安全。
- LinkedHashSet继承自HashSet，通过LinkedHashMap实现，使用双向链表维护元素插入顺序。
- TreeSet通过TreeMap实现的，添加元素到集合时按照比较规则将其插入合适的位置，保证插入后的集合仍然有序。

#### Map:

Map 是一个键值对集合，存储键、值和之间的映射。Key 无序，唯一；value 不要求有序，允许重复。Map 没有继承于 Collection 接口，从 Map 集合中检索元素时，只要给出键对象，就会返回对应的值对象。主要实现有TreeMap、HashMap、HashTable、LinkedHashMap、ConcurrentHashMap

- HashMap：JDK1.8 之前 HashMap 由数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突），JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树，以减少搜索时间
- LinkedHashMap：LinkedHashMap 继承自 HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- HashTable：数组+链表组成的，数组是 HashTable 的主体，链表则是主要为了解决哈希冲突而存在的
- TreeMap：红黑树（自平衡的排序二叉树）
- ConcurrentHashMap：Node数组+链表+红黑树实现，线程安全的（jdk1.8以前Segment锁，1.8以后volatile + CAS 或者 synchronized）

### Java中的线程安全的集合: