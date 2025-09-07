import React, { useEffect, useState } from "react";
import { fetchTodos, createTodo, Todo } from "./api";

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        fetchTodos().then(setTodos);
    }, []);

    const handleAdd = async () => {
        if (!newTodo.trim()) return;
        const todo = await createTodo({
            description: newTodo,
            dueDate: new Date().toISOString(),
        });
        setTodos([...todos, todo]);
        setNewTodo("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Todo</h1>

            <div>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter a task"
                />
                <button onClick={handleAdd}>Add</button>
            </div>

            <ul>
                {todos.map((t) => (
                    <li key={t.id}>
                        {t.description} (done: {t.done ? "yes" : "no"})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;