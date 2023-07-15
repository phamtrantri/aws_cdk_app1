import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface Item {
  id: string;
  title: string;
  status: "done" | "undone";
}

function App() {
  const [list, setList] = useState<Item[]>([
    {
      id: "1",
      title: "Todo 1",
      status: "undone",
    },
    {
      id: "2",
      title: "Todo 2",
      status: "done",
    },
  ]);

  const handleUpdate = (id: string) => {
    setList(
      list.map((elem) => {
        if (elem.id === id) {
          return {
            ...elem,
            status: elem.status === "done" ? "undone" : "done",
          };
        }

        return elem;
      })
    );
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };

  const handleAdd = () => {
    console.log("addd");
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
              <input type="checkbox" onClick={() => handleUpdate(elem.id)} checked={elem.status === 'done'} />
              <span
                style={{
                  textDecoration:
                    elem.status === "done" ? "line-through" : undefined,
                }}
              >
                {elem.title}
              </span>
              <button type="button" onClick={() => handleDelete(elem.id)}>
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
