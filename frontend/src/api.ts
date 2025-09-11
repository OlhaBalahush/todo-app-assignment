import { Todo, TodoStatus } from "./types";

// Base URL for the todo API
const API_URL = "http://localhost:8080/api/todos";

/**
 * Interface for todo filtering criteria
 */
export interface TodoFilters {
    /** Filter by todo status */
    status?: TodoStatus;
    /** Filter by due date before specified date (ISO string) */
    dueBefore?: string;
    /** Filter by text content in description */
    text?: string;
}

/**
 * Fetches todos from the API with optional filtering
 * @param filters Optional filtering criteria
 * @returns Promise resolving to array of todos
 * @throws Error if API request fails
 */
export async function fetchTodos(filters?: TodoFilters): Promise<Todo[]> {
    const params = new URLSearchParams();
    
    // Build query parameters
    if (filters?.status !== undefined) params.append('status', filters.status);
    if (filters?.dueBefore) {
        // Convert date to ISO datetime format (end of day) for backend compatibility
        const dueBeforeDate = new Date(filters.dueBefore + 'T23:59:59');
        params.append('dueBefore', dueBeforeDate.toISOString());
    }
    if (filters?.text) params.append('text', filters.text);
    
    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    // Ensure we always return an array to prevent .map() errors
    return Array.isArray(data) ? data : [];
}

/**
 * Creates a new todo
 * @param todo Partial todo object with required fields
 * @returns Promise resolving to the created todo
 */
export async function createTodo(todo: Partial<Todo>): Promise<Todo> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    return res.json();
}

/**
 * Updates an existing todo
 * @param id ID of the todo to update
 * @param todo Partial todo object with fields to update
 * @returns Promise resolving to the updated todo
 */
export async function updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    return res.json();
}

/**
 * Deletes a todo by ID
 * @param id ID of the todo to delete
 * @returns Promise that resolves when deletion is complete
 */
export async function deleteTodo(id: number): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
}

/**
 * Creates a subtask for an existing todo
 * @param parentId ID of the parent todo
 * @param todo Subtask todo object
 * @returns Promise resolving to the created subtask
 */
export async function createSubtask(parentId: number | undefined, todo: Todo) {
    const res = await fetch(`${API_URL}?parentId=${parentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    return res.json();
}
