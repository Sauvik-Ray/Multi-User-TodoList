package com.multiuser_todolist.demo.dto.list;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ToDoListDTO {
    private Long id;
    private String name;
    private String modifiedBy;
    private LocalDateTime updatedAt;
}
