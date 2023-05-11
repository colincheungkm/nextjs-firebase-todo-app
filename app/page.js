'use client';

import { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './components/Todo';
import { db } from './firebase';
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-lg shadow-xl p-4`,
  heading: `text-3xl font-semibold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 sm:mt-0 bg-emerald-300 text-slate-100`,
  count: `text-center p-2`,
};

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // CREATE todo
  const createTodo = async (e) => {
    e.preventDefault(e);

    if (input === '') {
      alert('Please enter a todo task!');
      return;
    }

    await addDoc(collection(db, 'todos'), {
      text: input,
      completed: false,
    });

    setInput('');
  };

  // READ todo
  useEffect(() => {
    const q = query(collection(db, 'todos'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((document) => {
        todosArray.push({ ...document.data(), id: document.id });
      });
      setTodos(todosArray);
    });

    return () => unsubscribe;
  }, []);

  // UPDATE todo
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todos', todo.id), {
      completed: !todo.completed,
    });
  };

  // DELETE todo
  const deleteTodo = async (todo) => {
    await deleteDoc(doc(db, 'todos', todo.id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>TO DO APP</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className={style.input}
            placeholder="Add to do"
          />
          <button className={style.button}>
            <AiOutlinePlus size={30} />{' '}
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
          ))}
        </ul>
        {todos.length < 1 ? null : <p className={style.count}>{`You have ${todos.length} todos`}</p>}
      </div>
    </div>
  );
}
