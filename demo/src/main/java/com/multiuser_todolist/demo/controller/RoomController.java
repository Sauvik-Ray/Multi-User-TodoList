package com.multiuser_todolist.demo.controller;

import com.multiuser_todolist.demo.dto.room.*;
import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(@RequestBody CreateRoomRequest request) {
        Room newRoom = roomService.createRoom(request.getName(), request.getUsername());

        CreateRoomResponse roomResponse = new CreateRoomResponse(
                String.valueOf(newRoom.getId()),
                newRoom.getName(),
                newRoom.getCreatedAt(),
                newRoom.getAdminKey(),
                newRoom.getJoinKey()
        );

        return new ResponseEntity<>(roomResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<JoinRoomResponse> getRoom(@PathVariable Long roomId) {
        Room room = roomService.getRoomById(roomId);

        JoinRoomResponse roomResponse = new JoinRoomResponse(
                room.getId(),
                room.getName(),
                room.getCreatedAt(),
                false
        );

        return ResponseEntity.ok(roomResponse);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<UpdatedRoomResponse> updateRoom(
            @PathVariable Long roomId,
            @RequestBody UpdateRoomRequest request) {

        Room updatedRoom = roomService.updateRoom(
                roomId,
                request.getName(),
                request.getAdminKey()
        );

        UpdatedRoomResponse response = new UpdatedRoomResponse(
                updatedRoom.getId(),
                updatedRoom.getName(),
                updatedRoom.getUpdatedAt()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Long roomId,
            @RequestBody DeleteRoomRequest request) {

        roomService.deleteRoom(roomId, request.getAdminKey());
        return ResponseEntity.ok("Room deleted successfully!");
    }

    @PostMapping("/join")
    public ResponseEntity<JoinRoomResponse> joinRoom(@RequestBody JoinRoomRequest request) {

        if (request.getJoinKey() == null || request.getJoinKey().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new JoinRoomResponse(null, null, null, false)
            );
        }

        Room room = roomService.getRoomByJoinKey(request.getJoinKey().trim());

        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JoinRoomResponse(null, null, null, false));
        }

        return ResponseEntity.ok(
                new JoinRoomResponse(
                        room.getId(),
                        room.getName(),
                        room.getCreatedAt(),
                        true
                )
        );
    }

}
