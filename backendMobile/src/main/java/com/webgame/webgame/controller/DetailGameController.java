package com.webgame.webgame.controller;

import com.webgame.webgame.model.CartGame;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.service.game.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DetailGameController {
    @Autowired
    GameService gameService;

    @GetMapping("/detail/game/{gameId}")
    public ResponseEntity<Map<String, Object>> getDetailGame(@PathVariable("gameId") Long gameId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Object game =  gameService.getGameById(gameId);
            response.put("status", "success");
            response.put("gameDetail", game);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
