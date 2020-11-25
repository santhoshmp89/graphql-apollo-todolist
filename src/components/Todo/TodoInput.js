/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

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
  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({variables: {todo: inputTodo, isPublic}});
      }}
    >
      <input className="input" placeholder="What needs to be done?" value={inputTodo} onChange={(e) => setInputTodo(e.target.value)}  />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
