package com.webgame.webgame.configurations;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    // phương thức gọi mỗi lần có request
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        System.out.println("request: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                // Gọi đúng
                Claims claims = jwtUtil.extractAllClaims(token); // giải token -> lấy claims

                String userId = claims.getSubject(); // lấy id

                String role = claims.get("role", String.class); //lấy role

                var auth = new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
                SecurityContextHolder.getContext().setAuthentication(auth); // => tạo subj xác thực => cho spring security cho biết người dùng đã login

            } catch (Exception ex) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "token khong hop le");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
