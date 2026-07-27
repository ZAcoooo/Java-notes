package com.leetcode.tracker.dto;

import jakarta.validation.constraints.Size;

public record UpdateSolutionRequest(
        @Size(max = 100) String name,
        String approach,
        @Size(max = 50) String timeComplexity,
        @Size(max = 50) String spaceComplexity,
        String codeSnippet,
        Boolean isPrimary,
        Integer sortOrder
) {}
