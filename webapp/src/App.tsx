import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

interface Item {
  PK: string;
  Title: string;
  Status: "done" | "undone";
}

const apiEndpoint =
  "https://g1r9ajw7f0.execute-api.ap-southeast-1.amazonaws.com";

function App() {
  const [list, setList] = useState<Item[]>([]);

  const handleGetList = async () => {
    const response = await axios.get(`${apiEndpoint}/todo/get-todo-list`);
    setList(response.data.Items);
  };

  useEffect(() => {
    handleGetList();
  }, []);

  const handleUpdate = async (PK: string, status: "done" | "undone") => {
    await axios.patch(
      `${apiEndpoint}/todo/update/${PK}`,
      {
        status: status === "done" ? "undone" : "done",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    await handleGetList();
  };

  const handleDelete = (PK: string) => {
    console.log(PK);
  };

  const handleAdd = async () => {
    await axios.post(
      `${apiEndpoint}/todo/create`,
      {
        Title: 'TODO 2',
        Status: 'undone'
      }
    );
    await handleGetList();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Hello world
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ul>
          {list.map((elem) => (
            <li>
              <input
                type="checkbox"
                onClick={() => handleUpdate(elem.PK, elem.Status)}
                checked={elem.Status === "done"}
              />
              <span
                style={{
                  textDecoration:
                    elem.Status === "done" ? "line-through" : undefined,
                }}
              >
                {elem.Title}
              </span>
              <button type="button" onClick={() => handleDelete(elem.PK)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => handleAdd()}>
          Add
        </button>
      </header>
    </div>
  );
}

export default App;
