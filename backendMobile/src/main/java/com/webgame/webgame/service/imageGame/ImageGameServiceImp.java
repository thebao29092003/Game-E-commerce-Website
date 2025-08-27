package com.webgame.webgame.service.imageGame;

import com.webgame.webgame.model.Category;
import com.webgame.webgame.model.ImageGame;
import com.webgame.webgame.repository.CategoryRepository;
import com.webgame.webgame.repository.ImageGameRepository;
import com.webgame.webgame.service.category.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageGameServiceImp implements ImageGameService {

    @Autowired
    private ImageGameRepository imageGameRepository;

    @Override
    public List<Object[]> getImgByGameId(Long gameId) {
        return imageGameRepository.getListImgByGameId(gameId);
    }
}
