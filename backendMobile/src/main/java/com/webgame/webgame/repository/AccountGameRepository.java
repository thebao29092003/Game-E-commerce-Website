package com.webgame.webgame.repository;

import com.webgame.webgame.model.AccountGame;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountGameRepository extends JpaRepository<AccountGame, Long> {

    @Query(value = """
            SELECT ag.account_game_id, ag.username, ag.password , ag.status
            FROM account_game ag
            WHERE ag.game_id = :gameId
            order by ag.status, ag.account_game_id
            """, nativeQuery = true)
    Page<Object[]> accountGameByGameId(@Param("gameId") Long gameId, Pageable pageable);


//    dùng cho phần thanh toán lấy ra account được bán
    @Query(value = """
            SELECT *
            FROM account_game ag
            WHERE ag.game_id = :gameId AND ag.status = :status
            LIMIT 1
            """, nativeQuery = true)
    AccountGame findFirstByGameIdAndStatus(
            @Param("gameId") Long gameId,
            @Param("status") Boolean status
    );

//    dùng cho phần thanh toán để update status game và thêm orderId vào account game
    @Modifying
    @Query(value = """
            UPDATE account_game
            SET
                status = :statusInput,
                order_id = :orderId
            WHERE
                account_game_id = :accountGameId;
            """, nativeQuery = true)
    void updateAccountGameForBuy(
            @Param("accountGameId") Long accountGameId,
            @Param("orderId") Long orderId,
            @Param("statusInput") Boolean statusInput
    );

    // Lấy tất cả tài khoản game theo trạng thái
    @Query("SELECT a FROM AccountGame a WHERE a.status = :status")
    List<AccountGame> findAccountGamesByStatus(@Param("status") boolean status);

    // mình dùng câu query native và sắp xếp theo cả 2 trường
    // đầu tiên ưu tiên sắp xếp theo total_accounts đã bán
    // sau đó nếu số lượng account đã bán bằng nhau thì sắp xếp
    // tăng dần theo theo gameId nếu ko có 1 trường sắp xếp phụ
    // thì dữ liệu trả về sẽ bị trùng lặp
    //    xem lại sql
    @Query(value = """
               SELECT
                                                g.game_id,
                                                g.game_name,
                                                g.game_img,
                                                g.description,
                                                g.price,
                                                g.quantity,
                                                g.create_date,
                                                GROUP_CONCAT(i.img_game_link SEPARATOR ', ') AS image_game,
                                                COUNT(distinct account_game.account_game_id) AS total_accounts
                                            FROM
                                                game g
                                            LEFT JOIN
                                                account_game
                                            ON
                                                g.game_id = account_game.game_id AND account_game.status = 1
                                    		LEFT JOIN
                                                image_game i
                                    		ON
                                    			g.game_id = i.game_id
                                            GROUP BY
                                                g.game_id,
                                                g.game_name,
                                                g.game_img,
                                                g.description,
                                                g.price,
                                                g.quantity,
                                                g.create_date
                                            ORDER BY
                                                total_accounts DESC, g.game_id ASC
            """, nativeQuery = true)
    Page<Object[]> findTopSellingGames(Pageable pageable);


    //    lấy danh sách acccount chưa bán để showw cho khách hàng
    @Query("SELECT a FROM AccountGame a WHERE a.game.gameId = :gameId AND a.status = false ORDER BY a.accountGameId ASC")
    List<AccountGame> timListAccountchuaban(@Param("gameId") Long gameId);


    //    Đếm số lượng game chưa bán của một game
    @Query(value = """
            SELECT count(a.account_game_id)
            FROM account_game a
            WHERE a.game_id = :gameId AND a.status = false
            """, nativeQuery = true)
    Long accountGameStatus0(@Param("gameId") Long gameId);

    //    phục vụ cho việc xóa game
    @Modifying
    @Query(value = """
        DELETE FROM account_game WHERE game_id = :gameId
        """, nativeQuery = true)
    void deleteAccountGameByGameId(
            @Param("gameId") Long gameId
    );

    @Modifying
    @Query(value = """
        INSERT INTO account_game (game_id, username, password, status)
        VALUES (:gameId, :username, :password, 0)
        """, nativeQuery = true)
    void insertAccountGame(
            @Param("gameId") Long gameId,
            @Param("username") String username,
            @Param("password") String password
    );

    @Modifying
    @Query(value = """
            DELETE FROM account_game
            WHERE account_game_id = :accountGameId
        """, nativeQuery = true)
    void deleteAccountGameById(
            @Param("accountGameId") Long accountGameId
    );
}
