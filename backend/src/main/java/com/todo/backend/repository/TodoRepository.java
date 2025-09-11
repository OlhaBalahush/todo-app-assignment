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
    List<Todo> findByDescriptionContainingIgnoreCase(String text);
    
    // Query to fetch todos with their subtasks
    @Query("SELECT t FROM Todo t LEFT JOIN FETCH t.subtasks")
    List<Todo> findAllWithSubtasks();
    
    // Optimized filtering query for top-level todos with subtasks
    // This query includes subtasks in the filtering logic - if a subtask matches,
    // its parent todo will be included in the results
    @Query("SELECT DISTINCT t FROM Todo t LEFT JOIN FETCH t.subtasks s WHERE " +
           "t.parent IS NULL AND " +
           "(" +
           "  (:status IS NULL OR t.status = :status) AND " +
           "  (:dueBefore IS NULL OR t.dueDate < :dueBefore) AND " +
           "  (:text IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :text, '%')))" +
           "  OR " +
           "  (s IS NOT NULL AND " +
           "   (:status IS NULL OR s.status = :status) AND " +
           "   (:dueBefore IS NULL OR s.dueDate < :dueBefore) AND " +
           "   (:text IS NULL OR LOWER(s.description) LIKE LOWER(CONCAT('%', :text, '%'))))" +
           ")")
    List<Todo> findTopLevelTodosWithFilters(
        @Param("status") TodoStatus status,
        @Param("dueBefore") LocalDateTime dueBefore,
        @Param("text") String text
    );
}
