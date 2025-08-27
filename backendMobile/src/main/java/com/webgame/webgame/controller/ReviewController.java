package com.webgame.webgame.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.ReviewRequest;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.model.User;
import com.webgame.webgame.repository.GameRepository;
import com.webgame.webgame.repository.UserRepository;
import com.webgame.webgame.service.review.ReviewService;
import com.webgame.webgame.service.review.ReviewServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @GetMapping("reviewList")
    public Map<String, Object> reviewList(@RequestParam("page") int pageNo,
                                          @RequestParam("gameId") Long gameId) {
        int size = 20;
        // Lấy TRANG HIỆN TẠI, không lặp qua các trang trước
        Page<Object[]> reviewPage = reviewService.getReviewByGameId(gameId, pageNo, size);

        Map<String, Object> response = new HashMap<>();
        response.put("reviewList", reviewPage.getContent());
        response.put("currentPage", pageNo);
        response.put("totalPages", reviewPage.getTotalPages());

        return response;
    }

    @PostMapping("addReview")
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody JsonNode reviewData) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Gọi service để xử lý logic thêm game từ dữ liệu IGDB.
            reviewService.addReview(reviewData);
            response.put("status", "success");
            response.put("message", "Review game added successfully");
            // Trả về HTTP 200 OK kèm message thành công.
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("status", "error");
            response.put("message", "Error adding reivew game: " + e.getMessage());
//            Trả về HTTP 500 Internal Server Error.Thêm thông báo lỗi từ exception (e.getMessage()).
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("updateReview")
    public ResponseEntity<Map<String, Object>> updateReview(@RequestBody JsonNode updateData) {
        Map<String, Object> response = new HashMap<>();
        try {
            reviewService.updateReview(updateData);
            response.put("status", "success");
            response.put("message", "Review game updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error updated Review game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("deleteReview")
    public ResponseEntity<Map<String, Object>> deleteReview(@RequestParam("reviewId") Long reviewId) {
        Map<String, Object> response = new HashMap<>();
        try {
            reviewService.deleteReviewById(reviewId);
            response.put("status", "success");
            response.put("message", "Review game deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error deleted Review game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
