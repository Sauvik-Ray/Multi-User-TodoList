package com.multiuser_todolist.demo.dto.list;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FetchRoomListsResponse {
    private Long roomId;
    private String roomName;
    private List<ToDoListDTO> lists;
}
