package com.webgame.webgame.dto.loginDto;

public class OTPDto {
    String otp;
    String email;
    String password;

    public OTPDto() {
    }

    public OTPDto(String OTP, String email, String password) {
        this.otp = OTP;
        this.email = email;
        this.password = password;
    }

    public String getOTP() {
        return otp;
    }

    public void setOTP(String OTP) {
        this.otp = OTP;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
