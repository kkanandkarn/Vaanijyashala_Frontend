const Modal = ({ children, customStyle }: any) => {
  return (
    <div
      className="fixed flex inset-0
     z-50 justify-center items-center bg-opacity-70 bg-black h-screen w-screen"
    >
      <div className={`bg-slate-700 ${customStyle}`}>{children}</div>
    </div>
  );
};

export default Modal;
