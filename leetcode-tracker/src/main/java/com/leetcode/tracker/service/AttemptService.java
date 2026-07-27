package com.leetcode.tracker.service;

import com.leetcode.tracker.dto.*;
import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.AttemptRepository;
import com.leetcode.tracker.repository.ProblemRepository;
import com.leetcode.tracker.repository.SolutionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AttemptService {

    private final AttemptRepository attemptRepository;
    private final ProblemRepository problemRepository;
    private final SolutionRepository solutionRepository;

    public AttemptService(AttemptRepository attemptRepository,
                          ProblemRepository problemRepository,
                          SolutionRepository solutionRepository) {
        this.attemptRepository = attemptRepository;
        this.problemRepository = problemRepository;
        this.solutionRepository = solutionRepository;
    }

    @Transactional
    public AttemptDto create(Long problemId, CreateAttemptRequest req) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new EntityNotFoundException("题目不存在: " + problemId));

        int nextNo = attemptRepository.findTopByProblemIdOrderByAttemptNoDesc(problemId)
                .map(a -> a.getAttemptNo() + 1)
                .orElse(1);

        Attempt attempt = new Attempt();
        attempt.setProblem(problem);
        attempt.setAttemptNo(nextNo);
        attempt.setAttemptType(req.attemptType());
        attempt.setAttemptDate(req.attemptDate() != null ? req.attemptDate() : LocalDate.now());
        attempt.setResult(req.result() != null ? req.result() : AttemptResult.AC);
        attempt.setMyDifficulty(req.myDifficulty() != null ? req.myDifficulty() : 0);
        attempt.setMood(req.mood() != null ? req.mood() : AttemptMood.NORMAL);
        attempt.setNotes(req.notes());
        attempt.setDurationMinutes(req.durationMinutes());

        if (req.solutionUsedId() != null) {
            Solution solution = solutionRepository.findById(req.solutionUsedId())
                    .orElseThrow(() -> new EntityNotFoundException("解法不存在: " + req.solutionUsedId()));
            attempt.setSolutionUsed(solution);
        }

        attemptRepository.save(attempt);
        refreshProblemStatus(problem);

        return AttemptDto.from(attempt);
    }

    @Transactional
    public AttemptDto update(Long attemptId, UpdateAttemptRequest req) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("记录不存在: " + attemptId));

        attempt.setAttemptType(req.attemptType());
        attempt.setAttemptDate(req.attemptDate());
        attempt.setResult(req.result() != null ? req.result() : AttemptResult.AC);
        attempt.setMyDifficulty(req.myDifficulty() != null ? req.myDifficulty() : 0);
        attempt.setMood(req.mood() != null ? req.mood() : AttemptMood.NORMAL);
        attempt.setNotes(req.notes());
        attempt.setDurationMinutes(req.durationMinutes());

        if (req.solutionUsedId() != null) {
            Solution solution = solutionRepository.findById(req.solutionUsedId())
                    .orElseThrow(() -> new EntityNotFoundException("解法不存在: " + req.solutionUsedId()));
            attempt.setSolutionUsed(solution);
        } else {
            attempt.setSolutionUsed(null);
        }

        return AttemptDto.from(attemptRepository.save(attempt));
    }

    @Transactional
    public void delete(Long attemptId) {
        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("记录不存在: " + attemptId));
        Problem problem = attempt.getProblem();
        attemptRepository.delete(attempt);
        refreshProblemStatus(problem);
    }

    public List<AttemptDto> listByDate(LocalDate date) {
        return attemptRepository.findByAttemptDateWithProblemOrderByIdAsc(date).stream()
                .map(AttemptDto::from)
                .toList();
    }

    private void refreshProblemStatus(Problem problem) {
        int count = attemptRepository.countByProblemId(problem.getId());
        if (count == 0) {
            problem.setStatus(ProblemStatus.NOT_STARTED);
        } else if (problem.getStatus() == ProblemStatus.NOT_STARTED) {
            problem.setStatus(ProblemStatus.IN_PROGRESS);
        }
        problemRepository.save(problem);
    }
}
