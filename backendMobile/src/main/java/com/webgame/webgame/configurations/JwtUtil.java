package com.webgame.webgame.configurations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;  // key

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Tạo token chứa userId và role
    public String generateToken(Long userId, String role, String email) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("email", email)
                .claim("role", role) //role
                .setIssuedAt(new Date()) // time tạo token
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Key và thuật toán
                .compact();
    }

    // giải token
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody(); // giải xong trả về claims
    }

    //ktra tính hợp lệ của token
    public boolean isTokenValid(String token, Long userId) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject().equals(userId.toString()) // check id
                && claims.getExpiration().after(new Date()); // check time
    }
}
