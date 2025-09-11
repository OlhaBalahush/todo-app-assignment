package com.todo.backend.repository;

import com.todo.backend.model.Todo;
import com.todo.backend.model.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Todo entity operations
 * 
 * Provides data access methods for:
 * - Basic CRUD operations (inherited from JpaRepository)
 * - Custom queries for filtering and searching
 * - Hierarchical todo relationships
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // Basic finder methods
    List<Todo> findByDueDateBefore(LocalDateTime date);
    // List<Todo> findByDescriptionContainingIgnoreCase(String text);
    
    // Query to fetch todos with their subtasks
    @Query("SELECT t FROM Todo t LEFT JOIN FETCH t.subtasks")
    List<Todo> findAllWithSubtasks();
    
    // Query to fetch top-level todos with their subtasks loaded for filtering
    @Query("SELECT t FROM Todo t LEFT JOIN FETCH t.subtasks WHERE t.parent IS NULL")
    List<Todo> findTopLevelTodos();
}
