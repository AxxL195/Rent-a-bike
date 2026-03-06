import Login from "../pages/login/Login";

const LoginModal = (props: any) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <Login isOpen={props.isOpen} setIsOpen={props.setIsOpen} />
    </div>
  );
};

export default LoginModal;