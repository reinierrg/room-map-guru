import { useState } from "react";

const Reglas = () => {
    const [personTypes] = useState([
      { id: 'internal', name: 'Internal', color: 'bg-blue-500', icon: '👔' },
      { id: 'expedia', name: 'Expedia', color: 'bg-green-500', icon: '💻' },
      { id: 'hotelbeds', name: 'Hotelbeds', color: 'bg-purple-500', icon: '🎨' },
      { id: 'hotelunico', name: 'HotelUnico', color: 'bg-orange-500', icon: '📊' }
    ]);

  return (<div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4">
          {personTypes.map(type => (
            <div key={type.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${type.color} flex items-center justify-center text-xs text-white`}>
                {type.icon}
              </div>
              <span className="text-sm text-gray-600">{type.name}</span>
            </div>
          ))}
        </div>

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="mb-2" style={{lineHeight: '1.2rem'}}>
            <h3 className="font-medium text-blue-900">Reglas de la jerarquía:</h3>
            <small className="font-semibold text-blue-900 mb-2"> Los habitaciones internas son elementos base. Agrega habitaciones individualmente a cada habitacion</small>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Las habitaciones internas siempre se muestran como elementos base</li>
            <li>• Las habitaciones internas solo pueden tener habitacion hijas no internas</li>
            <li>• Las habitaciones no internas pueden tener habitacion hijas de cualquier tipo pero no internas</li>
            <li>• No se permiten referencias circulares</li>
          </ul>
        </div> 
  </div>);
}

export default Reglas;