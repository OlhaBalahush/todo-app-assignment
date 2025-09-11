/**
 * Todo status enumeration
 */
export enum TodoStatus {
    TODO = "TODO",
    DONE = "DONE"
}

/**
 * Todo interface representing a todo item
 */
export interface Todo {
    /** Unique identifier for the todo */
    id?: number;
    /** Description of the todo task */
    description: string;
    /** Due date in ISO string format */
    dueDate: string;
    /** Current status of the todo */
    status?: TodoStatus;
    /** Creation timestamp in ISO string format */
    createdAt?: string;
    /** Nested subtasks */
    subtasks?: Todo[];
    /** Legacy property for backward compatibility */
    done?: boolean;
}