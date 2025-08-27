package com.webgame.webgame.dto.userProfile;

import com.webgame.webgame.dto.AccountGameDto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

//@Data
public class OrderHistory {
    private Long orderId;
    private LocalDate createDate;
    private LocalDate payAt;
    private BigDecimal sumPrice;
    private List<AccountGameDto> accounts;

    public OrderHistory(Long orderId, LocalDate createDate, LocalDate payAt, BigDecimal sumPrice, List<AccountGameDto> accounts) {
        this.orderId = orderId;
        this.createDate = createDate;
        this.payAt = payAt;
        this.sumPrice = sumPrice;
        this.accounts = accounts;
    }

    public OrderHistory() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDate getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public LocalDate getPayAt() {
        return payAt;
    }

    public void setPayAt(LocalDate payAt) {
        this.payAt = payAt;
    }

    public BigDecimal getSumPrice() {
        return sumPrice;
    }

    public void setSumPrice(BigDecimal sumPrice) {
        this.sumPrice = sumPrice;
    }

    public List<AccountGameDto> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountGameDto> accounts) {
        this.accounts = accounts;
    }
}
