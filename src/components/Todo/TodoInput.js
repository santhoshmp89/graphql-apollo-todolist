/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import { GET_MY_TODOS } from "./TodoPrivateList";

const ADD_TODO = gql`
  mutation addTodo($todo: String!, $isPublic: Boolean!) {
    insert_todos(objects: {title: $todo, is_public: $isPublic}) {
      affected_rows
      returning {
        id
        title
        created_at
        is_completed
      }
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const TodoInput = ({ isPublic = false }) => {
  const [addTodo] = useMutation(ADD_TODO);
  const [inputTodo, setInputTodo] = useState("");
  const resetInput = () => {
    setInputTodo("");
  };
  const updateCache = (cache, {data}) => {
    if(isPublic) {
      return null;
    }
    
    const existingTodos = cache.readQuery({
      query: GET_MY_TODOS
    });

    const newTodo = data.insert_todos.returning[0];
    cache.writeQuery({  
      query: GET_MY_TODOS,
      data: {todos: [newTodo, ...existingTodos.todos]}
    });
  };
  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({
          variables: {todo: inputTodo, isPublic},
          // optimisticResponse: true,
          update: updateCache,
          onCompleted: resetInput
        });
      }}
    >
      <input className="input" placeholder="What needs to be done?" value={inputTodo} onChange={(e) => setInputTodo(e.target.value)}  />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
