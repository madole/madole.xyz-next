import { useState } from "react";


const ClickyThing = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="w-full flex justify-center flex-col items-center border-dashed border-2 border-sky-400 p-8 gap-2 rounded-lg">
      <div className="italic text-xl text-sky-400">Interactive content</div>
      <button
        className="border-solid border-2 border-sky-400 px-4 rounded"
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
      <div className="text-sky-400 text-xl">
        Pressed: {count} time{count === 1 ? "" : "s"}
      </div>
    </div>
  );
};

export default ClickyThing;
