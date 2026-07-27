package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.AttemptResult;

public record TodayReviewLogItem(
        Long attemptId,
        Long problemId,
        Integer leetcodeId,
        String title,
        String url,
        AttemptResult result
) {}
