package com.multiuser_todolist.demo.dto.item;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateItemResponse {
    private Long itemId;
    private String content;
    private boolean completed;
    private Long listId;
}
