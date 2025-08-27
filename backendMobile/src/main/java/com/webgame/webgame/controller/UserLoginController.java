package com.webgame.webgame.controller;

import com.webgame.webgame.configurations.JwtUtil;
import com.webgame.webgame.dto.loginDto.*;
import com.webgame.webgame.model.User;
import com.webgame.webgame.repository.UserRepository;
import com.webgame.webgame.service.userLogin.UserLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

@RestController
public class UserLoginController {

    @Autowired
    private UserLoginService userLoginService;


    @PostMapping("/registerApi")
    public ResponseEntity<Map<String, String>> saveRegisterUser(@RequestBody UserResponse userResponse) {
        User userEmail = userRepository.findByEmail(userResponse.getEmail());
        User userPhone = userRepository.findByPhone(userResponse.getPhone());

        if (userEmail == null && userPhone == null) {
            UserLoginDto userLoginDto = new UserLoginDto();
            userLoginDto.setRole("user");
            userLoginDto.setEmail(userResponse.getEmail());
            userLoginDto.setPhone(userResponse.getPhone());
            userLoginDto.setPassword(userResponse.getPassword());
            userLoginDto.setUsername(userResponse.getUsername());

            userLoginService.save(userLoginDto);

            // Lấy user mới tạo để tạo token
            User newUser = userRepository.findByEmail(userResponse.getEmail());

            String token = jwtUtil.generateToken(newUser.getUserId(), newUser.getRole(), newUser.getEmail());

            return ResponseEntity.ok(Map.of("token", token));
        } else {
            if (userEmail != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email đã tồn tại"));
            else
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Số điện thoại đã tồn tại"));
        }
    }


    @PostMapping("/loginApi")
    public ResponseEntity<Map<String,String>> login(@RequestBody UserRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null ) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email chưa đăng kí"));
        }
        if (!new BCryptPasswordEncoder().matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Mật khẩu không đúng"));
        }
        String token = jwtUtil.generateToken(user.getUserId(), user.getRole(), user.getEmail());
        // Trả JSON: { "token": "<jwt>" }
        return ResponseEntity.ok(Map.of("token", token));
    }

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject PasswordEncoder để mã hóa mật khẩu mới


    @PostMapping("/sendOTP")
    public ResponseEntity<Boolean> sendEmail(@RequestBody EmailRequest emailRequest) {
        String email = emailRequest.getEmail(); // Lấy email từ đối tượng
        System.out.println("Received email: " + email);

        Boolean check = false;
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(check);
        }

        String OTP = generateRandomPassword();

        System.out.println("OTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP: ");
        System.out.println(OTP);

        // Cập nhật otp vào csdl
        user.setOTP(OTP);
        user.setOTP_create_at(LocalDateTime.now());
        userRepository.save(user);

        // Gửi mật khẩu mới chưa mã hóa tới email người dùng

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ntdl19062003@gmail.com");
        message.setTo(email);  // Gửi email tới người dùng
        message.setSubject("BDLVGaming-FORGOT PASSWORD");
        message.setText("Mã OTP của bạn là : " + OTP +"\nMã OTP có hiệu lực trong vòng 5 phút");

        mailSender.send(message);
        check = true;
        return ResponseEntity.ok(check);
    }
    @PostMapping("/checkOTP_resetPassword")
    public ResponseEntity<Map<String,String>> checkOTP(@RequestBody OTPDto otpDto) {
        String email = otpDto.getEmail();
        String passOTP = otpDto.getOTP();
        String password = otpDto.getPassword();

        User user = userRepository.findByEmail(email);

        System.out.println("OTPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP: ");
        System.out.println(email);

        if (!passOTP.equalsIgnoreCase(user.getOTP()) && user.getOTP() != null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "sai thong tin dang nhap"));
        }
        else {
            user.setOTP(null);
            user.setOTP_create_at(null);
            String newPassword = passwordEncoder.encode(password);
            user.setPassword(newPassword);
            userRepository.save(user);
            String token = jwtUtil.generateToken(user.getUserId(), user.getRole(), user.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        }
    }

    private String generateRandomPassword() {
        return new Random()
                .ints(6, 0, 10)  // Tạo một luồng số nguyên ngẫu nhiên (6 số, giá trị từ 0 đến 9)
                .mapToObj(String::valueOf)  // Chuyển từng số thành chuỗi
                .reduce("", String::concat);  // Nối các chuỗi lại thành một chuỗi duy nhất
    }




}
