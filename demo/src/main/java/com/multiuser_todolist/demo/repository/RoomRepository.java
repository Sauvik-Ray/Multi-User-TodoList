package com.multiuser_todolist.demo.repository;

import com.multiuser_todolist.demo.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByJoinKey(String joinKey);
    boolean existsByJoinKey(String joinKey);
}
