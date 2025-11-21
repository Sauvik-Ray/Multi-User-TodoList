package com.multiuser_todolist.demo.exception;

public class MaxListLimitException extends RuntimeException
{
    public MaxListLimitException(String message){
        super(message);
    }
}
