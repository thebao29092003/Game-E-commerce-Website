package com.webgame.webgame.service.game;

import com.fasterxml.jackson.databind.JsonNode;
import com.webgame.webgame.dto.gameDto.GameFormDto;
import com.webgame.webgame.model.Category;
import com.webgame.webgame.model.CategoryGame;
import com.webgame.webgame.model.Game;
import com.webgame.webgame.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
public class GameServiceImp implements GameService {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    CategoryGameRepository categoryGameRepository;

    @Autowired
    ImageGameRepository imageGameRepository;

    @Autowired
    AccountGameRepository accountGameRepository;

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    CartGameRepository cartGameRepository;

    @Autowired
    OrderRepository orderRepository;

    @Override
    public Page<Object[]> getGameList(int page, int size) {
        return gameRepository.findAllWithImgGames(PageRequest.of(page, size));
    }


    @Override
    public Page<Object[]> getGameSearchInput(String searchInput, int page, int size) {
        return gameRepository.findGamesByGameName(searchInput, PageRequest.of(page, size));
    }

    @Override
    public Page<Object[]> getGameListCategory(Long categoryId, int page, int size) {
        return gameRepository.findByCategoryGames_Category(categoryId, PageRequest.of(page, size));
    }

    @Override
    public Page<Object[]> findGamesAndQuantityCategory(int pageNo, int pageSize, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortField).ascending() :
                Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, sort);
        return gameRepository.findGamesAndQuantityCategory(pageable);
    }

    @Transactional
    @Override
    //JsonNode igdbGameData: Đối tượng chứa dữ liệu game từ IGDB API (dạng JSON), được parse sẵn bởi thư viện Jackson.
    public void addGameFromIgdb(JsonNode igdbGameData) {
        // thêm game

        //  Chuyển sang Long.
        Long gameIdNew = gameRepository.findMaxId() + 1;

        //  Chuyển sang String
        String gameName = igdbGameData.get("name").asText();

        //  Chuyển sang String
        String description = igdbGameData.get("summary").asText();

        //  Chuyển sang BigDecimal
        BigDecimal price =new BigDecimal (igdbGameData.get("price").asText());

        // Tạo thời gian hiện tại
        LocalDate createDate = LocalDateTime.now().toLocalDate();

        // gameRepository: Đối tượng repository (interface kế thừa JpaRepository) xử lý thao tác với database.
        //insertGame: Phương thức custom trong repository,
        // thường được đánh dấu bằng @Modifying và @Query để thực thi native SQL hoặc JPQL
        gameRepository.insertGame(gameIdNew, gameName, description, price, createDate);


        // Thêm các thể loại (genres) và liên kết với game
        if (igdbGameData.has("genres")) {
            for (JsonNode genre : igdbGameData.get("genres")) {

                String categoryName = genre.get("name").asText();

                // Kiểm tra xem category đã tồn tại chưa (theo tên)
                Category existingCategory = categoryRepository.getCategoryByName(categoryName);

                if(existingCategory == null){
                    Long newCategoryId  = categoryRepository.findMaxId() + 1;
                    categoryRepository.insertCategory(newCategoryId, categoryName);
                    categoryGameRepository.linkGameToCategory(gameIdNew, newCategoryId);
                } else{
                    categoryGameRepository.linkGameToCategory(gameIdNew, existingCategory.getCategoryId());
                }
            }
        }
        // thêm ảnh cho game
        if (igdbGameData.has("screenshots")) {
            for (JsonNode screenshot : igdbGameData.get("screenshots")) {
                Long imageIdNew = imageGameRepository.findMaxId() + 1;
                String imageUrl = "https:" + screenshot.get("url").asText();

                imageGameRepository.insertImage(imageIdNew, imageUrl, gameIdNew);
            }
        }
    }

    @Transactional
    @Override
    public void updateGameById(JsonNode igdbGameData) {
        // Kiểm tra game tồn tại trước
        Long gameId = igdbGameData.get("gameId").asLong();
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));

        // Cập nhật từng trường nếu có trong JSON
        if (igdbGameData.has("name")) {
            game.setGameName(igdbGameData.get("name").asText());
        }

        if (igdbGameData.has("description")) {
            game.setDescription(igdbGameData.get("description").asText());
        }

        if (igdbGameData.has("price")) {
            BigDecimal price =new BigDecimal (igdbGameData.get("price").asText());
            game.setPrice(price);
        }

        gameRepository.save(game); // JPA tự động detect changes
    }

    @Transactional
    @Override
    public void deleteGameById(Long gameId) {
        // 1. Xóa tất cả ảnh liên quan
        imageGameRepository.deleteImageByGameId(gameId);

        // 2. Xóa tất cả quan hệ thể loại
        categoryGameRepository.deleteCategoryGameByGameId(gameId);

        // 3. Xóa Account game
        accountGameRepository.deleteAccountGameByGameId(gameId);

        // 4. xóa cart
        cartGameRepository.deleteGameIncartByGameId(gameId);


        // 5. review game
        reviewRepository.deleteReviewByGameId(gameId);

        // 6. Xóa game
        gameRepository.deleteGameByGameId(gameId);
    }

    @Override
    public Object getGameById(Long id) {
        return gameRepository.findGameById(id);
    }

    @Override
    public Page<Object[]> findGameByOrderId(Long orderId, int page, int size) {
        return gameRepository.findGameByOrderId(orderId, PageRequest.of(page, size));
    }

    @Override
    public List<Object[]> gameBuy12Months() {
        return gameRepository.gameBuy12Months();
    }

    public List<CategoryGame> getCategoryGameFromDto(GameFormDto gameFormDto, Game game) {
        // Xử lý CategoryGames
        List<CategoryGame> categoryGames = new ArrayList<>();
        for (Long categoryId : gameFormDto.getCategoryIds()) {
            Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isPresent()) {
                Category category = optionalCategory.get();
                CategoryGame categoryGame = new CategoryGame(game, category);
                categoryGames.add(categoryGame);
            } else {
                System.out.println("Category ID " + categoryId + " not found!");
            }
        }
        return categoryGames;
    }


    @Override
    public List<Category> findCategoriesByGameId(Long gameId) {
        return gameRepository.findCategoriesByGameId(gameId);
    }
}
