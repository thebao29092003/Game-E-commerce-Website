package com.webgame.webgame.controller;
import com.webgame.webgame.service.thanhtoan.BuyService;
import com.webgame.webgame.service.userLogin.CustomUserLoginDetail;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller
public class BuyController {

    @Autowired
    private BuyService buyService;

    @GetMapping("/xacnhandonhang")
    public String xacnhanbuyincart(@RequestParam(value = "selectedGames", required = false) List<Long> selectedGames, Model model, HttpSession session){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isLoggedIn = authentication != null && authentication.isAuthenticated() &&
                !(authentication.getPrincipal() instanceof String && authentication.getPrincipal().equals("anonymousUser"));
        if (isLoggedIn) {

            System.out.println(selectedGames);
//        [1, 3]

            /*Gọi cái service này ra là để trả về tổng gía và danh sách game đã được chọn để hiển thị lên cái xác nhận đơn hàng*/
            Map<String, Object> result = buyService.xacNhanDonHang(selectedGames);
            session.setAttribute("selectedGames", selectedGames);
            session.setAttribute("tonggia", result.get("tongia"));

            model.addAttribute("result", result);
            return "thanhtoan/pay";}

        else return "redirect:/register_login";
    }


    @GetMapping("/huythanhtoan")
    public String cancelPayment(HttpSession session) {
        // Remove selectedGames from session
        session.removeAttribute("selectedGames");
        return "redirect:/cart";
    }
}
