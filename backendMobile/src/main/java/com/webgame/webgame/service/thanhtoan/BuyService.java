package com.webgame.webgame.service.thanhtoan;

import com.webgame.webgame.model.*;
import com.webgame.webgame.repository.*;
import com.webgame.webgame.service.accountGame.AccountGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
public class BuyService {
    @Autowired
    AccountGameRepository accountGameRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private CartGameRepository cartGameRepository;

//    public String buyNow(Long gameId, Long userId) {
//
//            // Tìm người dùng
//            User user = userRepository.findUserById(userId);
//
//            // Tìm danh sach tai khoản game chưa bán
//            List<AccountGame> listAccountGame = accountGameRepository.timListAccountchuaban(gameId);
//            if (listAccountGame == null) {
//                return "Game này đã hết trong kho";
//            }
//            AccountGame accountGame =listAccountGame.get(0);
//
//
//            // Tạo đơn hàng
//            Orders order = new Orders();
//            order.setUser(user);
//            order.setPayAt(new Date());
//            order.setSumPrice(accountGame.getGame().getPrice());
//
//            // Cập nhật trạng thái của tài khoản game
//            accountGame.setStatus(true);
//            accountGame.setOrder(order);
//
//            // Lưu đơn hàng và tài khoản game đã cập nhật
//            ordersRepository.save(order);
//            accountGameRepository.save(accountGame);
//
//            // Trả về thông báo thành công
//            return "Đã ghi vào csdl";
//
//    }




//    cái này dùng kiễu dữ liệu map để mà trả về kiểu như json (trả về nhiều giá trị cùng lúc)
    public Map<String, Object> xacNhanDonHang(List<Long> idGames) {
        Map<String, Object> result = new HashMap<>();
        if (idGames == null || idGames.isEmpty()) {
            result.put("message", "Không có game nào được chọn");
            return result;
        }
        BigDecimal tongia = BigDecimal.ZERO;
        List<Game> selectedGames = new ArrayList<>();
//        for (Long id : idGames) {
//            Game game = gameRepository.findGameById(id);
//            selectedGames.add(game);
//            tongia = tongia.add(game.getPrice());
//        }

        result.put("tongia", tongia);
        result.put("selectedGames", selectedGames);
        return result;
    }


}
