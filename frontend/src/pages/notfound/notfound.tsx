import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>

      <Link to="/" className="mt-6 text-linkedinblue hover:underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;