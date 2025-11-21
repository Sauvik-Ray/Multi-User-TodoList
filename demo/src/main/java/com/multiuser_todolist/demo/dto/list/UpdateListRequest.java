package com.multiuser_todolist.demo.dto.list;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListRequest {
    private String name;
    private String username;
}
