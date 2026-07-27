package com.leetcode.tracker.service;

import com.leetcode.tracker.dto.DailyReviewItem;
import com.leetcode.tracker.dto.TodayReviewLogItem;
import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReviewDashboardService {

    private final ProblemRepository problemRepository;
    private final AttemptRepository attemptRepository;

    public ReviewDashboardService(ProblemRepository problemRepository,
                                  AttemptRepository attemptRepository) {
        this.problemRepository = problemRepository;
        this.attemptRepository = attemptRepository;
    }

    /** 待复习：次数少优先，其次最久未刷；今天已刷过的排除，取前 3 题滚动补位 */
    public List<DailyReviewItem> getPendingReview(LocalDate today) {
        return problemRepository.findAll().stream()
                .map(p -> {
                    var attempts = attemptRepository.findByProblemIdOrderByAttemptDateDescIdDesc(p.getId());
                    if (attempts.isEmpty()) {
                        return null;
                    }
                    if (attempts.stream().anyMatch(a -> a.getAttemptDate().equals(today))) {
                        return null;
                    }
                    LocalDate lastDate = attempts.get(0).getAttemptDate();
                    return new PendingCandidate(p, lastDate, attempts.size());
                })
                .filter(c -> c != null)
                .sorted(Comparator
                        .comparingInt((PendingCandidate c) -> c.attemptCount)
                        .thenComparing(c -> c.lastDate))
                .limit(3)
                .map(c -> new DailyReviewItem(
                        c.problem.getId(),
                        c.problem.getLeetcodeId(),
                        c.problem.getTitle(),
                        c.problem.getUrl(),
                        c.problem.getCategory(),
                        c.problem.getOfficialDifficulty(),
                        c.lastDate,
                        (int) ChronoUnit.DAYS.between(c.lastDate, today),
                        c.attemptCount
                ))
                .toList();
    }

    /** 今日复习：今天以「复习」类型记录的题目 */
    public List<TodayReviewLogItem> getTodayReviews(LocalDate today) {
        return attemptRepository.findByAttemptDateOrderByIdAsc(today).stream()
                .filter(a -> a.getAttemptType() == AttemptType.REVIEW)
                .map(a -> {
                    Problem p = a.getProblem();
                    return new TodayReviewLogItem(
                            a.getId(), p.getId(), p.getLeetcodeId(),
                            p.getTitle(), p.getUrl(), a.getResult()
                    );
                })
                .toList();
    }

    private record PendingCandidate(Problem problem, LocalDate lastDate, int attemptCount) {}
}
