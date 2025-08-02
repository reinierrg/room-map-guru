// NotFound.jsx
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
      <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
      <p className="text-lg text-slate-600 mt-2 mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Ir al inicio
      </Link>
    </div>
  );
}