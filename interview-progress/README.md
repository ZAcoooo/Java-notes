# 模拟面试进度同步

通过 Git 在电脑版和手机版 Cursor 之间同步面试进度。

## 目录说明

| 文件 | 作用 |
|---|---|
| `INDEX.md` | 总览：当前章节、进度、下一题、累计得分 |
| `weak-points.md` | 薄弱点汇总，复习时优先看 |
| `sessions/*.md` | 每次面试会话的详细记录 |

## 手机端快速开始

### 1. 同步仓库

```text
git pull
```

确保拉到最新的 `interview-progress/` 和 `.cursor/skills/interview/`。

### 2. 发起面试（复制粘贴即可）

```text
/interview @xmind-md/1. Java基础篇.md

请先读取 @interview-progress/INDEX.md 和 @interview-progress/weak-points.md，
从 INDEX 里的「下一题」继续，不要重复已问过且已掌握的内容。
每答完一题，更新 INDEX.md、weak-points.md 和当前 session 文件。
```

### 3. 结束面试

```text
结束面试
```

Agent 会输出最终评价，并更新进度文件。

## 手机版 Cursor 与 Skill

- **项目内 Skill 会随 Git 同步**：本仓库的 `.cursor/skills/interview/SKILL.md` 在电脑和手机打开同一仓库后都可用。
- **用户级 Skill 不会自动同步**：`~/.cursor/skills-cursor/` 是本地配置，手机端默认没有你在电脑上装的那些 skill。
- **推荐做法**：把面试相关 skill 和进度文件都放在这个 Git 仓库里（已配置），不依赖用户级 skill。
- **Cursor Mobile（iOS）**：主要是监控 Agent、看 PR/代码 diff，聊天能力有，但不如桌面端完整。模拟面试完全可行，关键是 **git pull 同步进度文件**。

## 工作流建议

```text
电脑面试 → git commit + push
    ↓
手机 git pull → 继续同一章节
    ↓
手机答几题 → git commit + push
    ↓
电脑 git pull → 接着问
```

每次会话结束执行：

```powershell
git add interview-progress/
git commit -m "chore: update interview progress"
git push
```

## 章节对应

| 笔记文件 | 进度 session 命名 |
|---|---|
| `xmind-md/1. Java基础篇.md` | `sessions/*-Java基础篇.md` |
| `xmind-md/2. Java集合篇.md` | `sessions/*-Java集合篇.md` |
| 其他章节同理 | |
