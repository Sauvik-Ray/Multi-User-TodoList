package com.multiuser_todolist.demo.controller;

import com.multiuser_todolist.demo.dto.WebSocketMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class RoomWebSocketController {
    @MessageMapping("/rooms/{roomId}/notify")
    @SendTo("/topic/rooms/{roomId}")
    public WebSocketMessage sendNotification(@Payload WebSocketMessage message) {
        return message;
    }
}
