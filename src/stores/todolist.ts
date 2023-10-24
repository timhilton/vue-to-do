import { defineStore } from 'pinia'
import { initializeApp } from "firebase/app";
import firebaseConfig from '@/config/firebase';
import { 
    getFirestore,
    collection,
    addDoc,
    doc,
    updateDoc,
    onSnapshot,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore"; 

export interface Todo {
    id: string;
    text: string;
    done: boolean;
    time: any;
}

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export const useTodoListStore = defineStore('todoList', {
        state: () => ({
          todos: [] as Todo[],
          isLoading: false,
        }),
        actions: {
            async addTodo(todo: Todo) {
                await addDoc(collection(db, "todos"), {
                    todo,
                    time: serverTimestamp()
                });
            },
            async markAsDone(todo: Todo) {
                const todoRef = doc(db, "todos", todo.id);
                await updateDoc(todoRef, {
                    todo: {
                        ...todo,
                        done: !todo.done
                    }
                });
            },
            async deleteTodo(todo: Todo) {
                const todoRef = doc(db, "todos", todo.id);
                await deleteDoc(todoRef);
            },
            fetchTodos() {
                const unsub = onSnapshot(collection(db, "todos"), (querySnapshot) => {
                    const todoList = querySnapshot.docs.map((doc) => {
                        return {
                            ...doc.data().todo,
                            id: doc.id,
                        }
                    });
                    this.todos = todoList;
                });
                console.log(this.todos);
                return unsub;
            }
        },
      });