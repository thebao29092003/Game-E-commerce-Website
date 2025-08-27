package com.webgame.webgame.service.review;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.model.AccountGame;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.model.Review;
import com.webgame.webgame.model.User;
import com.webgame.webgame.repository.GameRepository;
import com.webgame.webgame.repository.ReviewRepository;
import com.webgame.webgame.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class ReviewServiceImp implements ReviewService{
    @Autowired
    ReviewRepository reviewRepository;

    @Override
    public Page<Object[]> getReviewByGameId(Long gameId, int page, int size) {
        return reviewRepository.listReviewByGameId(gameId, PageRequest.of(page, size));
    }

    @Transactional
    @Override
    public void addReview(JsonNode reviewData) {
        String comment = reviewData.get("comment").asText();
        int score = reviewData.get("score").asInt();
        Long gameId = reviewData.get("gameId").asLong();
        Long userId = reviewData.get("userId").asLong();

        // Tạo thời gian hiện tại
        LocalDateTime createDate = LocalDateTime.now();

        reviewRepository.insertReview(comment,score, gameId, userId, createDate);
    }

    @Transactional
    @Override
    public void updateReview(JsonNode reviewData) {
        Long reviewId = reviewData.get("reviewId").asLong();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Cập nhật từng trường nếu có trong JSON
        if (reviewData.has("comment")) {
            review.setComment(reviewData.get("comment").asText());
        }

        if (reviewData.has("score")) {
            review.setScore(reviewData.get("score").asInt());
        }

        reviewRepository.save(review);
    }

    @Transactional
    @Override
    public void deleteReviewById(Long reviewId) {
        reviewRepository.deleteReviewById(reviewId);
    }

    @Transactional
    @Override
    public void deleteReviewByGameId(Long gameId) {
        reviewRepository.deleteReviewByGameId(gameId);
    }
}
