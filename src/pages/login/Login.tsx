import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ToggleBoxLeft from "./ToggleBoxLeft";
import ToggleBoxRight from "./ToggleBoxRight";
import { useState } from "react";

const Login = (props:any) => {
  const [active, setActive] = useState(false);

  return (
    <div className="flex justify-center items-center">
      
      <div
        className={`relative w-[850px] h-[550px] bg-white m-20 rounded-2xl shadow-2xl overflow-hidden`}
      >
        
        <LoginForm active={active} />
        <RegisterForm active={active} />
        <div
          className={`absolute w-full h-full
            before:content-['']
            before:absolute
            before:w-[300%]
            before:h-full
            before:bg-emerald-600
            before:rounded-[80px]
            before:z-[2]
            before:transition-all
            before:duration-[1800ms]
            before:ease-in-out
            ${active ? "before:left-1/2" : "before:left-[-250%]"}`}
        >
          <ToggleBoxLeft active={active} setActive={setActive} />
          <ToggleBoxRight active={active} setActive={setActive} />
          <button
          onClick={() => props.setIsOpen(false)}
          className="absolute z-5 top-4 right-4 font-bold text-gray-600"
        >
          ✕
        </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
