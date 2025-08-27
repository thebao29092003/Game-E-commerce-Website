package com.webgame.webgame.controller;

import com.webgame.webgame.model.Category;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.service.accountGame.AccountGameService;
import com.webgame.webgame.service.category.CategoryService;
import com.webgame.webgame.service.game.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/home")
public class HomeController {
    @Autowired
    GameService gameService;
    @Autowired
    CategoryService categoryService;

    @Autowired
    AccountGameService accountGameService;

    @GetMapping("/gameList/{pageNo}")
    public Map<String, Object> gameList(@PathVariable int pageNo) {
        int size = 10;
        // Lấy TRANG HIỆN TẠI, không lặp qua các trang trước
        Page<Object[]> gamePage = gameService.getGameList(pageNo, size);

        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage.getContent());
        response.put("currentPage", pageNo);
        response.put("totalPages", gamePage.getTotalPages());

        return response;
    }

    @GetMapping("/gameListBestSale/{pageNo}")
    public Map<String, Object> gameListBestSale(@PathVariable int pageNo) {
        int size = 10;
        // Lấy TRANG HIỆN TẠI, không lặp qua các trang trước
        Page<Object[]> gamePage = accountGameService.totalAccountGameSold(pageNo, size);

        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage.getContent());
        response.put("currentPage", pageNo);
        response.put("totalPages", gamePage.getTotalPages());

        return response;
    }


    // API lấy danh sách category
    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryService.getAllCategoryList();
    }

    @GetMapping("/search")
    public Map<String, Object> searchGame(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "searchInput") String searchInput

    ) {
        int size = 10;
        Page<Object[]> gamePage = gameService.getGameSearchInput(searchInput, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", gamePage.getTotalPages());
        return response;
    }

    @GetMapping("/category")
    public Map<String, Object> getGamesByCategory(@RequestParam(value = "page") int page,
                                                  @RequestParam(value = "categoryId") Long categoryId) {
        int size = 10;
        Page<Object[]> gamePage = gameService.getGameListCategory(categoryId, page, size); // Trả về view hiển thị danh sách game
        Map<String, Object> response = new HashMap<>();
        response.put("gameList", gamePage.getContent());
        response.put("currentPage", page);
        response.put("totalPages", gamePage.getTotalPages());
        return response;
    }

}
