const ToggleBoxRight = (props: any) => {

  const handleclick = () =>{
    props.setActive((prev:any) => !prev);
  }

  return (
    <div className={`absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[5] transition-all duration-[600ms] ease-in-out ${props.active? "right-0" : "right-[-50%]"} ${props.active? "delay-[1200ms]" : "delay-[600ms]"}`}>
        <h1 className="font-bold text-2xl">Welcome Back!</h1>
        <p className='mb-5 font-bold text-2xl'>Already have an account?</p>
        <button className='w-40 h-[46px] bg-transparent border-2 border-white shadow-none rounded-full font-bold shadow-md hover:bg-white/10 hover:shadow-lg transition-all duration-200' onClick={handleclick}>Login</button>
    </div>
  )
}

export default ToggleBoxRight