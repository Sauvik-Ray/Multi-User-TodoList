package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.ToDoItem;

import java.util.List;

public interface ToDoItemService {

    ToDoItem createItem(Long listId, String content);

    List<ToDoItem> getItemsByList(Long listId);

    ToDoItem updateItem(Long itemId, String content, Boolean completed);

    void deleteItem(Long itemId);
}

