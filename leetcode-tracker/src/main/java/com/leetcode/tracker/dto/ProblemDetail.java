package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.OfficialDifficulty;
import com.leetcode.tracker.entity.ProblemStatus;

import java.util.List;

public record ProblemDetail(
        Long id,
        Integer leetcodeId,
        String title,
        String url,
        OfficialDifficulty officialDifficulty,
        String category,
        ProblemStatus status,
        Integer myDifficulty,
        List<SolutionDto> solutions,
        List<AttemptDto> attempts,
        boolean custom
) {}
