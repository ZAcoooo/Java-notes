package com.leetcode.tracker.service;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.entity.ProblemStatus;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class StatsService {

    private final ProblemRepository problemRepository;
    private final AttemptRepository attemptRepository;
    private final ReviewDashboardService reviewDashboardService;

    public StatsService(ProblemRepository problemRepository,
                        AttemptRepository attemptRepository,
                        ReviewDashboardService reviewDashboardService) {
        this.problemRepository = problemRepository;
        this.attemptRepository = attemptRepository;
        this.reviewDashboardService = reviewDashboardService;
    }

    public DashboardStats getDashboard() {
        long total = problemRepository.count();
        long attempted = attemptRepository.countDistinctProblems();
        long mastered = problemRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProblemStatus.MASTERED)
                .count();

        LocalDate today = LocalDate.now();
        int todayAttempts = attemptRepository.findByAttemptDateOrderByIdAsc(today).size();

        Map<String, int[]> categoryMap = new HashMap<>();
        problemRepository.findAll().forEach(p -> {
            int[] arr = categoryMap.computeIfAbsent(p.getCategory(), k -> new int[]{0, 0});
            arr[0]++;
            if (attemptRepository.countByProblemId(p.getId()) > 0) {
                arr[1]++;
            }
        });

        List<CategoryProgress> categoryProgress = categoryMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new CategoryProgress(e.getKey(), e.getValue()[0], e.getValue()[1]))
                .toList();

        Map<LocalDate, Integer> dailyMap = new HashMap<>();
        for (Object[] row : attemptRepository.countByDate()) {
            LocalDate d = toLocalDate(row[0]);
            dailyMap.put(d, ((Number) row[1]).intValue());
        }

        LocalDate heatmapStart = today.minusDays(364);
        while (heatmapStart.getDayOfWeek() != DayOfWeek.SUNDAY) {
            heatmapStart = heatmapStart.minusDays(1);
        }

        List<DailyCount> activityHeatmap = new ArrayList<>();
        for (LocalDate d = heatmapStart; !d.isAfter(today); d = d.plusDays(1)) {
            activityHeatmap.add(new DailyCount(d.toString(), dailyMap.getOrDefault(d, 0)));
        }

        List<DailyReviewItem> pendingReview = reviewDashboardService.getPendingReview(today);
        List<TodayReviewLogItem> todayReviews = reviewDashboardService.getTodayReviews(today);

        return new DashboardStats(
                (int) total,
                (int) attempted,
                (int) mastered,
                todayAttempts,
                categoryProgress,
                activityHeatmap,
                pendingReview,
                todayReviews,
                today.toString()
        );
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof java.sql.Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }
}
