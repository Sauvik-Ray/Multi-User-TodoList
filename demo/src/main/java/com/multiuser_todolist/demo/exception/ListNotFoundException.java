package com.multiuser_todolist.demo.exception;

public class ListNotFoundException extends RuntimeException{
    public  ListNotFoundException(String message){
        super(message);
    }
}
