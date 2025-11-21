package com.multiuser_todolist.demo.dto.list;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListResponse {
    private Long listId;
    private String name;
    private Long roomId;
    private String modifiedBy;
    private LocalDateTime updatedAt;
}
