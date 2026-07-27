package com.leetcode.tracker.controller;

import com.leetcode.tracker.service.ExcelImportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/import")
@CrossOrigin
public class ImportController {

    private final ExcelImportService excelImportService;

    public ImportController(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService;
    }

    @PostMapping("/excel")
    public Map<String, Object> importExcel(@RequestParam("file") MultipartFile file) throws Exception {
        return excelImportService.importExcel(file);
    }
}
