package com.webgame.webgame.repository;

import com.webgame.webgame.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query(value = """
    SELECT category_id, category_name, category_img
    FROM category c
   """, nativeQuery = true)
    List<Category> getAllCategoryList();

    @Query("SELECT MAX(c.categoryId) FROM Category c")
    Long findMaxId();

    @Query(value = """
     SELECT category_id, category_name, category_img
     FROM category c
     where c.category_name = :categoryName
   """, nativeQuery = true)
    Category getCategoryByName(@Param("categoryName") String categoryName);

    // Thêm category (nếu chưa tồn tại)
    @Modifying
    @Query(value = """
        INSERT INTO category (category_id, category_name)
        VALUES (:categoryId, :categoryName)
        """, nativeQuery = true)
    void insertCategory(
            @Param("categoryId") Long categoryId,
            @Param("categoryName") String categoryName
    );
}
