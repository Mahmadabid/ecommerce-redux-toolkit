interface pageErrorProps {
  message?: string;
  messageString?: string;
}

const PageError: React.FC<pageErrorProps> = ({message, messageString}) => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] text-red-600 text-xl font-semibold">
      {message} {messageString}
    </div>
  );
};

export default PageError;
