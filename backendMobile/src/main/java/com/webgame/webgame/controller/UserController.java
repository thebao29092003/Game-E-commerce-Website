package com.webgame.webgame.controller;

import com.webgame.webgame.dto.AccountGameDto;
import com.webgame.webgame.dto.userProfile.*;
import com.webgame.webgame.dto.UserDto;
import com.webgame.webgame.model.*;
import com.webgame.webgame.repository.OrderRepository;
import com.webgame.webgame.repository.UserRepository;
import com.webgame.webgame.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/userProfile")
    public ResponseEntity<UserDto> userProfile(@RequestBody UserId id) {
        User userExist = userService.getUserById(id.getUserId());
        UserDto userDto = new UserDto();
        userDto.setUserId(userExist.getUserId());
        userDto.setUsername(userExist.getFullName());
        userDto.setEmail(userExist.getEmail());
        userDto.setPhone(userExist.getPhone());

        return new ResponseEntity<>(userDto, HttpStatus.OK);

    }

    @PostMapping("/editUsername")
    public ResponseEntity<UserDto> editUsername(@RequestBody UserName userName) {

        User userExist = userService.getUserByEmail(userName.getEmail());

        userExist.setFullName(userName.getUserName());
        userRepository.save(userExist);

        UserDto userDto = new UserDto();
        userDto.setUserId(userExist.getUserId());
        userDto.setUsername(userExist.getFullName());
        userDto.setEmail(userExist.getEmail());
        userDto.setPhone(userExist.getPhone());

        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PostMapping("/editPassword")
    public ResponseEntity<UserDto> editPassword(@RequestBody Password password) {
        User userExist = userService.getUserByEmail(password.getEmail());

        if (!new BCryptPasswordEncoder().matches(password.getOldPassword(), userExist.getPassword()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        else {
        String newPassword = passwordEncoder.encode(password.getPassword());
        userExist.setPassword(newPassword);

        userRepository.save(userExist);
        UserDto userDto = new UserDto();
        userDto.setUserId(userExist.getUserId());
        userDto.setUsername(userExist.getFullName());
        userDto.setEmail(userExist.getEmail());
        userDto.setPhone(userExist.getPhone());

        return new ResponseEntity<>(userDto, HttpStatus.OK);}
    }

    @PostMapping("/editPhone")
    public ResponseEntity<UserDto> editPassword(@RequestBody Phone phone) {
        User userExistPhone = userService.getUserByPhone(phone.getPhone());
        if ( userExistPhone != null && !phone.getEmail().equalsIgnoreCase(userExistPhone.getEmail()) )
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            User userExist = userService.getUserByEmail(phone.getEmail());
            userExist.setPhone(phone.getPhone());
            userRepository.save(userExist);

            UserDto userDto = new UserDto();
            userDto.setUserId(userExist.getUserId());
            userDto.setUsername(userExist.getFullName());
            userDto.setEmail(userExist.getEmail());
            userDto.setPhone(userExist.getPhone());
            return new ResponseEntity<>(userDto,HttpStatus.OK);
        }
    }

    @PostMapping("/editProfile")
    public ResponseEntity<UserDto> editProfile(@RequestBody EditProfile editProfile) {
        User userExist = userService.getUserById(editProfile.getUserId());
        User userExistPhone = userService.getUserByPhone(editProfile.getPhone());

        userExist.setFullName(editProfile.getUserName());
        //userRepository.save(userExist);
        if (!new BCryptPasswordEncoder().matches(editProfile.getOldPassword(), userExist.getPassword()))
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        userExist.setPassword(passwordEncoder.encode(editProfile.getPassword()));
        //userRepository.save(userExist);

        UserDto userDto = new UserDto();
        userDto.setUserId(userExist.getUserId());
        userDto.setUsername(userExist.getFullName());
        userDto.setEmail(userExist.getEmail());


        if (userExistPhone == null) {
            userExist.setPhone(editProfile.getPhone());
            userRepository.save(userExist);
            userDto.setPhone(userExist.getPhone());
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        }
        else {
            Long userIdNow = userExist.getUserId();
            Long userIdDTB = userExistPhone.getUserId();
            if (userIdNow == userIdDTB) {
                userExist.setPhone(editProfile.getPhone());
                userRepository.save(userExist);
                userDto.setPhone(userExist.getPhone());
                return new ResponseEntity<>(userDto, HttpStatus.OK);
            }
            else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/orderHistory")
    public ResponseEntity<List<OrderHistory>> orderHistory(@RequestBody UserId userId ) {
        List<Orders> orders = orderRepository.findOrdersHistoryByUserId(userId.getUserId());
        List<OrderHistory> response = orders.stream().map(order -> {
            List<AccountGameDto> accounts = order.getAccountGames().stream()
                    .map(ag -> new AccountGameDto(
                            ag.getGame().getGameName(),
                            ag.getUsername(),
                            ag.getPassword(),
                            ag.getGame().getGameImg()
                    )).toList();

            return new OrderHistory(
                    order.getOrderId(),
                    order.getCreateDate(),
                    order.getPayAt(),
                    order.getSumPrice(),
                    accounts
            );
        }).toList();

        return ResponseEntity.ok(response);

    }
    @GetMapping("listUser")
    public Map<String, Object> listOrders(
            @RequestParam("page") int page
    ) {
        int size = 10;

//        Chấp nhận tham số "ASC" hoặc "DESC"
        Page<Object[]> users = userService.listUser(page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("userList", users.getContent());
        response.put("currentPage", page);
        response.put("totalPages", users.getTotalPages());
        return response;
    }

    @GetMapping("getUserTotalSpent")
    public Map<String, Object> getUserTotalSpent(
            @RequestParam("userId") Long userId
    ) {

        Object user = userService.getUserTotalSpent(userId);
        List<Object[]> spentPerMonth = userService.getSpentPerMonth(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("spentPerMonth", spentPerMonth);
        return response;
    }

    @GetMapping("getUserByName")
    public Map<String, Object> getUserByName(
            @RequestParam("userName") String userName,
            @RequestParam("page") int page
    ) {

        int size = 10;
        Page<Object[]> userPage = userService.getUserByName(userName, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("userList", userPage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", userPage.getTotalPages());
        return response;
    }

    @GetMapping("hasUserBuyGame")
    public ResponseEntity<Map<String, Object>> hasUserBuyGame(
            @RequestParam(value = "userId") Long userId,
            @RequestParam(value = "gameId") Long gameId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long hasBuyGame =  userService.hasUserBuyGame(userId, gameId);
            response.put("status", "success");
            if(hasBuyGame == 1) {
                response.put("hasBuyGame", true);
            } else{
                response.put("hasBuyGame", false);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}