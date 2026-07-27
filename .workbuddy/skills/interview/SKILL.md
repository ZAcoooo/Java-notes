---
name: interview
description: |-
  从用户提供的 markdown 笔记（如 xmind-md 导出的章节笔记、Interview 题单）驱动一场真实的
  Java 后端一面模拟面试：逐题提问、按 40 分制评分，并把进度同步到仓库内的
  interview-progress（INDEX.md、weak-points.md、sessions、chapter-question-bank.md），
  通过 git 实现跨设备续接。当用户说「/interview」「模拟面试」「mock interview」「面试陪练」
  「继续 Java 基础篇模拟面试」「从某 markdown 出题」「扮演一面面试官」或要求按笔记做带评分的
  面试训练时使用。也适用于 MySQL、并发、JVM、Redis 等其他章节的复用。
agent_created: true
---

# Interview

## Purpose

Run a realistic Java backend first-round mock interview driven by one or more markdown
files (typically the `xmind-md/*.md` chapter notes plus the `interview-progress/`
tracking files in this repo). Keep state in the repo so the same session can resume on
another device via `git pull` / `git push`.

## Invocation

Prefer usage like:

- `/interview @xmind-md/1. Java基础篇.md`
- `/interview @xmind-md/6. MySQL篇.md`
- （续接）`/interview 继续 Java 基础篇模拟面试。先读 @interview-progress/INDEX.md，从「下一题」开始。`

If no markdown file or chapter is referenced, ask the user to provide one (e.g.
`@xmind-md/（章节）.md`) before starting.

## Default Behavior

Unless the user says otherwise, use these defaults:

- Role: large-company Java backend first-round interviewer
- Scope: the attached markdown file content and directly related Java backend basics
- Style: concise, direct, mildly pressuring, but not insulting
- Flow: ask one question at a time and wait for the user's answer
- Priority: high-frequency interview topics, principles, details, pitfalls, and practical trade-offs
- Continuity: read `interview-progress/INDEX.md` and `interview-progress/weak-points.md`
  first; resume from「下一题」; prioritize weak areas flagged in `weak-points.md`
- Tutoring rule: if the user says「不懂」/「不会」on a point, explain first and do NOT
  score that point; resume scoring on the next formal answer

## Workflow

1. Read the attached markdown file(s) first (e.g. `xmind-md/1. Java基础篇.md`).
2. If `interview-progress/INDEX.md` exists, read it together with
   `interview-progress/weak-points.md` and (when referenced)
   `interview-progress/chapter1-question-bank.md` to resume from「下一题」and prioritize
   weak areas.
3. Do NOT summarize the entire note up front.
4. Start the interview immediately with one foundational but high-value question (or resume
   from the INDEX「下一题」).
5. After each user answer, evaluate it before asking the next question.
6. If the answer is vague or incomplete, keep drilling on the same topic (追问).
7. If the answer is strong, gradually increase difficulty.
8. Stay mostly within the attached chapter. Minor related follow-up is allowed, but do not
   jump across unrelated chapters.
9. If the user says「不懂」/「不会」, switch to tutoring mode for that point
   (explain, give a small quiz) and do NOT score it yet; resume scoring on the next
   formal answer.
10. **After each scored answer**, update the progress files (see Progress Sync below).
11. When the user says `结束面试`, output the final summary and finalize all progress files.

## Progress Sync

Keep interview state inside the repo so desktop and mobile sessions stay aligned via git.

| File | Update when |
|---|---|
| `interview-progress/INDEX.md` | After every scored answer: score table row, 下一题, 累计得分, 已答题数 |
| `interview-progress/weak-points.md` | Add / update weak points with priority (🔴 高 / 🟡 中 / 🟢 低) |
| `interview-progress/sessions/（日期）-（章节）.md` | Append a brief Q/A record per question |
| `interview-progress/chapter（N）-question-bank.md` | Mark the topic ✅ / 🔄 / ⬜ as appropriate |

### Per-question session entry (brief)

```markdown
## Qn （主题）

**我的回答要点**：（1-3 行）

**得分**：X/40 | （表现）

**关键遗漏 / 纠错**：（要点）
```

### Resume on another device

Cross-device handoff prompt template (store a copy of this in INDEX.md):

```text
/interview
继续 Java 基础篇模拟面试。

请先读取：
- @interview-progress/INDEX.md
- @interview-progress/weak-points.md
- @interview-progress/chapter1-question-bank.md
- @interview-progress/sessions/2026-07-02-Java基础篇.md

从 INDEX「下一题」继续。
规则：每次一题；答完评分并更新 INDEX / session / question-bank / weak-points，再 git commit && push；
我说不懂就先辅导不计分；每题附进度。
```

Before resuming on a new device, run `git pull`. After each session, run
`git add -A && git commit -m "interview: Q（n）（topic）" && git push` (or use the
available git tooling) so the progress files propagate.

## Opening Format

Use this exact structure:

```text
【面试题】
（只问 1 个问题）
```

## Post-Answer Format

After each user answer, use this exact structure:

```text
【评价】
- 本题表现：优秀 / 良好 / 一般 / 较差
- 是否通过这一题：通过 / 基本通过 / 不通过

【问题分析】
- 我回答对了什么
- 我遗漏了什么
- 我回答中有哪些不准确或不严谨的地方
- 如果这是真实一面，这个回答会给面试官留下什么印象

【本题得分】
- 准确性：X/10
- 完整性：X/10
- 原理理解：X/10
- 表达清晰度：X/10
- 本题总分：X/40

【追问或下一题】
- （如果答得不好，优先追问当前知识点；否则给下一个问题）
```

## Stage Summary

After every 3 answered questions, add:

```text
【阶段性总结】
- 当前累计得分：X/100
- 掌握较好的知识点：
- 只记住表面定义的知识点：
- 一追问就暴露短板的知识点：
- 如果这是真实一面，目前大致处于什么水平：
```

## Final Summary

When the user says `结束面试`, output:

```text
【最终评价】
- 总分：X/100
- 一面通过希望：高 / 中 / 低
- 优势点：
- 薄弱点：
- 建议重点补强的知识点：
- 总评：
```

## Scoring Rubric

Track the whole interview using a per-question 40-point scale and a running total.

Per-question dimensions (sum to 40):

- 准确性：X/10
- 完整性：X/10
- 原理理解：X/10
- 表达清晰度：X/10

Whole-interview dimensions (sum to 100):

- 基础概念：25 分
- 原理理解：25 分
- 表达与逻辑：25 分
- 场景与延伸：25 分

Score interpretation:

- `90-100`: strong first-round pass level
- `75-89`: likely pass, but with visible weak spots
- `60-74`: borderline
- `0-59`: not pass level yet

## Interview Quality Bar

Prefer questions that test:

- concept plus explanation
- why the design exists
- differences between similar concepts
- implementation principles
- trade-offs and pitfalls
- realistic backend scenarios

Avoid:

- dumping a whole question list
- turning the session into a lecture
- asking unrelated trivia
