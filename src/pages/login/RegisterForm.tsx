const RegisterForm = (props: any) => {
  console.log(props.active + "register");

  return (
    <div
      className={`absolute w-1/2 h-full bg-white flex items-center text-[#333] text-center z-[1] transition-all duration-[600ms] ease-in-out delay-[1200ms] ${props.active ? "right-1/2" : "right-[-50%]"} ${props.active ? "visible" : "invisible"}`}
    >
      <form action="" className="w-full">
        <h1 className="text-[36px] font-bold mb-6">Create Account</h1>
        <div className="relative w-full h-13 mb-4 px-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
          />
        </div>
        <div className="relative w-full h-13 mb-4 px-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
          />
        </div>
        <div className="relative w-full h-13 mb-6 px-4">
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
          />
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
