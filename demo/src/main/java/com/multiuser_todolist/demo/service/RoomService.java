package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.Room;

public interface RoomService {
    Room createRoom(String name, String username);

    Room getRoomById(Long id);

    void deleteRoom(Long roomId, String adminKey);

    Room updateRoom(Long roomId, String name, String adminKey);

    Room getRoomByJoinKey(String joinKey);

}
