package com.multiuser_todolist.demo.repository;

import com.multiuser_todolist.demo.entity.Room;
import com.multiuser_todolist.demo.entity.ToDoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ToDoListRepository extends JpaRepository<ToDoList, Long> {
    int countByRoom(Room room);
}
