package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.exception.InvalidAdminKeyException;
import com.multiuser_todolist.demo.exception.InvalidDataException;
import com.multiuser_todolist.demo.exception.RoomNotFoundException;
import com.multiuser_todolist.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public Room createRoom(String name, String username) {
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidDataException("Room name cannot be empty");
        }

        if (username == null || username.trim().isEmpty()) {
            throw new InvalidDataException("Username cannot be empty");
        }

        Room room = new Room();
        room.setName(name.trim());
        room.setUsername(username.trim());
        room.setAdminKey(generateAdminKey());
        room.setJoinKey(generateUniqueJoinKey());
        return roomRepository.save(room);
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException("Room not found for ID: " + id));
    }

    @Override
    public Room updateRoom(Long roomId, String name, String adminKey) {
        Room room = getRoomById(roomId);

        if (!room.getAdminKey().equals(adminKey)) {
            throw new InvalidAdminKeyException("Invalid admin key!");
        }

        if (name == null || name.trim().isEmpty()) {
            throw new InvalidDataException("Room name cannot be empty");
        }

        room.setName(name.trim());
        room.setUpdatedAt(LocalDateTime.now());
        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long roomId, String adminKey) {
        Room room = getRoomById(roomId);

        if (!room.getAdminKey().equals(adminKey)) {
            throw new InvalidAdminKeyException("Invalid admin key!");
        }

        roomRepository.delete(room);
    }

    @Override
    public Room getRoomByJoinKey(String joinKey) {
        return roomRepository.findByJoinKey(joinKey)
                .orElse(null);
    }


    private String generateAdminKey() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 6);
    }

    private String generateUniqueJoinKey() {
        String key;
        do {
            key = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        } while (roomRepository.existsByJoinKey(key));
        return key;
    }

}