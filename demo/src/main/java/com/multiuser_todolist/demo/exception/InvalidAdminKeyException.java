package com.multiuser_todolist.demo.exception;

public class InvalidAdminKeyException extends RuntimeException{
    public InvalidAdminKeyException(String message){
        super(message);
    }
}
