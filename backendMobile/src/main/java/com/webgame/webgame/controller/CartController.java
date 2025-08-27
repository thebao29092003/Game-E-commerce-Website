package com.webgame.webgame.controller;

import com.webgame.webgame.dto.cartDto.CartItem;
import com.webgame.webgame.dto.cartDto.CartResponseDto;
import com.webgame.webgame.dto.userProfile.UserId;
import com.webgame.webgame.model.CartGame;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.repository.CartGameRepository;
import com.webgame.webgame.service.cart.CartGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RestController
public class CartController {

    @Autowired
    CartGameService cartGameService;

    @Autowired
    CartGameRepository cartGameRepository;

    @PostMapping("/addCart")
    public ResponseEntity<Long> addCart(@RequestBody CartItem item) {
        Long userId = item.getUserId();
        Long gameId = item.getGameId();
        if (cartGameRepository.existsByGameAndUser(gameId, userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        cartGameService.saveCartGame(gameId,userId);
        Long quantityGame = cartGameRepository.countGamesByUserIdInCart(userId);
        return ResponseEntity.ok(quantityGame);
    }

    @PostMapping("/deleteCart")
    public ResponseEntity<Long> deleteCart(@RequestBody CartItem item) {
        Long userId = item.getUserId();
        Long gameId = item.getGameId();

        cartGameRepository.deleteGamesInCart(userId,gameId);
        Long quantityGame = cartGameRepository.countGamesByUserIdInCart(userId);
        return ResponseEntity.ok(quantityGame);
    }

    @PostMapping("/listCart")
    public ResponseEntity<CartResponseDto> listGame(@RequestBody UserId userId) {
        List<CartGame> listgame = cartGameRepository.findGamesInCartByUserId(userId.getUserId());
        List<Game> games = listgame.stream()
                .map(CartGame::getGame)
                .collect(Collectors.toList());
        CartResponseDto cartResponseDto = new CartResponseDto();
        cartResponseDto.setListgame(games);
        cartResponseDto.setTotal(cartGameService.calculateTotalPrice(userId.getUserId()));
        return ResponseEntity.ok(cartResponseDto);
    }

    @GetMapping("/listCartForWeb")
    public Map<String, Object> listGameForWeb(@RequestParam(value = "userId") Long userId) {
        List<Object[]> cartList = cartGameService.getCartForWeb(userId); // Trả về view hiển thị danh sách game
        Map<String, Object> response = new HashMap<>();
        response.put("cartList", cartList);
        return response;
    }

    @DeleteMapping("deleteCartForWeb")
    public ResponseEntity<Map<String, Object>> deleteItemCart(@RequestParam(value = "cartId") Long cartId) {
        Map<String, Object> response = new HashMap<>();
        try {
            cartGameService.deleteItemCart(cartId);
            response.put("status", "success");
            response.put("message", "Item cart deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error deleted Item cart: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

}
