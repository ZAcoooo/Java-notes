package com.leetcode.tracker.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcode.tracker.entity.*;
import com.leetcode.tracker.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class Hot100DataLoader implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(Hot100DataLoader.class);

    private final ProblemRepository problemRepository;
    private final ObjectMapper objectMapper;

    public Hot100DataLoader(ProblemRepository problemRepository, ObjectMapper objectMapper) {
        this.problemRepository = problemRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        ClassPathResource resource = new ClassPathResource("data/hot100.json");
        try (InputStream in = resource.getInputStream()) {
            List<Map<String, Object>> items = objectMapper.readValue(in, new TypeReference<>() {});
            Set<Integer> officialIds = new HashSet<>();
            int added = 0;
            int updated = 0;

            for (Map<String, Object> item : items) {
                int leetcodeId = ((Number) item.get("leetcodeId")).intValue();
                officialIds.add(leetcodeId);

                var existing = problemRepository.findByLeetcodeId(leetcodeId);
                if (existing.isPresent()) {
                    Problem p = existing.get();
                    if (!Boolean.TRUE.equals(p.getCustom())) {
                        applyOfficialData(p, item);
                        problemRepository.save(p);
                        updated++;
                    }
                } else {
                    Problem problem = new Problem();
                    problem.setLeetcodeId(leetcodeId);
                    applyOfficialData(problem, item);
                    problem.setStatus(ProblemStatus.NOT_STARTED);
                    problem.setCustom(false);
                    problemRepository.save(problem);
                    added++;
                }
            }

            log.info("Hot100 官方题库同步完成：共 {} 题，新增 {}，更新 {}", items.size(), added, updated);
            if (items.size() != 100) {
                log.warn("Hot100 题库数量异常，期望 100 题，实际 {} 题", items.size());
            }
        }
    }

    private void applyOfficialData(Problem problem, Map<String, Object> item) {
        problem.setTitle((String) item.get("title"));
        problem.setUrl((String) item.get("url"));
        problem.setOfficialDifficulty(OfficialDifficulty.valueOf((String) item.get("difficulty")));
        problem.setCategory((String) item.get("category"));
        problem.setCustom(false);
    }
}
