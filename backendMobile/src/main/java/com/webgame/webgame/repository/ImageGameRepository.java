package com.webgame.webgame.repository;

import com.webgame.webgame.model.ImageGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageGameRepository extends JpaRepository<ImageGame, Long> {
    @Query(value = """
    SELECT ig.img_game_id, ig.img_game_link FROM image_game ig where ig.game_id = :gameId;
   """, nativeQuery = true)
    List<Object[]> getListImgByGameId(@Param("gameId") Long gameId);
    // Thêm ảnh (nếu chưa tồn tại)

    @Query("SELECT MAX(ig.imgGameId) FROM ImageGame ig")
    Long findMaxId();

    @Modifying
    @Query(value = """
        INSERT INTO image_game (img_game_id, img_game_link, game_id)
        VALUES (:imgId, :imgGameLink, :gameId)
        """, nativeQuery = true)
    void insertImage(
            @Param("imgId") Long imgId,
            @Param("imgGameLink") String imgGameLink,
            @Param("gameId") Long gameId
    );

    @Modifying
    @Query(value = """
        DELETE FROM image_game WHERE game_id = :gameId
        """, nativeQuery = true)
    void deleteImageByGameId(
            @Param("gameId") Long gameId
    );
}
