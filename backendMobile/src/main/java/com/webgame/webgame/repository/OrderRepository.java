package com.webgame.webgame.repository;

import com.webgame.webgame.model.Orders;
import com.webgame.webgame.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders,Long> {
    @Query(value = """
                           SELECT
                               o.order_id,
                               o.create_date,
                               o.sum_price
                           FROM
                               orders o
                           WHERE o.user_id = :userId
        """,
            nativeQuery = true)
    Page<Object[]> getOrderByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query(value = """
            SELECT
                o.order_id,
                o.create_date,
                o.sum_price,
                u.full_name,
                u.email
            FROM
                orders o
            JOIN
                user u ON o.user_id = u.user_id
        """,
            nativeQuery = true)
    Page<Object[]> listOrder(Pageable pageable);

    @Query("SELECT DISTINCT o FROM Orders o " +
            "LEFT JOIN FETCH o.accountGames ag " +
            "LEFT JOIN FETCH ag.game " +
            "WHERE o.user.userId = :userId")
    List<Orders> findOrdersHistoryByUserId(@Param("userId") Long userId);
//  Câu SQL này dùng để thống kê số lượng đơn hàng và tổng doanh thu theo từng tháng trong 12 tháng gần nhất,
//  kể cả những tháng không có đơn hàng.
//    XEM NOTE
    @Query(value = """
          SELECT
                  months.month,
                  COUNT(o.order_id) AS order_count,
                  COALESCE(SUM(o.sum_price), 0) AS total_revenue
              FROM (
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 11 MONTH), '%Y-%m') AS month UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 10 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 9 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 8 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 7 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), '%Y-%m') UNION ALL
                  SELECT DATE_FORMAT(CURRENT_DATE(), '%Y-%m')
              ) AS months
              LEFT JOIN orders o ON DATE_FORMAT(o.create_date, '%Y-%m') = months.month
              GROUP BY months.month
              ORDER BY months.month;
        """,
            nativeQuery = true)
    List<Object[]> orderCountRevenue();

    @Modifying
    @Query(value = """
        INSERT INTO orders (user_id, sum_price, create_date, pay_at)
        VALUES (:userId, :sumPrice, :createDate, :createDate)
        """, nativeQuery = true)
    void insertOrder(
            @Param("userId") Long userId,
            @Param("sumPrice") BigDecimal price,
            @Param("createDate") LocalDate createDate
    );

    // Hàm LAST_INSERT_ID() trong MySQL trả về giá trị AUTO_INCREMENT
    // đầu tiên được tạo ra bởi câu lệnh INSERT gần đây nhất trong phiên làm việc hiện tại.
    @Query(value = """
            SELECT * FROM orders WHERE order_id = LAST_INSERT_ID()
            """, nativeQuery = true)
    Orders findLastInsertedOrder();
}
