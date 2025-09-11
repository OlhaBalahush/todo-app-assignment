import React, { useState } from "react";
import { createSubtask, updateTodo, deleteTodo } from "./api";
import { Todo, TodoStatus } from "./types";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    TextField,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider
} from "@mui/material";
import {
    Edit,
    Delete,
    Add,
    CheckCircle,
    RadioButtonUnchecked,
    CalendarToday,
    Subtitles
} from "@mui/icons-material";

/**
 * Props interface for TodoList component
 */
interface TodoListProps {
    /** Array of todos to display */
    todos: Todo[];
    /** Callback function triggered when todos are modified */
    onChanged: () => void;
}

/**
 * TodoList Component
 * 
 * Renders a list of todo items with error handling
 * Supports hierarchical display of todos with subtasks
 * 
 * @param todos - Array of todos to display
 * @param onChanged - Callback when todos are modified
 */
const TodoList: React.FC<TodoListProps> = ({ todos, onChanged }) => {
    // Safety check to prevent crashes from invalid data
    if (!Array.isArray(todos)) {
        console.error('todos is not an array:', todos);
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography color="error">Error loading todos</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {todos.map((t) => (
                <TodoItem key={t.id} todo={t} onChanged={onChanged} />
            ))}
        </Box>
    );
};

/**
 * Props interface for TodoItem component
 */
interface TodoItemProps {
    /** The todo item to display */
    todo: Todo;
    /** Callback function triggered when the todo is modified */
    onChanged: () => void;
}

/**
 * TodoItem Component
 * 
 * Renders a single todo item with full CRUD functionality:
 * - Display todo information with status and due date
 * - Edit mode for updating description and due date
 * - Status toggle (TODO/DONE)
 * - Delete functionality with confirmation dialog
 * - Subtask management (add, display, edit)
 * - Material Design UI with proper accessibility
 * 
 * @param todo - The todo item to display
 * @param onChanged - Callback when todo is modified
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onChanged }) => {
    const [showAddSubtask, setShowAddSubtask] = useState(false);
    const [subDesc, setSubDesc] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editDesc, setEditDesc] = useState(todo.description);
    const [editDueDate, setEditDueDate] = useState(
        todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 10) : ""
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    /**
     * Handles creating a new subtask
     * Validates input and creates subtask with current date as due date
     */
    const handleAddSub = async () => {
        if (!subDesc.trim()) return;
        
        await createSubtask(todo.id, {
            description: subDesc,
            dueDate: new Date().toISOString(),
        });
        
        // Clear form and refresh data
        setSubDesc("");
        onChanged();
        toggleAddSubtask();
    };

    /**
     * Handles updating an existing todo
     * Validates input and updates todo with new description and due date
     */
    const handleUpdate = async () => {
        if (!editDesc.trim()) return;
        
        await updateTodo(todo.id!, {
            description: editDesc,
            // Convert date to ISO format with midnight time for consistent backend handling
            dueDate: editDueDate ? new Date(editDueDate + 'T00:00:00').toISOString() : undefined,
            status: todo.status,
        });
        
        setIsEditing(false);
        onChanged();
    };

    /**
     * Handles toggling todo status between TODO and DONE
     * Cycles through status states and updates the todo
     */
    const handleStatusChange = async () => {
        const currentStatus = todo.status || TodoStatus.TODO;
        const nextStatus = currentStatus === TodoStatus.TODO ? TodoStatus.DONE : TodoStatus.TODO;
        
        await updateTodo(todo.id!, {
            description: todo.description,
            dueDate: todo.dueDate,
            status: nextStatus,
        });
        onChanged();
    };

    /**
     * Handles deleting a todo
     * Called after user confirms deletion in the dialog
     */
    const handleDelete = async () => {
        await deleteTodo(todo.id!);
        setDeleteDialogOpen(false);
        onChanged();
    };

    /**
     * Formats a date string to a user-friendly locale date format
     */
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    /**
     * Returns the appropriate Material-UI color for a todo status
     */
    const getStatusColor = (status: TodoStatus) => {
        switch (status) {
            case TodoStatus.TODO: return "default";
            case TodoStatus.DONE: return "success";
            default: return "default";
        }
    };

    /**
     * Returns the appropriate Material-UI icon for a todo status
     */
    const getStatusIcon = (status: TodoStatus) => {
        switch (status) {
            case TodoStatus.TODO: return <RadioButtonUnchecked />;
            case TodoStatus.DONE: return <CheckCircle />;
            default: return <RadioButtonUnchecked />;
        }
    };

    /**
     * Returns the display text for a todo status
     */
    const getStatusText = (status: TodoStatus) => {
        switch (status) {
            case TodoStatus.TODO: return "TODO";
            case TodoStatus.DONE: return "Done";
            default: return "TODO";
        }
    };


    /**
     * Toggles the visibility of the add subtask form
     */
    const toggleAddSubtask = () => {
        setShowAddSubtask((prev) => !prev);
    };


    return (
        <>
            <Card 
                sx={{ 
                    mb: 1,
                    opacity: todo.status === TodoStatus.DONE ? 0.7 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            >
                <CardContent>
                    {/* Main todo content */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            {isEditing ? (
                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                                    <TextField
                                        label="Description"
                                        size="small"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        sx={{ flexGrow: 1, minWidth: 200 }}
                                    />
                                    <TextField
                                        type="date"
                                        label="Due Date"
                                        size="small"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ minWidth: 200 }}
                                    />
                                    <Button variant="contained" onClick={handleUpdate} disabled={!editDesc.trim()} sx={{ height: 40 }}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ height: 40 }}>
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    <IconButton
                                        onClick={handleStatusChange}
                                        color={getStatusColor(todo.status || TodoStatus.TODO)}
                                        title={todo.status === TodoStatus.DONE ? "Mark as TODO" : "Mark as Done"}
                                    >
                                        {getStatusIcon(todo.status || TodoStatus.TODO)}
                                    </IconButton>
                                    <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                                        {todo.description}
                                    </Typography>
                                    {todo.dueDate && (
                                        <Chip
                                            icon={<CalendarToday />}
                                            label={formatDate(todo.dueDate)}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                            sx={{ px: 1.5, py: 0.5 }} // px = horizontal padding, py = vertical padding
                                        />

                                    )}
                                </Box>
                            )}
                        </Box>

                        {/* Action buttons */}
                        {!isEditing && (
                            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                                <IconButton
                                    onClick={() => setIsEditing(true)}
                                    color="primary"
                                    title="Edit"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => setDeleteDialogOpen(true)}
                                    color="error"
                                    title="Delete"
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        )}
                    </Box>

                    {/* Subtasks section */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                        <Box sx={{ ml: 1 }}>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                <Subtitles sx={{ mr: 1, verticalAlign: "middle" }} />
                                Subtasks
                            </Typography>
                            <TodoList todos={todo.subtasks} onChanged={onChanged} />
                        </Box>
                    )}

                    {/* Add subtask section */}
                    <Box sx={{ ml: 2, mt: 2 }}>
                        {showAddSubtask ? (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <TextField
                                    label="New subtask"
                                    value={subDesc}
                                    onChange={(e) => setSubDesc(e.target.value)}
                                    placeholder="Enter subtask description"
                                    sx={{ flexGrow: 1 }}
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleAddSub}
                                    disabled={!subDesc.trim()}
                                    size="small"
                                    sx={{ height: 40 }}
                                >
                                    Add
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={toggleAddSubtask}
                                    size="small"
                                    sx={{ height: 40 }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={toggleAddSubtask}
                                size="small"
                                sx={{ height: 40 }}
                            >
                                Add Subtask
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Todo</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{todo.description}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ height: 40 }}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" sx={{ height: 40 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TodoList;
