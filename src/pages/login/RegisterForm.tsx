import { useState } from "react";
import axios from "axios";

const RegisterForm = (props: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          email,
          password,
          role,
        },
      );

      const user = res.data.data.user;
      
      const token = res.data.data.token;

      localStorage.setItem("token", token);

      console.log("registration successful");

      if (role === "customer")
        window.location.href = `/customer/${user._id}/dashboard`;
      else if (role === "owner")
        window.location.href = `/owner/${user._id}/dashboard`;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`absolute w-1/2 h-full bg-white flex items-center text-[#333] text-center z-[1] transition-all duration-[600ms] ease-in-out delay-[1200ms] ${props.active ? "right-1/2" : "right-[-50%]"} ${props.active ? "visible" : "invisible"}`}
    >
      <form onSubmit={handleRegister} className="w-full">
        <h1 className="text-[36px] font-bold mb-6">Create Account</h1>
        <div className="relative w-full h-13 mb-4 px-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative w-full h-13 mb-4 px-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative w-full h-13 mb-6 px-4">
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-full mb-6 px-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 py-3 rounded-lg border transition ${
                role === "customer"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`flex-1 py-3 rounded-lg border transition ${
                role === "owner"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              Owner
            </button>
          </div>
        </div>
        <button
          type="submit"
          className=" relative w-70 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 border-0 outline-none cursor-pointer text-base"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
