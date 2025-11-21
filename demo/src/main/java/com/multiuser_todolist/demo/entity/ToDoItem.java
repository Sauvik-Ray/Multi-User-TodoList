package com.multiuser_todolist.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ToDoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private boolean completed = false;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "list_id")
    private ToDoList toDoList;
}
