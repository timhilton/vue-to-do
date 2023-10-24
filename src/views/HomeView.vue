<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoListStore } from '@/stores/todolist';
import { storeToRefs } from 'pinia';

const newTodo = ref('')
const store = useTodoListStore();
const { todos } = storeToRefs(store);

store.fetchTodos();

const addTodo = () => {
  const todo = {
    position: todos.value.length + 1,
    text: newTodo.value,
    done: false
  }
  store.addTodo(todo);
  todos.value.push(todo);
  newTodo.value = ''
}

const removeTodo = (todo: any) => {
  store.deleteTodo(todo);
  todos.value.splice(todos.value.indexOf(todo), 1)
}

const toggleTodo = (todo: any) => {
  store.markAsDone(todo);
  todo.done = !todo.done
}

const reversedTodos = computed(() => [...todos.value].sort((a, b) => b.position - a.position));
</script>

<template>
  <main>
    <h2>Vue To Do List</h2>

    <article>
      <form @submit.prevent="addTodo">
        <input type="text" v-model="newTodo" placeholder="Remember something" />
        <button>Add</button>
      </form>
      <ul>
        <li v-for="todo in reversedTodos" :key="todo.id">
          <input type="checkbox" @click="toggleTodo(todo)" :checked="todo.done"/>
          <p :class="{done: todo.done}">{{ todo.text }}</p>
          <button @click="removeTodo(todo)">🚫</button>
        </li>
      </ul>
    </article>
  </main>
</template>

<style scoped>  
  main {
    width: 75%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 3vw;
    margin-bottom: 4vw;
  }

  .done {
    text-decoration: line-through;
    opacity: 0.65;
  }

  form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.5em;
    border-bottom: 1px solid var(--text);
  }

  li {
    display: grid;
    grid-template-columns: 2em 1fr 2em;
    align-items: center;
    padding: .5em 0;
    border-bottom: 1px solid var(--text);    
  }

  li button {
    background-color: transparent;
    border: none;
    height: 2em;
    width: 2em;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  li p {
    font-size: 1.5em;
  }

  input {
    width: 75%;
    height: 2em;
    font-size: 1.5em;
    padding: 0.5em;
    border: 1px solid black;
    border-radius: 5px;
  }

  input[type="checkbox"] {
    width: 1em;
    height: 1em;
    margin-right: 1em;
    border-radius: 50%;
    position: relative;
    border: 1px solid var(--text);
    background-color: transparent;
  }

  input[type="checkbox"]::after {
    content: '';
    position: absolute;
    display: flex;
    place-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: var(--text);
    border: 1px solid var(--text);
    border-radius: 2px;
    background-color: var(--background);
  }

  input[type="checkbox"]:checked {
    background-color: transparent
  }

  input[type="checkbox"]:checked::after {
    content: '✅';
    margin-top: -0.125em;
    font-size: 1.05em;
    border: none;
  }

  button {
    font-size: 1.5em;
    height: 2em;
    padding: 0 0.5em;
    border: 1px solid black;
    border-radius: 5px;
    background: white;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  ul {
    list-style: none;
    padding: 0;
  }
</style>
