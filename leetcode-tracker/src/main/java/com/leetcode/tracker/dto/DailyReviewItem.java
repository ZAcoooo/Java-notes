package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.OfficialDifficulty;

import java.time.LocalDate;

public record DailyReviewItem(
        Long id,
        Integer leetcodeId,
        String title,
        String url,
        String category,
        OfficialDifficulty officialDifficulty,
        LocalDate lastAttemptDate,
        int daysSince,
        int attemptCount
) {}
