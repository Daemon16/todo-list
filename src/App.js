import { useEffect, useState, useCallback, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

function App() {
  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("list"));
    if (list && list.length > 0) setTodo(list);
  }, []);

  const removeItem = (id) => {
    const newTodo = todo.filter((e) => e.id !== id);
    setTodo(newTodo);
    localStorage.removeItem("list");
    localStorage.setItem("list", JSON.stringify(newTodo));
    fire();
  };

  const addItem = () => {
    if (title.length === 0 || description.length === 0) {
      alert("Please fill all the inputs");
      return;
    }

    const newTodo =
      todo.length > 0
        ? [
            ...todo,
            {
              id: todo[todo.length - 1].id + 1,
              title,
              description,
            },
          ]
        : [
            {
              id: 1,
              title,
              description,
            },
          ];
    setTodo(newTodo);
    setTitle("");
    setDescription("");
    localStorage.removeItem("list");
    localStorage.setItem("list", JSON.stringify(newTodo));
  };

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  return (
    <div className="bg-white shadow rounded-lg mx-auto w-6/12 my-10 h-4/5 overflow-auto">
      <div className="px-4 py-5 sm:px-6">
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          To Do List
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          You list of todos for today
        </p>
        <div className="mt-10">
          {todo.length > 0 ? (
            todo.map((data) => (
              <div
                key={todo.id}
                className="grid space-y-3 md:space-y-0 md:flex md:relative my-3 p-3 min-w-full border-gray-300 border-2 rounded-md"
              >
                <div className="">
                  <h3 className="text-md leading-6 font-small">{data.title}</h3>
                  <h5 className="mt-1 max-w-2xl text-sm text-gray-500">
                    {data.description}
                  </h5>
                </div>
                <div className="md:absolute md:right-5">
                  <button
                    className="w-full md:w-32 bg-red-500 p-3 rounded-lg text-white"
                    onClick={() => removeItem(data.id)}
                  >
                    Finish
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-2xl leading-6 text-gray-500 my-10 mx-auto w-full text-center">
              Go ahead and add a new item
            </div>
          )}
        </div>
        <div className="flex flex-col spacy-y-5">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none my-2 border-b-2 border-gray-200 rounded-sm md:w-2/3 mx-auto w-full"
            maxLength={50}
          ></input>
          <textarea
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none my-2 border-b-2 border-gray-200 rounded-sm md:w-2/3 mx-auto w-full"
          ></textarea>
          <button
            className="w-full md:w-32 bg-green-500 p-3 mt-5 rounded-lg mx-auto text-white"
            onClick={() => addItem()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
