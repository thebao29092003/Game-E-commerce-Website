package com.webgame.webgame.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.model.AccountGame;
import com.webgame.webgame.repository.AccountGameRepository;
import com.webgame.webgame.repository.UserRepository;
import com.webgame.webgame.service.accountGame.AccountGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AccountGameController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AccountGameService accountGameService;

    @GetMapping("/listAccountGame")
    public Map<String, Object> accountGame( @RequestParam(value = "page") int page,
                                            @RequestParam(value = "gameId") Long gameId) {

        int size = 10;
        Page<Object[]> accountGamePage = accountGameService.listAccountByGameId(gameId, page, size);


        Map<String, Object> response = new HashMap<>();
        response.put("accountGameList", accountGamePage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", accountGamePage.getTotalPages());
        return response;

    }

    @PostMapping("addAccountGame")
    public ResponseEntity<Map<String, Object>> addAccountGame(@RequestBody JsonNode accountGameData) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Gọi service để xử lý logic thêm game từ dữ liệu IGDB.
            accountGameService.addAccountGame(accountGameData);
            response.put("status", "success");
            response.put("message", "Account game added successfully");
            // Trả về HTTP 200 OK kèm message thành công.
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("status", "error");
            response.put("message", "Error adding account game: " + e.getMessage());
//            Trả về HTTP 500 Internal Server Error.Thêm thông báo lỗi từ exception (e.getMessage()).
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("updateAccountGame")
    public ResponseEntity<Map<String, Object>> updateAccountGame(@RequestBody JsonNode updateData) {
        Map<String, Object> response = new HashMap<>();
        try {
            accountGameService.updateAccountGameById(updateData);
            response.put("status", "success");
            response.put("message", "Account game updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error updated account game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("deleteAccountGame/{accountGameId}")
    public ResponseEntity<Map<String, Object>> deleteAccountGame(@PathVariable Long accountGameId) {
        Map<String, Object> response = new HashMap<>();
        try {
            accountGameService.deleteAccountGameById(accountGameId);
            response.put("status", "success");
            response.put("message", "Account game deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error deleted account game: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("accountStatus0/{gameId}")
    public ResponseEntity<Map<String, Object>> accountStatus0(@PathVariable("gameId") Long gameId) {
        Map<String, Object> response = new HashMap<>();
        try{
            // Gọi service để xử lý logic thêm game từ dữ liệu IGDB.
            Long numberAccount = accountGameService.accountGameStatus0(gameId);
            response.put("status", "success");
            response.put("numberAccount", numberAccount);
            // Trả về HTTP 200 OK kèm message thành công.
            return ResponseEntity.ok(response);
        } catch (Exception e){
            response.put("status", "error");
            response.put("message", e.getMessage());
//            Trả về HTTP 500 Internal Server Error.Thêm thông báo lỗi từ exception (e.getMessage()).
            return ResponseEntity.internalServerError().body(response);
        }
    }
}