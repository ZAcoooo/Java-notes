# 输出示例

## 输入

题：20. 有效的括号  
用户代码：栈 + ArrayDeque 匹配（见对话原文）。

---

## 【结论评价】

代码正确且已达最优，属于**栈**题型；时间 O(n)，空间 O(n)，最坏情况下栈存一半括号。

## 【修正 / 优化后的代码】

```java
class Solution {
    public boolean isValid(String s) {
        int n = s.length();
        if (n % 2 != 0) {
            return false;
        }

        Deque<Character> stack = new ArrayDeque<>();

        for (char ch : s.toCharArray()) {
            if (ch == '(') {
                stack.push(')');
            } else if (ch == '[') {
                stack.push(']');
            } else if (ch == '{') {
                stack.push('}');
            } else {
                if (stack.isEmpty() || stack.pop() != ch) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}
```

## 【面试级注释版】

```java
class Solution {
    public boolean isValid(String s) {
        int n = s.length();
        if (n % 2 != 0) {
            return false; // 奇数长度不可能配对
        }

        Deque<Character> stack = new ArrayDeque<>();

        for (char ch : s.toCharArray()) {
            if (ch == '(') {
                stack.push(')'); // 左括号：压入「期待的右括号」
            } else if (ch == '[') {
                stack.push(']');
            } else if (ch == '{') {
                stack.push('}');
            } else {
                // 右括号：必须与栈顶期待字符一致
                if (stack.isEmpty() || stack.pop() != ch) {
                    return false;
                }
            }
        }
        return stack.isEmpty(); // 不能剩未闭合的左括号
    }
}
```

## 【思路说明】

奇数长度可以直接判 false。遇到左括号，就把对应的右括号压栈，这样后面匹配时只要比对字符是否相等。遇到右括号，如果栈空或者和栈顶对不上，说明顺序错了。全部扫完后栈必须是空的，否则还有没配对的左括号。

## 【一句话核心原理】

用栈保存「每个未闭合左括号所期待的右括号」，右括号到来时与栈顶做一次匹配。

---

## Bug 示例（一句话结论写法）

原代码在 `stack.isEmpty()` 前未判断就 `pop`：

**【结论评价】** 原代码有误：空栈 pop 会异常；修正后正确，题型为栈，时间 O(n)，空间 O(n)。

---

## DP 示例（结论须点子类型）

**【结论评价】** 代码正确，属于**线性 DP / LIS（最长上升子序列）**；时间 O(n log n)，空间 O(n)，已是最优写法之一。
