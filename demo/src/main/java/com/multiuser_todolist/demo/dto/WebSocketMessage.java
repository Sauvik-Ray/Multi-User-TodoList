package com.multiuser_todolist.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebSocketMessage {
    private String type;
    private Object data;
}
