package com.webgame.webgame.repository;

import com.webgame.webgame.model.Review;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = """
            SELECT r.review_id, r.comment, r.create_date, r.score, r.game_id, u.full_name, u.user_id
            FROM review r
            JOIN user u ON r.user_id = u.user_id
            WHERE r.game_id = :gameId
            ORDER BY r.create_date DESC;
            """, nativeQuery = true)
    Page<Object[]> listReviewByGameId(@Param("gameId") Long gameId, Pageable pageable);

    @Modifying
    @Query(value = """
        INSERT INTO review (comment, score, game_id, user_id, create_date)
        VALUES (:comment, :score, :gameId, :userId, :createDate)
        """, nativeQuery = true)
    void insertReview(
            @Param("comment") String comment,
            @Param("score") int score,
            @Param("gameId") Long gameId,
            @Param("userId") Long userId,
            @Param("createDate") LocalDateTime createDate
    );

    @Modifying
    @Query(value = """
            DELETE FROM review
            WHERE review_id = :reviewId
        """, nativeQuery = true)
    void deleteReviewById(
            @Param("reviewId") Long reviewId
    );

    @Modifying
    @Query(value = """
            DELETE FROM review
            WHERE game_id = :gameId
        """, nativeQuery = true)
    void deleteReviewByGameId(
            @Param("gameId") Long gameId
    );
}