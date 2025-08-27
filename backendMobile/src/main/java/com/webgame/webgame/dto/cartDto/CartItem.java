package com.webgame.webgame.dto.cartDto;

public class CartItem {
    Long gameId;
    Long userId;

    public CartItem() {
    }

    public CartItem(Long gameId, Long userId) {
        this.gameId = gameId;
        this.userId = userId;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
