package com.leetcode.tracker.dto;

import com.leetcode.tracker.entity.Solution;

public record SolutionDto(
        Long id,
        String name,
        String approach,
        String timeComplexity,
        String spaceComplexity,
        String codeSnippet,
        Boolean isPrimary,
        Integer sortOrder
) {
    public static SolutionDto from(Solution s) {
        return new SolutionDto(
                s.getId(), s.getName(), s.getApproach(),
                s.getTimeComplexity(), s.getSpaceComplexity(),
                s.getCodeSnippet(), s.getIsPrimary(), s.getSortOrder()
        );
    }
}
