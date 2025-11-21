package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.ToDoList;

import java.util.List;

public interface ToDoListService {
    ToDoList createList(Long roomId, String name, String username);
    List<ToDoList> getListsByRoom(Long roomId);
    ToDoList updateList(Long listId, String name, String username);
    void deleteList(Long listId);
}


