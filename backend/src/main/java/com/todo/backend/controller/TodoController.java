package com.todo.backend.controller;

import com.todo.backend.model.Todo;
import com.todo.backend.model.TodoStatus;
import com.todo.backend.service.TodoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<Todo> getTodos(
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueBefore,
            @RequestParam(required = false) String text
    ) {
        // Use optimized database-level filtering for better performance
        return todoService.getAllTodosWithFilters(status, dueBefore, text);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo,
                           @RequestParam(required = false) Long parentId) {
        if (parentId != null) {
            Todo parent = todoService.getTodoById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            todo.setParent(parent);
        }
        return todoService.createTodo(todo);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        try {
            return ResponseEntity.ok(todoService.updateTodo(id, todo));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}