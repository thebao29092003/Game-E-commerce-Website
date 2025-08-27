package com.webgame.webgame.dto.loginDto;

public class EmailRequest {
    private String email;

    public EmailRequest(String email) {
        this.email = email;
    }
    public EmailRequest() {
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

