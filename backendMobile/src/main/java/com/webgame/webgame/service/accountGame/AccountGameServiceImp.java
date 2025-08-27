package com.webgame.webgame.service.accountGame;
import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.AccountGameDto;
import com.webgame.webgame.model.AccountGame;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.repository.AccountGameRepository;
import com.webgame.webgame.repository.GameRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class AccountGameServiceImp implements AccountGameService {

    @Autowired
    private AccountGameRepository accountGameRepository;

    @Autowired
    private GameRepository gameRepository;

    @Override
    public Page<Object[]> totalAccountGameSold(int page, int size) {
        return accountGameRepository.findTopSellingGames(PageRequest.of(page, size));
    }

    @Override
    public Page<Object[]> listAccountByGameId(Long gameId, int page, int size) {
        return accountGameRepository.accountGameByGameId(gameId,PageRequest.of(page, size));
    }

    @Override
    public Long accountGameStatus0(Long gameId) {
        return accountGameRepository.accountGameStatus0(gameId);
    }


    @Transactional
    @Override
    public void addAccountGame(JsonNode accountGameData) {
        //  Chuyển sang String
        Long gameId = accountGameData.get("gameId").asLong();
        String username = accountGameData.get("username").asText();
        String password = accountGameData.get("password").asText();

        accountGameRepository.insertAccountGame(gameId, username, password);
    }

    @Transactional
    @Override
    public void updateAccountGameById(JsonNode accountGameData) {
        Long accountGameId = accountGameData.get("accountGameId").asLong();
        AccountGame accountGame = accountGameRepository.findById(accountGameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));

        // Cập nhật từng trường nếu có trong JSON
        if (accountGameData.has("username")) {
            accountGame.setUsername(accountGameData.get("username").asText());
        }

        if (accountGameData.has("password")) {
            accountGame.setPassword(accountGameData.get("password").asText());
        }

        accountGameRepository.save(accountGame);
    }

    @Transactional
    @Override
    public void deleteAccountGameById(Long accountGameId) {
    //  xóa account game thôi vì chả có model nào tham chiếu đến nó cả
        accountGameRepository.deleteAccountGameById(accountGameId);
    }
}