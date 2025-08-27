package com.webgame.webgame.service.userLogin;

import com.webgame.webgame.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OTPservice {

    @Autowired
    private UserRepository userRepository;

    @Scheduled(fixedRate = 60000)
    public void removeExpiredOtps() {
        LocalDateTime otpTime = LocalDateTime.now().minusMinutes(5); //thời điểm hiện tại - 5p
        userRepository.deleteOTP(otpTime);
//        System.out.println("Xóa OTP hết hạn lúc: " + LocalDateTime.now());
    }
}
