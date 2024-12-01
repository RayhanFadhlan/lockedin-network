// NotificationToast.tsx
import { toast } from "react-hot-toast";

interface NotificationToastProps {
  avatar: string;
  title: string;
  content: string;
  t: { id: string };
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  avatar,
  title,
  content,
  t
}) => {
  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img className="h-10 w-10 rounded-full" src={avatar} alt="" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{content}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-linkedinblue focus:outline-none focus:ring-2 hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
