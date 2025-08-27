package com.webgame.webgame.service.review;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;

public interface ReviewService {
    Page<Object[]> getReviewByGameId(Long gameId, int page, int size);
    void addReview(JsonNode reviewData);
    void updateReview(JsonNode reviewData);
    void deleteReviewById(Long id);
    void deleteReviewByGameId(Long gameId);
}
