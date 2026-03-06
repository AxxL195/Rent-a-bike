const LoginForm = (props: any) => {
  
  return (
    <div
      className={`absolute w-1/2 h-full bg-white p-3 flex items-center text-gray-900 text-center z-[1] transition-[0.6s_ease-in-out_1.2s,visibility_0s_1s] ${
        props.active ? "right-[-50%] invisible" : "right-0 visible"
      }`}
    >
      <form action="" className="w-full">
        <h1 className="text-4xl font-bold mb-6">Login</h1>
        <div className="relative h-13 mb-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
          />
        </div>
        <div className="relative h-13 mb-4">
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full h-13 px-4 bg-gray-100 rounded-lg border-0 outline-none text-gray-900 font-medium placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300 transition-all"
          />
        </div>
        <div className="relative mb-8">
          <a href="#" className="text-sm text-gray-600 hover:text-emerald-600 underline transition">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="relative w-70 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 border-0 outline-none cursor-pointer text-base"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;