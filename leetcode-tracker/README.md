# LeetCode Hot100 刷题记录

本地 Web 应用，用于记录 Hot100 刷题进度，支持**多种解法**、**多次刷题记录**、**Excel 导入**。

## 功能

- 内置 **110 道** Hot100 题目（题号、标题、分类、官方难度、LeetCode 链接）
- 每题可添加**多个解法**（思路、复杂度、代码片段、主解法标记）
- 每次刷题记录：日期、第一次/复习、结果、自评难度、手感、备注、使用的解法
- 仪表盘：总进度、分类进度、近 14 天刷题柱状图
- 从 `刷题-hot100.xlsx` 一键导入历史记录

## 环境要求

- **JDK 17+**（本机 `C:\Program Files\Java\jdk-17` 或 `jdk-22`）
- **MySQL 8.0**（已创建库 `leetcode_tracker`）
- Maven（项目 `tools/` 下可自动下载，首次需运行 `setup-maven.ps1`）

## 快速启动

```bat
cd E:\Java-notes\leetcode-tracker
start.bat
```

浏览器打开：**http://localhost:8080**

## 数据库

- 库名：`leetcode_tracker`
- 账号/密码见 `src/main/resources/application.yml`
- 首次启动自动建表并导入 Hot100 题库

## 项目结构

```
leetcode-tracker/
├── start.bat              # 一键启动
├── setup-maven.ps1        # 下载便携 Maven（仅首次）
├── src/main/java/         # Spring Boot 后端
├── src/main/resources/
│   ├── application.yml    # MySQL 配置
│   ├── data/hot100.json   # 内置题库
│   └── static/            # 原生前端页面
```

## API 概览

| 接口 | 说明 |
|------|------|
| `GET /api/stats/dashboard` | 仪表盘统计 |
| `GET /api/problems` | 题目列表（支持 category/status/keyword 筛选） |
| `GET /api/problems/{id}` | 题目详情（含解法 + 刷题历史） |
| `POST /api/problems/{id}/solutions` | 添加解法 |
| `POST /api/problems/{id}/attempts` | 新增刷题记录 |
| `POST /api/import/excel` | 导入 xlsx |

## 性能说明

- 按需启动：不用时关闭命令行窗口即可
- JVM 限制 256MB 内存
- 仅本地使用，无认证（勿暴露到公网）
