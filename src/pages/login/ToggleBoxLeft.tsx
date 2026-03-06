const ToggleBoxLeft = (props: any) => {

  const handleclick = () => {
    props.setActive((prev:any) => !prev);
  }

  return (
    <div
      className={`absolute w-1/2 h-full text-white  flex flex-col justify-center items-center z-[5] transition-all duration-[600ms] ease-in-out ${props.active? "left-[-50%]" : "left-0"} ${props.active? "delay-[600ms]" : "delay-[1200ms]"} `}
    >
      <h1 className="text-2xl font-bold">Hello,Welcome!</h1>
      <p className='mb-5 text-2xl font-bold'>Don't have an account?</p>
      <button className="w-40 h-[46px] bg-transparent border-2 border-white shadow-none rounded-full font-semibold hover:bg-white/10 hover:shadow-lg transition-all duration-200" onClick={handleclick}>
        Sign Up
      </button>
    </div>
  );
};

export default ToggleBoxLeft;
