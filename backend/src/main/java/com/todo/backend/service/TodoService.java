package com.todo.backend.service;

import com.todo.backend.model.Todo;
import com.todo.backend.model.TodoStatus;
import com.todo.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Todo management operations
 * 
 * Provides business logic for:
 * - CRUD operations on todos
 * - Filtering todos by various criteria
 * - Managing hierarchical todo relationships
 * - Data validation and error handling
 */
@Service
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * Retrieves all todos from the database
     * @return List of all todos
     */
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    /**
     * Retrieves all todos with filtering capabilities
     * @param status Filter by todo status (optional)
     * @param dueBefore Filter by due date before specified time (optional)
     * @param text Filter by text content in description (optional)
     * @return List of filtered todos
     */
    public List<Todo> getAllTodosWithFilters(TodoStatus status, LocalDateTime dueBefore, String text) {
        return todoRepository.findTopLevelTodosWithFilters(status, dueBefore, text);
    }

    /**
     * Retrieves a todo by its ID
     * @param id The todo ID
     * @return Optional containing the todo if found
     */
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    /**
     * Creates a new todo
     * @param todo The todo to create
     * @return The created todo with generated ID
     */
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    /**
     * Updates an existing todo
     * @param id The ID of the todo to update
     * @param updatedTodo The updated todo data
     * @return The updated todo
     * @throws RuntimeException if todo is not found
     */
    public Todo updateTodo(Long id, Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setDone(updatedTodo.isDone());
                    return todoRepository.save(todo);
                })
                .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    /**
     * Deletes a todo by ID
     * @param id The ID of the todo to delete
     */
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }

    /**
     * Retrieves all todos with their subtasks loaded
     * @return List of todos with subtasks
     */
    public List<Todo> getAllTodosWithSubtasks() {
        return todoRepository.findAllWithSubtasks();
    }
}
