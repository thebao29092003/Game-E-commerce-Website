package com.webgame.webgame.service.accountGame;
import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.AccountGameDto;
import com.webgame.webgame.model.AccountGame;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface AccountGameService {
    // ở đây mình ko cần sắp xếp giảm dần theo tổng
    // sp bán được nữa vì mình đã sắp xếp trong câu query rồi
    Page<Object[]> totalAccountGameSold(int page, int size);
    Page<Object[]> listAccountByGameId(Long gameId, int page, int size);
    Long accountGameStatus0(Long gameId);


    void addAccountGame(JsonNode accountGameData);
    void updateAccountGameById(JsonNode accountGameData);
    void deleteAccountGameById(Long id);
}

