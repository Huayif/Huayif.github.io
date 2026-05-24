---
title: 动态规划从入门到精通
date: 2026-03-23
updated: 2026-03-23
categories: code
tags:
  - 算法
  - 动态规划
copyright: true
excerpt: 深入理解动态规划的核心思想，通过经典例题掌握状态定义、转移方程、空间优化等技巧。
---

## 1. 什么是动态规划？

动态规划（Dynamic Programming，简称 DP）是一种解决**多阶段决策最优化问题**的算法思想。

### 核心特征

DP 问题通常具备两个关键性质：

**1. 重叠子问题（Overlapping Subproblems）**

大问题可以分解为若干子问题，且子问题会被重复计算多次。

```
计算 fib(5)
    = fib(4) + fib(3)
    = (fib(3) + fib(2)) + (fib(2) + fib(1))
    = ((fib(2) + fib(1)) + fib(2)) + (fib(2) + fib(1))

可以看到 fib(3)、fib(2) 被重复计算了多次
```

**2. 最优子结构（Optimal Substructure）**

问题的最优解包含子问题的最优解。换句话说，可以通过子问题的最优解推导出原问题的最优解。

### DP vs 分治 vs 贪心

| 算法思想 | 子问题关系 | 特点 |
|---------|-----------|------|
| **分治** | 独立子问题 | 子问题不重叠，如快排、归并 |
| **贪心** | 无后效性 | 局部最优即全局最优 |
| **DP** | 重叠子问题 | 保存子问题结果，避免重复计算 |

---

## 2. DP 解题四步法

解决 DP 问题的标准流程：

### Step 1：定义状态

确定 `dp[i]` 或 `dp[i][j]` 代表的含义。这是最关键的一步。

```
例如：
- dp[i] 表示第 i 个位置的最优值
- dp[i][j] 表示前 i 个物品，背包容量为 j 时的最大价值
```

### Step 2：状态转移方程

找出状态之间的递推关系，即如何从已知状态推导出未知状态。

```
dp[i] = f(dp[i-1], dp[i-2], ...)
```

### Step 3：初始化

确定边界条件的值，通常是 dp 数组的初始几个元素。

### Step 4：确定遍历顺序

根据状态转移方程，确定计算 dp 数组的顺序（正序/倒序）。

---

## 3. 入门例题：斐波那契数列

### 问题描述

求第 n 个斐波那契数，F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)

### 解法演进

**方法一：暴力递归（指数级）**

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);  // 大量重复计算
}
// 时间复杂度：O(2^n)
```

**方法二：记忆化搜索（自顶向下）**

```cpp
vector<int> memo;

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];  // 已计算过，直接返回
    memo[n] = fib(n-1) + fib(n-2);       // 记忆化
    return memo[n];
}
// 时间复杂度：O(n)，空间复杂度：O(n)
```

**方法三：动态规划（自底向上）**

```cpp
int fib(int n) {
    if (n <= 1) return n;
    vector<int> dp(n+1);
    dp[0] = 0;  // 初始化
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];  // 状态转移
    }
    return dp[n];
}
```

**方法四：空间优化（滚动数组）**

观察发现 `dp[i]` 只依赖于前两个状态，不需要保存整个数组：

```cpp
int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0;  // dp[i-2]
    int prev1 = 1;  // dp[i-1]

    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;  // dp[i] = dp[i-1] + dp[i-2]
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
// 时间复杂度：O(n)，空间复杂度：O(1)
```

### 解题要点

1. **状态定义**：`dp[i]` 表示第 i 个斐波那契数
2. **转移方程**：`dp[i] = dp[i-1] + dp[i-2]`
3. **初始化**：`dp[0]=0, dp[1]=1`
4. **遍历顺序**：从小到大（依赖前面的状态）

---

## 4. 线性 DP：爬楼梯

### 问题描述

假设你正在爬楼梯，需要 n 阶才能到达楼顶。每次可以爬 1 或 2 个台阶，问有多少种不同的方法爬到楼顶？

### 分析

到达第 i 阶，只能从第 i-1 阶跨 1 步，或从第 i-2 阶跨 2 步。

```
第 i 阶的方法数 = 第 i-1 阶方法数 + 第 i-2 阶方法数
```

### 代码实现

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;

    // dp[i] 表示爬到第 i 阶的方法数
    vector<int> dp(n+1);
    dp[1] = 1;  // 1 阶：只有 [1] 一种
    dp[2] = 2;  // 2 阶：[1,1] 或 [2] 两种

    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

### 空间优化

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;

    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

### 扩展：可以爬 1/2/3 阶

```cpp
// dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
int climbStairs3(int n) {
    if (n <= 2) return n;
    if (n == 3) return 4;  // [1,1,1], [1,2], [2,1], [3]

    int prev3 = 1, prev2 = 2, prev1 = 4;
    for (int i = 4; i <= n; i++) {
        int curr = prev1 + prev2 + prev3;
        prev3 = prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

---

## 5. 背包问题（核心中的核心）

### 5.1 0-1 背包问题

#### 问题描述

有 n 个物品，第 i 个物品重量为 w[i]，价值为 v[i]。背包容量为 W，每个物品只能选一次，求能装入的最大价值。

#### 状态定义

`dp[i][j]` 表示：考虑前 i 个物品，背包容量为 j 时能获得的最大价值。

#### 状态转移

对于第 i 个物品，有两种选择：
1. **不选**：`dp[i][j] = dp[i-1][j]`（继承前 i-1 个物品的结果）
2. **选**：`dp[i][j] = dp[i-1][j-w[i]] + v[i]`（前提是 j >= w[i]）

```
dp[i][j] = max(dp[i-1][j], dp[i-1][j-w[i]] + v[i])  (j >= w[i])
dp[i][j] = dp[i-1][j]                               (j < w[i])
```

#### 代码实现（二维）

```cpp
int knapsack01(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    // dp[i][j]：前i个物品，容量j的最大价值
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= W; j++) {
            // 不选第i个物品
            dp[i][j] = dp[i-1][j];

            // 选第i个物品（注意下标转换：i-1是第i个物品在数组中的位置）
            if (j >= w[i-1]) {
                dp[i][j] = max(dp[i][j], dp[i-1][j-w[i-1]] + v[i-1]);
            }
        }
    }
    return dp[n][W];
}
```

#### 空间优化：滚动数组（一维）

观察状态转移方程，发现 `dp[i]` 只依赖于 `dp[i-1]`，可以用一维数组：

```cpp
int knapsack01(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    vector<int> dp(W+1, 0);

    for (int i = 0; i < n; i++) {
        // 必须倒序遍历！保证每个物品只用一次
        for (int j = W; j >= w[i]; j--) {
            dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
        }
    }
    return dp[W];
}
```

**为什么倒序？**

正序会导致物品被重复选取（变成完全背包）。倒序保证 `dp[j-w[i]]` 是上一轮（i-1）的值。

```
假设物品重量为2，容量为5

正序：dp[2] = max(dp[2], dp[0]+v)  ← 用到了本轮更新的dp[2]
       dp[4] = max(dp[4], dp[2]+v)  ← dp[2]已经是选过该物品的了！

倒序：dp[5] = max(dp[5], dp[3]+v)  ← dp[3]是上一轮的
       dp[4] = max(dp[4], dp[2]+v)  ← dp[2]是上一轮的
       dp[2] = max(dp[2], dp[0]+v)  ← 最后更新，不影响前面的
```

### 5.2 完全背包问题

#### 问题描述

与 0-1 背包的区别：每个物品可以选**无限次**。

#### 状态转移

```
dp[i][j] = max(dp[i-1][j], dp[i][j-w[i]] + v[i])
//           不选i         选i（还能继续选i，所以是dp[i]不是dp[i-1]）
```

#### 代码实现（一维）

```cpp
int completeKnapsack(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    vector<int> dp(W+1, 0);

    for (int i = 0; i < n; i++) {
        // 正序遍历！物品可以选多次
        for (int j = w[i]; j <= W; j++) {
            dp[j] = max(dp[j], dp[j-w[i]] + v[i]);
        }
    }
    return dp[W];
}
```

### 5.3 背包问题总结

| 类型 | 状态转移 | 遍历顺序 |
|-----|---------|---------|
| 0-1 背包 | `dp[j] = max(dp[j], dp[j-w]+v)` | 容量**倒序** |
| 完全背包 | `dp[j] = max(dp[j], dp[j-w]+v)` | 容量**正序** |
| 多重背包 | 二进制优化或单调队列 | 视情况而定 |

---

## 6. 区间 DP：最长回文子序列

### 问题描述

给定字符串 s，找到其中最长的回文子序列的长度。

子序列：不要求连续，但要保持相对顺序。

### 分析

**状态定义**：`dp[i][j]` 表示 s[i...j] 中最长回文子序列的长度。

**状态转移**：
- 如果 `s[i] == s[j]`：`dp[i][j] = dp[i+1][j-1] + 2`（两端相同，都选）
- 如果 `s[i] != s[j]`：`dp[i][j] = max(dp[i+1][j], dp[i][j-1])`（选其中一个）

### 代码实现

```cpp
int longestPalindromeSubseq(string s) {
    int n = s.size();
    // dp[i][j]：s[i..j]的最长回文子序列长度
    vector<vector<int>> dp(n, vector<int>(n, 0));

    // 初始化：单个字符是长度为1的回文
    for (int i = 0; i < n; i++) {
        dp[i][i] = 1;
    }

    // 遍历顺序：区间长度从小到大
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                dp[i][j] = dp[i+1][j-1] + 2;
            } else {
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    return dp[0][n-1];
}
```

### 关键技巧

**区间 DP 的遍历顺序**：
- 外层遍历区间长度（从小到大）
- 内层遍历左端点，计算右端点

因为计算 `dp[i][j]` 需要 `dp[i+1][j-1]`（更短的区间），所以按长度从小到大计算。

---

## 7. 双序列 DP：最长公共子序列（LCS）

### 问题描述

给定两个字符串 text1 和 text2，返回它们的最长公共子序列的长度。

### 分析

**状态定义**：`dp[i][j]` 表示 text1[0...i-1] 和 text2[0...j-1] 的 LCS 长度。

**状态转移**：
- 如果 `text1[i-1] == text2[j-1]`：`dp[i][j] = dp[i-1][j-1] + 1`
- 否则：`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

### 代码实现

```cpp
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    // dp[i][j]：text1[0..i-1]和text2[0..j-1]的LCS长度
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}
```

### 空间优化

```cpp
int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    // 只保存两行
    vector<int> prev(n+1, 0), curr(n+1, 0);

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1]) {
                curr[j] = prev[j-1] + 1;
            } else {
                curr[j] = max(prev[j], curr[j-1]);
            }
        }
        swap(prev, curr);
    }
    return prev[n];
}
```

---

## 8. 编辑距离

### 问题描述

给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。

你可以对一个单词进行如下三种操作：
- 插入一个字符
- 删除一个字符
- 替换一个字符

### 分析

**状态定义**：`dp[i][j]` 表示 word1[0...i-1] 转换成 word2[0...j-1] 的最少操作数。

**状态转移**：
- 如果 `word1[i-1] == word2[j-1]`：不需要操作，`dp[i][j] = dp[i-1][j-1]`
- 如果不等，三种操作取最小：
  - 插入：`dp[i][j] = dp[i][j-1] + 1`（在 word1 末尾插入 word2[j-1]）
  - 删除：`dp[i][j] = dp[i-1][j] + 1`（删除 word1[i-1]）
  - 替换：`dp[i][j] = dp[i-1][j-1] + 1`（把 word1[i-1] 换成 word2[j-1]）

### 代码实现

```cpp
int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));

    // 初始化：一个空串转换成另一个串
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // 删除i个字符
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // 插入j个字符

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = min({
                    dp[i-1][j] + 1,      // 删除
                    dp[i][j-1] + 1,      // 插入
                    dp[i-1][j-1] + 1     // 替换
                });
            }
        }
    }
    return dp[m][n];
}
```

---

## 9. 状态压缩 DP

### 应用场景

当 DP 状态是集合时，可以用二进制位表示集合状态（状态压缩）。

### 经典问题：旅行商问题（TSP）

有 n 个城市，从城市 0 出发，访问每个城市恰好一次后回到起点，求最短路径。

**状态定义**：`dp[mask][i]` 表示：
- `mask`：二进制数，第 j 位为 1 表示城市 j 已访问
- `i`：当前所在城市
- 值：从 0 出发，访问 mask 中所有城市，最终到达 i 的最短距离

**状态转移**：
```
dp[mask][i] = min(dp[mask^(1<<i)][j] + dist[j][i])
其中 j 是 mask 中除 i 外的其他城市
```

**代码框架**：

```cpp
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int ALL = 1 << n;  // 所有状态数

    // dp[mask][i]: 已访问mask中的城市，当前在i的最短距离
    vector<vector<int>> dp(ALL, vector<int>(n, INT_MAX));
    dp[1][0] = 0;  // 从城市0出发

    for (int mask = 1; mask < ALL; mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;  // i不在mask中
            if (dp[mask][i] == INT_MAX) continue;

            // 尝试去下一个城市j
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;  // j已访问过
                int next_mask = mask | (1 << j);
                dp[next_mask][j] = min(dp[next_mask][j],
                                       dp[mask][i] + dist[i][j]);
            }
        }
    }

    // 返回起点
    int ans = INT_MAX;
    for (int i = 1; i < n; i++) {
        ans = min(ans, dp[ALL-1][i] + dist[i][0]);
    }
    return ans;
}
// 时间复杂度：O(2^n * n^2)
```

---

## 10. DP 解题技巧总结

### 1. 状态定义技巧

| 问题类型 | 常见状态定义 |
|---------|-------------|
| 线性序列 | `dp[i]` 表示前 i 个元素的最优值 |
| 两个序列 | `dp[i][j]` 表示序列1前i个和序列2前j个的最优值 |
| 区间问题 | `dp[i][j]` 表示区间 [i,j] 的最优值 |
| 背包问题 | `dp[j]` 或 `dp[i][j]` 表示容量/体积的最优值 |
| 状态压缩 | `dp[mask][i]` mask 表示集合状态 |

### 2. 常见优化技巧

**空间优化**：
```cpp
// 二维转一维（滚动数组）
for (...) {
    for (int j = ...; j >= ...; j--) {  // 注意遍历顺序
        dp[j] = max(dp[j], dp[j-w] + v);
    }
}
```

**单调队列优化**：用于滑动窗口最值问题
**前缀和优化**：用于区间和问题
**矩阵快速幂**：用于线性递推加速

### 3. 如何判断是否是 DP 问题？

1. **求最值**：最大值、最小值、最长、最短
2. **求方案数**：有多少种方法、多少种路径
3. **可行性判断**：能否达到某个状态
4. **问题可分解**：大问题能拆分成相似的子问题

### 4. 常见错误

1. **状态定义不清**：不知道 dp[i] 代表什么
2. **转移方程错误**：漏了某些情况或逻辑不对
3. **初始化错误**：边界条件没处理好
4. **遍历顺序错误**：正序/倒序搞混
5. **数组越界**：没注意下标范围

---

## 11. 总结

动态规划的核心思想：**用空间换时间，记住已解决的子问题**。

掌握 DP 的关键：
1. 多做题，培养 DP 思维
2. 重视状态定义，这是最难也是最重要的一步
3. 画出状态转移图，帮助理解
4. 从递归+记忆化入手，再改成递推
5. 注意空间优化，很多面试题要求 O(1) 或 O(n) 空间

推荐练习顺序：
1. 线性 DP（斐波那契、爬楼梯、打家劫舍）
2. 背包问题（0-1、完全、多重）
3. 区间 DP（回文、石子合并）
4. 树形 DP（树上最大独立集）
5. 状态压缩 DP（TSP、棋盘覆盖）
