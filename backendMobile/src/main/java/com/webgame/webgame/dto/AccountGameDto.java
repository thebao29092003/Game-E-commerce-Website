package com.webgame.webgame.dto;

import lombok.Data;

// @Data chính là thay thế cho getter và setter đó
public class AccountGameDto {
    private String gamename;
    private String username;
    private String password;
    private String gameImg;

    public AccountGameDto(String gamename, String username, String password, String gameImg) {
        this.gamename = gamename;
        this.username = username;
        this.password = password;
        this.gameImg = gameImg;
    }

    public AccountGameDto() {
    }

    public String getGamename() {
        return gamename;
    }

    public void setGamename(String gamename) {
        this.gamename = gamename;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGameImg() {
        return gameImg;
    }

    public void setGameImg(String gameImg) {
        this.gameImg = gameImg;
    }
}
