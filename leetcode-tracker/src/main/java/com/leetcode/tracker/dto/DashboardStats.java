package com.leetcode.tracker.dto;

import java.util.List;

public record DashboardStats(
        int totalProblems,
        int attemptedProblems,
        int masteredProblems,
        int todayAttempts,
        List<CategoryProgress> categoryProgress,
        List<DailyCount> activityHeatmap,
        List<DailyReviewItem> pendingReview,
        List<TodayReviewLogItem> todayReviews,
        String todayDate
) {}
