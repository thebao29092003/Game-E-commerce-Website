package com.webgame.webgame.repository;
import com.webgame.webgame.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

import com.webgame.webgame.model.User;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

 @Query("SELECT u FROM User u WHERE u.userId = :userId")

 User findUserById(@Param("userId") Long userId);


    User findByRole(String role);
    User findByEmail(String email);
    User findByPhone(String phone);
    List<User> findAll();

    @Query(value = """
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                COUNT(o.order_id) AS total_orders,
                COALESCE(SUM(o.sum_price), 0) AS total_spent
            FROM
                user u
            LEFT JOIN
                 orders o ON u.user_id = o.user_id
            WHERE
                u.full_name LIKE CONCAT('%', :userName, '%')
            GROUP BY
                u.user_id
            order by total_orders desc
        """,
            nativeQuery = true)
    Page<Object[]> findUserByName(@Param("userName") String userName, Pageable pageable);

    @Query(value = """
                            SELECT
                                u.user_id,
                                u.full_name,
                                u.email,
                                u.phone,
                                COALESCE(SUM(o.sum_price), 0) AS total_spent
                            FROM
                                user u
                            LEFT JOIN
                                orders o ON u.user_id = o.user_id
                            WHERE u.user_id = :userId
                            GROUP BY
                                u.user_id
        """,
            nativeQuery = true)
    Object getUserTotalSpent(Long userId);

//    nó luôn cố định 12 thàng nên không cần phân trang
    @Query(value = """
            SELECT
                DATE_FORMAT(create_date, '%Y-%m') AS month,
                SUM(sum_price) AS total_spent
            FROM
                orders
            WHERE
                user_id = :userId
                AND create_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
            GROUP BY
                DATE_FORMAT(create_date, '%Y-%m')
            ORDER BY
                month ASC;
        """,
            nativeQuery = true)
    List<Object[]> getSpentPerMonth(Long userId);


    @Query(value = """
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                COUNT(o.order_id) AS total_orders,
                COALESCE(SUM(o.sum_price), 0) AS total_spent
            FROM
                user u
            LEFT JOIN
                orders o ON u.user_id = o.user_id
            GROUP BY
                u.user_id
            order by total_orders desc
        """,
            nativeQuery = true)
    Page<Object[]> listUser(Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.OTP = NULL, u.OTP_create_at = NULL WHERE u.OTP_create_at <= :otpTime")
    void deleteOTP(@Param("otpTime") LocalDateTime otpTime);

//  Câu truy vấn này kiểm tra xem một người dùng cụ thể đã mua một game cụ thể hay chưa.
//  xem note
    @Query(value = """
           SELECT EXISTS (
                   SELECT 1
                   FROM account_game ag
                   JOIN orders o ON ag.order_id = o.order_id
                   WHERE o.user_id = :userId
                   AND ag.game_id = :gameId
                   LIMIT 1
               ) AS has_purchased;
        """, nativeQuery = true)
    Long hasUserBuyGame (@Param("userId") Long userId,
                            @Param("gameId") Long gameId);
}
