package com.leetcode.tracker.repository;

import com.leetcode.tracker.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolutionRepository extends JpaRepository<Solution, Long> {

    List<Solution> findByProblemIdOrderBySortOrderAscIdAsc(Long problemId);
}
