package com.webgame.webgame.repository;



import com.webgame.webgame.model.Category;
import com.webgame.webgame.model.Game;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
//    trả về 10 game có số lượng bán cao nhất trong 12 tháng gần nhất
//    có note
    @Query(value = """
            SELECT
                g.game_id,
                g.game_name,
                COUNT(a.account_game_id) AS total_accounts
            FROM
                game g
            LEFT JOIN (
                SELECT
                    ag.account_game_id,
                    ag.game_id
                FROM
                    account_game ag
            	JOIN
                    orders o
                ON
                    ag.order_id = o.order_id
                WHERE
                    ag.status = 1
                    AND o.create_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            ) a ON g.game_id = a.game_id
            GROUP BY
                g.game_id,
                g.game_name
            ORDER BY
                total_accounts DESC,
                g.game_id ASC
            LIMIT 5;
        """,
            nativeQuery = true)
    List<Object[]> gameBuy12Months();


    @Query(value = """
		SELECT
		    g.game_name,
            g.price,
            ag.username,
			ag.password
        FROM
            orders o
        LEFT JOIN
            account_game ag on ag.order_id = o.order_id
        LEFT JOIN
            game g on ag.game_id = g.game_id
		WHERE
		    o.order_id = :orderId
        ORDER BY
            g.price desc
        """,
            nativeQuery = true)
    Page<Object[]> findGameByOrderId(@Param("orderId") Long orderId, Pageable pageable);

    // Phương thức mới: Tải cả imgGames khi phân trang
    @Query(value = """
        SELECT
            g.game_id,
            g.game_name,
            g.game_img,
            g.description,
            g.price,
            g.quantity,
            g.create_date,
            GROUP_CONCAT(i.img_game_link SEPARATOR ', ') AS image_game
        FROM
            game g
        LEFT JOIN
            image_game i ON g.game_id = i.game_id
        GROUP BY
            g.game_id,
            g.create_date
        ORDER BY
            g.create_date DESC, g.game_id ASC
        """,
            nativeQuery = true)
    Page<Object[]> findAllWithImgGames(Pageable pageable);


    @Query(value = """
            SELECT
                g.game_id,
                g.game_name,
                g.game_img,
                g.description,
                g.price,
                g.quantity,
                g.create_date,
                GROUP_CONCAT(ig.img_game_link ORDER BY ig.img_game_id SEPARATOR ', ') AS img_game_links
            FROM
                game g
            LEFT JOIN
                image_game ig ON g.game_id = ig.game_id
            WHERE
                g.game_name LIKE CONCAT('%', :searchInput, '%')
            GROUP BY
                g.game_id
        """,
            nativeQuery = true)
    Page<Object[]> findGamesByGameName(@Param("searchInput") String searchInput, Pageable pageable);

    @Query(value = """
             SELECT
                                g.game_id,
                                g.game_name,
                                g.game_img,
                                g.description,
                                g.price,
                                g.quantity,
                                g.create_date,
                                GROUP_CONCAT(i.img_game_link ORDER BY i.img_game_id SEPARATOR ', ') AS img_game_links
                                FROM
                                    game g
                                JOIN
                                    category_game cg ON g.game_id = cg.game_id
                                LEFT JOIN
                                    image_game i ON g.game_id = i.game_id
                                WHERE
                                    cg.category_id = :categoryId
                                GROUP BY
                                    g.game_id
        """,
            nativeQuery = true)
    Page<Object[]> findByCategoryGames_Category(@Param("categoryId") Long categoryId, Pageable pageable);


//    mình dùng subquery
    @Query(value = """
            SELECT
                g.game_id,
                g.game_name,
                g.game_img,
                g.description,
                g.price,
                g.quantity,
                g.create_date,
                GROUP_CONCAT(DISTINCT i.img_game_link ORDER BY i.img_game_id SEPARATOR ', ') AS img_game_links,
                (SELECT COUNT(*) FROM review r WHERE r.game_id = g.game_id) AS total_reviews,
                (SELECT ROUND(AVG(score), 1) FROM review r WHERE r.game_id = g.game_id) AS average_score,
            	(SELECT COUNT(*) FROM account_game ag WHERE ag.game_id = g.game_id and ag.status = false) AS total_account_status_0
            FROM
                game g
            LEFT JOIN
                image_game i ON g.game_id = i.game_id
            WHERE
                g.game_id = :gameId
            GROUP BY
                g.game_id;
            """, nativeQuery = true)
    Object findGameById(@Param("gameId") Long gameId);


    // ở đây là mình tương tác trực tiếp với database ko phải thực thể vì nativeQuery = true
    @Query(value = """
    SELECT g.game_img, g.game_name, g.description, g.game_id, g.price,COUNT(DISTINCT ag.account_game_id) AS quantity,
           GROUP_CONCAT(DISTINCT c.category_name SEPARATOR ', ') AS category_list
    FROM game g
    LEFT JOIN account_game ag ON g.game_id = ag.game_id
    LEFT JOIN category_game cg ON g.game_id = cg.game_id
    LEFT JOIN category c ON cg.category_id = c.category_id
    GROUP BY g.game_img, g.game_name, g.description, g.game_id, g.price
   """, nativeQuery = true)
    Page<Object[]> findGamesAndQuantityCategory(Pageable pageable);

    // phục vụ cho update game, tương tác với entity
    // tìm những category liên kết với categoryGame với đk gameId trong categoryGame = gameId được truyền vào
    // :gameId giống với param bên trong @Param("gameId")
    @Query("""
        SELECT cg.category
        FROM CategoryGame cg
        WHERE cg.game.gameId = :gameId
        """)
    List<Category> findCategoriesByGameId(@Param("gameId") Long gameId);

    @Query("SELECT MAX(g.gameId) FROM Game g")
    Long findMaxId();

    // Thêm game mới (nếu chưa tồn tại)
    // Được sử dụng để đánh dấu các phương thức trong repository thực hiện
    // thao tác sửa đổi dữ liệu (INSERT, UPDATE, DELETE).
    // Bắt buộc khi sử dụng @Query với các câu lệnh làm thay đổi dữ liệu.
    // Luôn sử dụng @Transactional cho các phương thức service gọi đến repository method có @Modifying.
    @Modifying
    @Query(value = """
        INSERT INTO game (game_id, game_name, description, price, quantity, create_date)
        VALUES (:gameId, :gameName, :description, :price, 0, :createDate)
        """, nativeQuery = true)
    void insertGame(
            @Param("gameId") Long gameId,
            @Param("gameName") String gameName,
            @Param("description") String description,
            @Param("price") BigDecimal price,
            @Param("createDate") LocalDate createDate
            );

    @Modifying
    @Query(value = """
            DELETE FROM game
            WHERE game_id = :gameId
        """, nativeQuery = true)
    void deleteGameByGameId(
            @Param("gameId") Long gameId
    );

    Game findGameByGameId(Long gameId);
}
