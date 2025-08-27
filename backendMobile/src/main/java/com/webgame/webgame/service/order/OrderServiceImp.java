package com.webgame.webgame.service.order;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.model.AccountGame;
import com.webgame.webgame.model.Orders;
import com.webgame.webgame.repository.AccountGameRepository;
import com.webgame.webgame.repository.OrderRepository;
import com.webgame.webgame.service.accountGame.AccountGameService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImp implements OrderService{
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AccountGameRepository  accountGameRepository;


    @Override
    public Page<Object[]> getListOrder(String sortDirection, String sortField, int page, int size) {
        // Tạo Sort object với hướng sắp xếp động
        // hướng sắp xếp và trường sắp xếp
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return orderRepository.listOrder(pageable);
    }

    @Override
    public List<Object[]> getOrderCountRevenue() {
        return orderRepository.orderCountRevenue();
    }

    @Override
    public Page<Object[]> getOrderByUserId(Long userId, String sortDirection, String sortField, int page, int size) {
        // Tạo Sort object với hướng sắp xếp động
        // hướng sắp xếp và trường sắp xếp
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        return orderRepository.getOrderByUserId(userId, pageable);
    }

// dùng cho phần thanh toán, khi user ấn thanh toán thì sẽ order này vào
    @Transactional
    @Override
    public void addOrder(JsonNode orderData) {
//        logic addOrder này khá hay :
//        1) thêm thông tin order gồm userId, sumPrice và tg tạo order
//        2) Nhận order vừa mới thêm
//        3) Chuyển gameIds từ jsonNode thành list<Long> để có thêm nhìu phương thức xử lý, giảm
//        để các bước sau giảm phụ thuộc vào jsonNode
//        4) Duyệt qua từng gameId trong list với mỗi gameId thì lấy ra 1 account của game đó chưa bán
//        sau đó update nó thành đã bán (status = true và thêm orderId cho account đó)

//      1)
        Long userId = orderData.get("userId").asLong();
        //  Chuyển sang BigDecimal
        BigDecimal sumPrice =new BigDecimal (orderData.get("sumPrice").asText());
        // Tạo thời gian hiện tại
        LocalDate createDate = LocalDateTime.now().toLocalDate();
        orderRepository.insertOrder(userId, sumPrice, createDate);

//      2)
        Orders order = orderRepository.findLastInsertedOrder();

//      3)
        List<Long> gameIds = new ArrayList<>();
        JsonNode gameIdsNode = orderData.get("gameIds");
        if (gameIdsNode != null && gameIdsNode.isArray()) {
//            duyệt qua từng gameId và ép no thành Long và thêm vào list
            for (JsonNode idNode : gameIdsNode) {
                gameIds.add(idNode.asLong());
            }
        }

//      4)
        for (Long gameId : gameIds) {
            // Lấy account available  chưa bán (status = false)
            AccountGame account = accountGameRepository.findFirstByGameIdAndStatus(gameId, false);
            // thêm orderId và đổi status account game để đánh dấu là no được mua rồi
            accountGameRepository.updateAccountGameForBuy(account.getAccountGameId(), order.getOrderId(), true);
        }
    }
}
