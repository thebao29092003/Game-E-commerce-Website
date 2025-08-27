package com.webgame.webgame.dto.cartDto;

import com.webgame.webgame.model.Game;

import java.math.BigDecimal;
import java.util.List;

public class CartResponseDto {
    List<Game> listgame;
    BigDecimal total;

    public CartResponseDto() {
    }

    public CartResponseDto(List<Game> listgame, BigDecimal total) {
        this.listgame = listgame;
        this.total = total;
    }

    public List<Game> getListgame() {
        return listgame;
    }

    public void setListgame(List<Game> listgame) {
        this.listgame = listgame;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
