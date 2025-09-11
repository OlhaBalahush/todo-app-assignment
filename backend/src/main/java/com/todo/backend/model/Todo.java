package com.todo.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Column(name = "created_at")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @Column(name = "due_date")
    @JsonProperty("dueDate")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    private TodoStatus status = TodoStatus.TODO;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonBackReference
    private Todo parent;


    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Todo> subtasks = new ArrayList<>();


    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Constructors
    public Todo() {}

    public Todo(String description, LocalDateTime dueDate) {
        this.description = description;
        this.createdAt = LocalDateTime.now();
        this.dueDate = dueDate;
        this.status = TodoStatus.TODO;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public TodoStatus getStatus() {
        return status;
    }

    public void setStatus(TodoStatus status) {
        this.status = status;
    }

    // Convenience methods for backward compatibility
    public boolean isDone() {
        return status == TodoStatus.DONE;
    }

    public void setDone(boolean done) {
        this.status = done ? TodoStatus.DONE : TodoStatus.TODO;
    }

    public Todo getParent() {
        return parent;
    }

    public void setParent(Todo parent) {
        this.parent = parent;
    }

    public List<Todo> getSubtasks() {
        return subtasks;
    }

    public void setSubtasks(List<Todo> subtasks) {
        this.subtasks = subtasks;
    }
}
