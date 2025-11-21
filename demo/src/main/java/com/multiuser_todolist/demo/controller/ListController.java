package com.multiuser_todolist.demo.controller;

import com.multiuser_todolist.demo.dto.list.*;
import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.entity.ToDoList;
import com.multiuser_todolist.demo.service.RoomService;
import com.multiuser_todolist.demo.service.ToDoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ListController {

    @Autowired
    private ToDoListService toDoListService;

    @Autowired
    private RoomService roomService;

    @PostMapping("/lists/{roomId}")
    public ResponseEntity<CreateListResponse> createList(
            @PathVariable Long roomId,
            @RequestBody CreateListRequest request
    ) {
        ToDoList list = toDoListService.createList(roomId, request.getName(), request.getUsername());

        CreateListResponse response = new CreateListResponse(
                list.getId(),
                list.getName(),
                list.getRoom().getId(),
                list.getModifiedBy(),
                list.getUpdatedAt()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping("/lists/room/{roomId}")
    public ResponseEntity<FetchRoomListsResponse> getListsByRoom(
            @PathVariable Long roomId
    ) {
        List<ToDoList> lists = toDoListService.getListsByRoom(roomId);

        List<ToDoListDTO> dtos = lists.stream()
                .map(list -> new ToDoListDTO(
                        list.getId(),
                        list.getName(),
                        list.getModifiedBy(),
                        list.getUpdatedAt()
                )).toList();

        Room room = roomService.getRoomById(roomId);

        FetchRoomListsResponse response = new FetchRoomListsResponse(
                roomId,
                room.getName(),
                dtos
        );

        return ResponseEntity.ok(response);
    }

    // UPDATE LIST
    @PutMapping("/lists/{listId}")
    public ResponseEntity<UpdateListResponse> updateList(
            @PathVariable Long listId,
            @RequestBody UpdateListRequest request
    ) {
        ToDoList list = toDoListService.updateList(listId, request.getName(), request.getUsername());

        UpdateListResponse response = new UpdateListResponse(
                list.getId(),
                list.getName(),
                list.getRoom().getId(),
                list.getModifiedBy(),
                list.getUpdatedAt()
        );

        return ResponseEntity.ok(response);
    }

    // DELETE LIST
    @DeleteMapping("/lists/{listId}")
    public ResponseEntity<String> deleteList(
            @PathVariable Long listId
    ) {
        toDoListService.deleteList(listId);
        return ResponseEntity.ok("List deleted successfully!");
    }
}
