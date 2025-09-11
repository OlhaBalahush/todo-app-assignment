import React, { useEffect, useState, useCallback } from "react";
import { fetchTodos, createTodo, TodoFilters } from "./api";
import TodoList from "./TodoList";
import { Todo, TodoStatus } from "./types";
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse
} from "@mui/material";
import { FilterList, Add, ExpandMore, ExpandLess } from "@mui/icons-material";

/**
 * Main Todo Application Component
 * 
 * Features:
 * - Todo management (create, edit, delete, mark complete)
 * - Hierarchical todo structure with subtasks
 * - Real-time filtering by status, due date, and text search
 * - Material Design UI with responsive layout
 * - Error handling and loading states
 * 
 * State Management:
 * - todos: Array of top-level todos with their subtasks
 * - newTodo: Current input for new todo description
 * - newDueDate: Current input for new todo due date
 * - filters: Active filter criteria for todo display
 * - showFilters: UI state for filter panel visibility
 */
function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [filters, setFilters] = useState<TodoFilters>({});
    const [showFilters, setShowFilters] = useState(false);

    /**
     * Loads todos from the API with current filter criteria
     * Includes error handling to prevent crashes from invalid API responses
     */
    const loadTodos = useCallback(() => {
        fetchTodos(filters)
            .then((data) => {
                // Ensure we always set an array to prevent .map() errors
                setTodos(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error('Error fetching todos:', error);
                setTodos([]);
            });
    }, [filters]);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    /**
     * Handles creating a new todo
     * Validates input, converts date to ISO format, and refreshes the list
     */
    const handleAdd = async () => {
        if (!newTodo.trim()) return;
        
        await createTodo({
            description: newTodo,
            // Convert date to ISO format with midnight time for consistent backend handling
            dueDate: newDueDate ? new Date(newDueDate + 'T00:00:00').toISOString() : undefined,
            status: TodoStatus.TODO,
        });
        
        // Clear form and refresh data
        setNewTodo("");
        setNewDueDate("");
        loadTodos();
    };

    /**
     * Handles filter changes for search, status, and date filtering
     * Converts empty strings to undefined for proper API handling
     */
    const handleFilterChange = (key: keyof TodoFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === "" || value === undefined ? undefined : value
        }));
    };

    /**
     * Resets all filters to show all todos
     */
    const clearFilters = () => {
        setFilters({});
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Search */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={filters.text || ""}
                    onChange={(e) => handleFilterChange("text", e.target.value)}
                    placeholder="Search in descriptions"
                    sx={{ mb: 2 }}
                />
            </Box>

            {/* Todo list header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Todos ({todos.length})
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setShowFilters(!showFilters)}
                    endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
                    sx={{ height: 40 }}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
            </Box>

            {/* Filters */}
            <Collapse in={showFilters}>
                <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                    <Typography variant="h6" gutterBottom>
                        Filter Todos
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                        <FormControl sx={{ minWidth: 120, height: 40 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filters.status ?? ""}
                                onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                                label="Status"
                                size="small"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value={TodoStatus.TODO}>TODO</MenuItem>
                                <MenuItem value={TodoStatus.DONE}>Done</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            type="date"
                            label="Due Before"
                            size="small"
                            value={filters.dueBefore || ""}
                            onChange={(e) => handleFilterChange("dueBefore", e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 200 }}
                        />

                        <Button variant="outlined" onClick={clearFilters} sx={{ height: 40 }}>
                            Clear Filters
                        </Button>
                    </Box>
                </Paper>
            </Collapse>

            {/* Add new todo form */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Add New Todo
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                        <TextField
                            label="Todo description"
                            size="small"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Enter todo description"
                            sx={{ flexGrow: 1, minWidth: 200 }}
                        />
                        <TextField
                            type="date"
                            label="Due Date"
                            size="small"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 200 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAdd}
                            disabled={!newTodo.trim()}
                            sx={{ height: 40 }}
                        >
                            Add Todo
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Todo List */}
            <TodoList todos={todos} onChanged={loadTodos} />
        </Container>
    );
}

export default App;
