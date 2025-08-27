package com.webgame.webgame.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

// thực thể này lưu danh sách đường link ảnh game
// của IGDB
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageGame {
    @Id
    @Column(name = "img_game_id")
    private Long imgGameId;

    private String imgGameLink;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;
    
}