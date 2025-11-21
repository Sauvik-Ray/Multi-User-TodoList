package com.multiuser_todolist.demo.dto.room;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomResponse {
    private Long roomId;
    private String name;
    private LocalDateTime createdAt;
    private boolean joined;
}
