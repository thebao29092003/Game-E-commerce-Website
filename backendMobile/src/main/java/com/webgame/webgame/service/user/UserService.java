package com.webgame.webgame.service.user;

import com.webgame.webgame.dto.UserDto;
import com.webgame.webgame.model.User;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface UserService {
    User getUserById(Long id) ;
    Object getUserTotalSpent(Long id);
    List<Object[]> getSpentPerMonth(Long id);
    User getUserByEmail(String email);
    void updateUser(Long id, UserDto userDto) throws IOException;
    User getUserByPhone(String phone);
    Page<Object[]> listUser(int page, int size);
    Page<Object[]> getUserByName(String userName, int page, int size);
    Long hasUserBuyGame (Long userId, Long gameId);
}
