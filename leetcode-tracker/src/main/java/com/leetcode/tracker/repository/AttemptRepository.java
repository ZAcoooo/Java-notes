package com.leetcode.tracker.repository;

import com.leetcode.tracker.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {

    List<Attempt> findByProblemIdOrderByAttemptDateDescIdDesc(Long problemId);

    Optional<Attempt> findTopByProblemIdOrderByAttemptNoDesc(Long problemId);

    int countByProblemId(Long problemId);

    @Query("SELECT a.attemptDate, COUNT(a) FROM Attempt a GROUP BY a.attemptDate ORDER BY a.attemptDate DESC")
    List<Object[]> countByDate();

    List<Attempt> findByAttemptDateOrderByIdAsc(LocalDate date);

    @Query("SELECT a FROM Attempt a JOIN FETCH a.problem WHERE a.attemptDate = :date ORDER BY a.id ASC")
    List<Attempt> findByAttemptDateWithProblemOrderByIdAsc(LocalDate date);

    @Query("SELECT COUNT(DISTINCT a.problem.id) FROM Attempt a")
    long countDistinctProblems();
}
