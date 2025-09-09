import { Loader2 } from "lucide-react";

const Loading = ({message}: {message?: string}) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Loader2 size={48} className="mx-auto animate-spin" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Cargando...
      </h3>
      {message && <p className="text-gray-500">{message}</p>}
    </div>
  );
};

export default Loading;