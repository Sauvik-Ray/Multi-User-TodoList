package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.entity.ToDoList;
import com.multiuser_todolist.demo.exception.*;
import com.multiuser_todolist.demo.repository.RoomRepository;
import com.multiuser_todolist.demo.repository.ToDoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToDoListServiceImpl implements ToDoListService {

    @Autowired
    private ToDoListRepository toDoListRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public ToDoList createList(Long roomId, String name, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        int count = toDoListRepository.countByRoom(room);
        if (count >= 10) {
            throw new MaxListLimitException("A room can have max 10 lists!");
        }

        ToDoList list = new ToDoList();
        list.setName(name);
        list.setRoom(room);
        list.setModifiedBy(username);
        return toDoListRepository.save(list);
    }

    @Override
    public List<ToDoList> getListsByRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));
        return room.getToDoLists();
    }

    @Override
    public ToDoList updateList(Long listId, String name, String username) {
        ToDoList list = toDoListRepository.findById(listId)
                .orElseThrow(() -> new ListNotFoundException("List not found"));

        if (name == null || name.trim().isEmpty()) {
            throw new InvalidDataException("List name cannot be empty");
        }

        list.setName(name);
        list.setModifiedBy(username);
        return toDoListRepository.save(list);
    }

    @Override
    public void deleteList(Long listId) {
        ToDoList list = toDoListRepository.findById(listId)
                .orElseThrow(() -> new ListNotFoundException("List not found"));

        toDoListRepository.delete(list);
    }
}


