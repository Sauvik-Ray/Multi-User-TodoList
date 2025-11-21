package com.multiuser_todolist.demo.repository;

import com.multiuser_todolist.demo.entity.ToDoItem;
import com.multiuser_todolist.demo.entity.ToDoList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToDoItemRepository extends JpaRepository<ToDoItem, Long> {

    List<ToDoItem> findByToDoListId(Long listId);
}
