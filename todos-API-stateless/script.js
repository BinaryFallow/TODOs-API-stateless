document.getElementById('displayTodos').addEventListener('click', async () => {
    const response = await fetch('/todos');
    const todos = await response.json();
  
    const display = document.getElementById('todoDisplay');
    display.innerHTML = '';
  
    todos.forEach(todo => {
      const div = document.createElement('div');
      div.textContent = `Name: ${todo.name}, Priority: ${todo.priority}, Fun: ${todo.isFun ? 'Yes' : 'No'}`;
      display.appendChild(div);
    });
  });
  
    document.getElementById('submitTodo').addEventListener('click', async () => {
      const name = document.getElementById('todoName').value;
      const priority = document.getElementById('todoPriority').value || 'low';
      const isFun = document.getElementById('todoIsFun').value || 'true';
    
      if (!name.trim()) {
        alert('Todo name is required!');
        return;
    }  
      const todo = { name, priority, isFun };
    
      const response = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
    
      const result = await response.json();
      alert(`Todo added: ${JSON.stringify(result)}`);
    });
    
    document.getElementById('deleteTodo').addEventListener('click', async () => {
      const id = document.getElementById('todoIdToDelete').value;
      const response = await fetch(`/todos/${id}`, { method: 'DELETE'});
      const result = await response.json();
      alert(result.message);
  });
    