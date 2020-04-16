// src/useStatefulFields.js
//CUSTOM HOOKS//
import React, { useState } from "react";
import axios from "./aios";
import { useStatefulFields } from "./useStatefulFields";
import { useAuthSubmit } from "./useAuthSubmit";

export default function Login() {
  const [values, handleChange] = useStatefulFields();
  const [error, handleSubmit] = useAuthSubmit("/login", values);

  return (
    <form>
      {error && <p> something broke! </p>}
      <input
        onChange={handleChange}
        name="email"
        type="text"
        placeholder="email"
      />
      <input
        onChange={handleChange}
        name="password"
        type="password"
        placeholder="password"
      />
      <button onClick={handleSubmit}>log in</button>
      <Link to="/reset">Forgot Password?</Link>
    </form>
  );
}

export function useStatefulFields() {
  const [values, setValues] = useState({});

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return [values, handleChange];
}
