package com.multiuser_todolist.demo.dto.room;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomResponse {
    private String roomId;
    private String name;
    private LocalDateTime createdAt;
    private String adminKey;
    private String joinKey;
}
