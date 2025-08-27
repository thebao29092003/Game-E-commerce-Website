package com.webgame.webgame.service.user;

import com.webgame.webgame.dto.UserDto;
//import com.webgame.webgame.dto.UserLoginDto;
import com.webgame.webgame.dto.gameDto.GameFormDto;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.model.User;
import com.webgame.webgame.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public User getUserById(Long id) {
        return userRepository.findUserById(id);
    }

    @Override
    public Object getUserTotalSpent(Long id) {
        return userRepository.getUserTotalSpent(id);
    }

    @Override
    public List<Object[]> getSpentPerMonth(Long id) {
        return userRepository.getSpentPerMonth(id);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public void updateUser(Long id, UserDto userDto) throws IOException {
        User user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy người dùng với ID: " + id)
        );
        user.setFullName(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        userRepository.save(user);
    }

    @Override
    public User getUserByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    @Override
    public Page<Object[]> listUser(int page, int size) {

            Pageable pageable = PageRequest.of(page, size);

            return userRepository.listUser(pageable);

    }

    @Override
    public Page<Object[]> getUserByName(String userName, int page, int size) {
        return userRepository.findUserByName(userName, PageRequest.of(page, size));
    }

    @Override
    public Long hasUserBuyGame(Long userId, Long gameId) {
        return userRepository.hasUserBuyGame(userId, gameId);
    }
}