import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold">404</div>
        <p className="text-gray-600">That page doesn’t exist.</p>
        <Link className="text-indigo-600 underline" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}
