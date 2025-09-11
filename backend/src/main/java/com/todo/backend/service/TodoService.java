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
        List<Todo> allTodos = todoRepository.findTopLevelTodos();
        
        return allTodos.stream()
                .filter(todo -> matchesFilters(todo, status, dueBefore, text))
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * Checks if a todo matches the given filters, including checking subtasks
     * @param todo The todo to check
     * @param status Filter by todo status (optional)
     * @param dueBefore Filter by due date before specified time (optional)
     * @param text Filter by text content in description (optional)
     * @return true if the todo matches the filters
     */
    private boolean matchesFilters(Todo todo, TodoStatus status, LocalDateTime dueBefore, String text) {
        // Check if the main todo matches the filters
        boolean mainTodoMatches = true;
        
        if (status != null && todo.getStatus() != status) {
            mainTodoMatches = false;
        }
        
        if (dueBefore != null && todo.getDueDate() != null && 
            todo.getDueDate().isAfter(dueBefore)) {
            mainTodoMatches = false;
        }
        
        if (text != null && !text.isEmpty() && 
            !todo.getDescription().toLowerCase().contains(text.toLowerCase())) {
            mainTodoMatches = false;
        }
        
        // If main todo matches all filters, include it
        if (mainTodoMatches) {
            return true;
        }
        
        // If main todo doesn't match, check if any subtask can make it match
        if (todo.getSubtasks() != null && !todo.getSubtasks().isEmpty()) {
            // Check if any subtask matches the text filter (if text filter is present)
            boolean hasMatchingSubtask = false;
            
            if (text != null && !text.isEmpty()) {
                hasMatchingSubtask = todo.getSubtasks().stream()
                        .anyMatch(subtask -> subtask.getDescription().toLowerCase().contains(text.toLowerCase()));
            } else {
                // If no text filter, any subtask counts as a match for text
                hasMatchingSubtask = true;
            }
            
            // If we have a matching subtask for text, check if the main todo matches other filters
            if (hasMatchingSubtask) {
                boolean mainTodoMatchesOtherFilters = true;
                
                if (status != null && todo.getStatus() != status) {
                    mainTodoMatchesOtherFilters = false;
                }
                
                if (dueBefore != null && todo.getDueDate() != null && 
                    todo.getDueDate().isAfter(dueBefore)) {
                    mainTodoMatchesOtherFilters = false;
                }
                
                return mainTodoMatchesOtherFilters;
            }
        }
        
        return false;
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
