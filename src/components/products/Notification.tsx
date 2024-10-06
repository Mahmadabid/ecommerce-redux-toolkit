interface NotificationProps {
  message: string;
  visible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <div className="text-center fixed top-16 left-0 right-0 flex items-center justify-center">
      <div className="bg-green-600 text-white w-fit p-3 font-semibold rounded z-50">
        {message}
      </div>
    </div>
  );
};

export default Notification;
