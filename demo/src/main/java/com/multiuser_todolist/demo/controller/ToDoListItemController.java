package com.multiuser_todolist.demo.controller;

import com.multiuser_todolist.demo.dto.item.CreateItemRequest;
import com.multiuser_todolist.demo.dto.item.CreateItemResponse;
import com.multiuser_todolist.demo.dto.item.ItemDTO;
import com.multiuser_todolist.demo.dto.item.UpdateItemRequest;
import com.multiuser_todolist.demo.entity.ToDoItem;
import com.multiuser_todolist.demo.service.ToDoItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ToDoListItemController {

    @Autowired
    private ToDoItemService itemService;

    // CREATE ITEM
    @PostMapping("/{listId}")
    public ResponseEntity<CreateItemResponse> createItem(
            @PathVariable Long listId,
            @RequestBody CreateItemRequest request
    ) {
        ToDoItem item = itemService.createItem(listId, request.getContent());

        CreateItemResponse response = new CreateItemResponse(
                item.getId(),
                item.getContent(),
                item.isCompleted(),
                item.getToDoList().getId()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // GET ITEMS
    @GetMapping("/{listId}")
    public ResponseEntity<List<ItemDTO>> getItems(@PathVariable Long listId) {

        List<ToDoItem> items = itemService.getItemsByList(listId);

        List<ItemDTO> response = items.stream()
                .map(i -> new ItemDTO(
                        i.getId(),
                        i.getContent(),
                        i.isCompleted(),
                        i.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // UPDATE ITEM - NO ADMIN KEY
    @PutMapping("/{itemId}")
    public ResponseEntity<ItemDTO> updateItem(
            @PathVariable Long itemId,
            @RequestBody UpdateItemRequest request
    ) {
        ToDoItem item = itemService.updateItem(
                itemId,
                request.getContent(),
                request.getCompleted()
        );

        ItemDTO response = new ItemDTO(
                item.getId(),
                item.getContent(),
                item.isCompleted(),
                item.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    // DELETE ITEM - NO ADMIN KEY
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully!");
    }
}

