package com.leetcode.tracker.repository;

import com.leetcode.tracker.entity.Problem;
import com.leetcode.tracker.entity.ProblemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem> findByLeetcodeId(Integer leetcodeId);

    boolean existsByLeetcodeId(Integer leetcodeId);

    long countByStatusNot(ProblemStatus status);

    List<Problem> findByCategoryOrderByLeetcodeIdAsc(String category);

    @Query("SELECT p.category, COUNT(p) FROM Problem p GROUP BY p.category ORDER BY p.category")
    List<Object[]> countByCategory();

    @Query("SELECT p FROM Problem p LEFT JOIN FETCH p.attempts WHERE p.id = :id")
    Optional<Problem> findByIdWithAttempts(Long id);

    @Query("SELECT p FROM Problem p LEFT JOIN FETCH p.solutions WHERE p.id = :id")
    Optional<Problem> findByIdWithSolutions(Long id);
}
