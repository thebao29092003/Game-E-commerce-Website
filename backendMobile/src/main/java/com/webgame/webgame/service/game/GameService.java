package com.webgame.webgame.service.game;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.gameDto.GameFormDto;
import com.webgame.webgame.model.Category;
import com.webgame.webgame.model.Game;
import lombok.extern.java.Log;
import org.springframework.data.domain.Page;

import java.io.IOException;
import java.util.List;

public interface GameService {
    // định nghĩa hàm getGameList nhận 3 param trả về kiểu Page<Game>
    // trả về 1 object page nhận 2 param là chỉ số
    // page và số lượng item của mỗi page
    // sortField: trường mình chọn để sắp xếp (ở đây sắp xếp theo
    // ngày tạo). Game có ngày tạo mới nhấn sẽ đc show lên trên
    // => sắp xếp giảm dần. Dùng cho user
    Page<Object[]> getGameList(int page, int size);
    Page<Object[]> getGameSearchInput(String searchInput, int page, int size);
    Page<Object[]> getGameListCategory(Long categoryId, int page, int size);

    // dùng cho admin
    Page<Object[]> findGamesAndQuantityCategory(int pageNo, int pageSize, String sortField, String sortDirection);
    void addGameFromIgdb(JsonNode igdbGameData);
    void updateGameById(JsonNode igdbGameData);
    void deleteGameById(Long id);
    Object getGameById(Long id);
    Page<Object[]> findGameByOrderId(Long orderId, int page, int size);
    List<Object[]> gameBuy12Months ();

    List<Category> findCategoriesByGameId(Long gameId);


}
