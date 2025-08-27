package com.webgame.webgame.service.imageGame;

import com.webgame.webgame.model.ImageGame;

import java.util.List;

public interface ImageGameService {
    List<Object[]> getImgByGameId(Long gameId);
}
