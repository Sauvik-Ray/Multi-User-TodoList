package com.multiuser_todolist.demo.service;

import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.entity.ToDoItem;
import com.multiuser_todolist.demo.entity.ToDoList;
import com.multiuser_todolist.demo.exception.InvalidAdminKeyException;
import com.multiuser_todolist.demo.exception.InvalidDataException;
import com.multiuser_todolist.demo.exception.ItemNotFoundException;
import com.multiuser_todolist.demo.exception.ListNotFoundException;
import com.multiuser_todolist.demo.repository.ToDoItemRepository;
import com.multiuser_todolist.demo.repository.ToDoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ToDoItemServiceImpl implements ToDoItemService {

    @Autowired
    private ToDoItemRepository itemRepository;

    @Autowired
    private ToDoListRepository listRepository;

    @Override
    public ToDoItem createItem(Long listId, String content) {
        ToDoList list = listRepository.findById(listId)
                .orElseThrow(() -> new ListNotFoundException("List not found"));

        ToDoItem item = new ToDoItem();
        item.setContent(content);
        item.setToDoList(list);
        item.setCreatedAt(LocalDateTime.now());

        return itemRepository.save(item);
    }


    @Override
    public List<ToDoItem> getItemsByList(Long listId) {
        return itemRepository.findByToDoListId(listId);
    }

    @Override
    public ToDoItem updateItem(Long itemId, String content, Boolean completed) {
        ToDoItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));

        if (content != null && !content.trim().isEmpty()) {
            item.setContent(content);
        }

        if (completed != null) {
            item.setCompleted(completed);
        }

        return itemRepository.save(item);
    }

    @Override
    public void deleteItem(Long itemId) {
        ToDoItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));

        itemRepository.delete(item);
    }
}



