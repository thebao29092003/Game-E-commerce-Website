package com.webgame.webgame.dto.userProfile;

import lombok.Data;

@Data
public class EditProfile {
    public Long userId;
    public String userName;
    public String oldPassword;
    public String password;
    public String phone;

}
