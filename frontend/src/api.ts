export interface Todo {
    id: number;
    description: string;
    createdAt: string;
    dueDate: string;
    done: boolean;
}

const API_URL = "http://localhost:8080/api/todos";

export async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(API_URL);
    return res.json();
}

export async function createTodo(todo: Partial<Todo>): Promise<Todo> {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    return res.json();
}