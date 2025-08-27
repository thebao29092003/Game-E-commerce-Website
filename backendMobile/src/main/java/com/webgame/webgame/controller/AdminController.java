package com.webgame.webgame.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.OrderDetailsAdmin;
import com.webgame.webgame.dto.gameDto.GameFormDto;
import com.webgame.webgame.model.*;
import com.webgame.webgame.repository.OrderRepository;
import com.webgame.webgame.repository.UserRepository;
import com.webgame.webgame.service.category.CategoryService;
import com.webgame.webgame.service.game.GameService;
import com.webgame.webgame.service.user.UserServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AdminController {

    @Autowired
    GameService gameService;

    @Autowired
    CategoryService categoryService;

    // này đơn giản khỏi cần service dùng thẳng repository
    @Autowired
    UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;

    //   public ResponseEntity<String>
    //  Phương thức trả về kiểu ResponseEntity<String>
    // → Đối tượng chứa cả HTTP response status và nội dung (body) dạng String.
    //  Giúp tùy chỉnh HTTP status code và message trả về.
    @PostMapping("addGame")
    //  @RequestBody JsonNode igdbGameData:
    //@RequestBody: Annotation của Spring, chuyển đổi dữ liệu JSON từ request
    // body thành đối tượng Java (ở đây là JsonNode của thư viện Jackson).
    //JsonNode: Đối tượng cây (tree model) để phân tích cú pháp JSON linh hoạt.
    public ResponseEntity<Map<String, Object>> addGame(@RequestBody JsonNode igdbGameData) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Gọi service để xử lý logic thêm game từ dữ liệu IGDB.
            gameService.addGameFromIgdb(igdbGameData);
            response.put("status", "success");
            response.put("message", "Game added successfully");
            // Trả về HTTP 200 OK kèm message thành công.
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("status", "error");
            response.put("message", "Error adding game: " + e.getMessage());
//            Trả về HTTP 500 Internal Server Error.Thêm thông báo lỗi từ exception (e.getMessage()).
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("updateGame")
    public ResponseEntity<Map<String, Object>> updateGame(@RequestBody JsonNode updateData) {
        Map<String, Object> response = new HashMap<>();
        try {
            gameService.updateGameById(updateData);
            response.put("status", "success");
            response.put("message", "Game updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error updated game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("deleteGame/{gameId}")
    public ResponseEntity<Map<String, Object>> deleteGame(@PathVariable Long gameId) {
        Map<String, Object> response = new HashMap<>();
        try {
            gameService.deleteGameById(gameId);
            response.put("status", "success");
            response.put("message", "Game deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error deleted game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    @GetMapping("/getGameByOrderId")
    public Map<String, Object> getGameByOrderId(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "numberPerPage") int numberPerPage,
            @RequestParam(value = "orderId") Long orderId
    ) {
        Page<Object[]> gamePage = gameService.findGameByOrderId(orderId, page, numberPerPage); // Trả về view hiển thị danh sách game
        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", gamePage.getTotalPages());
        return response;
    }

    @GetMapping("/gameBuy12Months")
    public Map<String, Object> gameBuy12Months() {
        List<Object[]> gamePage = gameService.gameBuy12Months();
        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage);
        return response;
    }
}
