import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X, Search, Users, UserPlus, Trash2 } from 'lucide-react';

const PersonDashboard = () => {
  // Tipos de personas (no eliminables)
  const [personTypes] = useState([
    { id: 'internal', name: 'Internal', color: 'bg-blue-500', icon: '👔' },
    { id: 'expedia', name: 'Expedia', color: 'bg-green-500', icon: '💻' },
    { id: 'hotelbeds', name: 'Hotelbeds', color: 'bg-purple-500', icon: '🎨' },
    { id: 'hotelunico', name: 'HotelUnico', color: 'bg-orange-500', icon: '📊' }
  ]);

  const [people, setPeople] = useState([
    // Gerentes base
    { id: 1, name: 'Room1', type: 'internal', position: 'Room1 Internal' },
    { id: 2, name: 'Room2', type: 'internal', position: 'Room2 Internal' },
    { id: 3, name: 'Room3', type: 'internal', position: 'Room3 Internal' },
    { id: 33, name: 'Room33', type: 'internal', position: 'Room33 Internal' },
    
    // Otros empleados
    { id: 4, name: 'Room4', type: 'expedia', position: 'Room4 Expedia' },
    { id: 5, name: 'Room5', type: 'expedia', position: 'Room5 Expedia' },
    { id: 6, name: 'Room6', type: 'expedia', position: 'Room6 Expedia' },
    { id: 7, name: 'Room7', type: 'expedia', position: 'Room7 Expedia' },
    { id: 8, name: 'Room8', type: 'hotelbeds', position: 'Room8 Hotelbeds' },
    { id: 9, name: 'Room9', type: 'hotelbeds', position: 'Room9 Hotelbeds' },
    { id: 10, name: 'Room10', type: 'hotelbeds', position: 'Room10 Hotelbeds' },
    { id: 11, name: 'Room11', type: 'hotelunico', position: 'Room11 HotelUnico' },
    { id: 12, name: 'Room12', type: 'hotelunico', position: 'Room12 HotelUnico' },
    { id: 13, name: 'Room13', type: 'hotelunico', position: 'Room13 HotelUnico' }
  ]);

  // Relaciones jerárquicas (supervisorId: [subordinateIds])
  const [personRelations, setPersonRelations] = useState({
    1: [10, 11],
    2: [4, 8, 11],
    3: [5, 6, 7],
    32: [],
    4: [9],
    8: [10],
    11: [12, 13]
  });

  const [expandedPeople, setExpandedPeople] = useState({});
  const [showSubordinateSelector, setShowSubordinateSelector] = useState({});
  const [subordinateSearchTerm, setSubordinateSearchTerm] = useState('');

  const addSubordinate = (supervisorId, subordinateId) => {
    setPersonRelations(prev => ({
      ...prev,
      [supervisorId]: [...(prev[supervisorId] || []), subordinateId]
    }));
    setShowSubordinateSelector(prev => ({
      ...prev,
      [supervisorId]: false
    }));
    setSubordinateSearchTerm('');
  };

  const removeSubordinate = (supervisorId, subordinateId) => {
    setPersonRelations(prev => ({
      ...prev,
      [supervisorId]: (prev[supervisorId] || []).filter(id => id !== subordinateId)
    }));
  };

  const deletePerson = (personId) => {
    const person = people.find(p => p.id === personId);
    
    // No permitir eliminar gerentes base
    if (person && person.type === 'internal') {
      const hasSubordinates = personRelations[personId] && personRelations[personId].length > 0;
      if (hasSubordinates) {
        alert('No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.');
        return;
      }
    }

    // No permitir eliminar si la persona tiene subordinados
    const hasSubordinates = personRelations[personId] && personRelations[personId].length > 0;
    if (hasSubordinates) {
      alert('No se puede eliminar una habitacion interna que tiene habitaciones hijas. Primero elimine las relaciones.');
      return;
    }

    setPeople(people.filter(person => person.id !== personId));
    // Eliminar relaciones donde esta persona es supervisor
    const newRelations = { ...personRelations };
    delete newRelations[personId];
    // Eliminar esta persona de los subordinados de otros
    Object.keys(newRelations).forEach(supervisorId => {
      newRelations[supervisorId] = newRelations[supervisorId].filter(id => id !== personId);
    });
    setPersonRelations(newRelations);
  };

  const toggleExpanded = (personId) => {
    setExpandedPeople(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  const toggleSubordinateSelector = (personId) => {
    setShowSubordinateSelector(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  const getPersonById = (id) => people.find(person => person.id === id);
  const getTypeById = (id) => personTypes.find(type => type.id === id);

  const getAvailableSubordinates = (supervisorId) => {
    const supervisor = getPersonById(supervisorId);
    const currentSubordinates = personRelations[supervisorId] || [];
    
    return people.filter(person => {
      // No puede ser subordinado de sí mismo
      if (person.id === supervisorId) return false;
      
      // No está ya como subordinado
      if (currentSubordinates.includes(person.id)) return false;
      
      // Evitar ciclos
      if (isPersonDescendant(person.id, supervisorId)) return false;
      
      // Filtro por búsqueda
      if (!person.name.toLowerCase().includes(subordinateSearchTerm.toLowerCase())) return false;
      
      // Reglas de jerarquía
      if (supervisor && supervisor.type === 'internal') {
        // Los gerentes pueden tener subordinados de cualquier tipo excepto gerentes
        return person.type !== 'internal';
      } else {
        // Los no gerentes pueden tener subordinados de cualquier tipo
        return true;
      }
    });
  };

  // Función para evitar referencias circulares
  const isPersonDescendant = (personId, potentialSupervisorId) => {
    const subordinates = personRelations[personId] || [];
    if (subordinates.includes(potentialSupervisorId)) return true;
    return subordinates.some(subordinateId => isPersonDescendant(subordinateId, potentialSupervisorId));
  };

  // Obtener solo los gerentes como elementos base
  const getManagersOnly = () => {
    return people.filter(person => person.type === 'internal');
  };

  const SubordinateItem = ({ person, supervisorId, level = 0 }) => {
    const subordinates = personRelations[person.id] || [];
    const isExpanded = expandedPeople[person.id];
    const personType = getTypeById(person.type);
    const showSelector = showSubordinateSelector[person.id];
    const availableSubordinates = getAvailableSubordinates(person.id);

    return (
      <div className={`ml-${level * 4} border-l-2 border-gray-200 pl-4 py-2`}>
        <div className="flex items-center gap-2 group">
          {subordinates.length > 0 && (
            <button
              onClick={() => toggleExpanded(person.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div className={`w-4 h-4 rounded-full ${personType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
            {personType?.icon || '👤'}
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-gray-900">{person.name}</div>
            <div className="text-sm text-gray-500">{person.position}</div>
          </div>
          
          <button
            onClick={() => toggleSubordinateSelector(person.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-100 rounded text-green-500 transition-opacity"
            title="Agregar habitacion hija"
          >
            <UserPlus size={16} />
          </button>
          
          <button
            onClick={() => removeSubordinate(supervisorId, person.id)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500 transition-opacity"
            title="Eliminar relación"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Selector de subordinados para elemento hijo */}
        {showSelector && (
          <div className="mt-2 p-3 bg-gray-50 border rounded">
            <div className="mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={subordinateSearchTerm}
                  onChange={(e) => setSubordinateSearchTerm(e.target.value)}
                  placeholder="Buscar habitaciones hijas..."
                  className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="max-h-24 overflow-y-auto">
              {availableSubordinates.length > 0 ? (
                availableSubordinates.map(subordinate => {
                  const subType = getTypeById(subordinate.type);
                  return (
                    <button
                      key={subordinate.id}
                      onClick={() => addSubordinate(person.id, subordinate.id)}
                      className="w-full px-2 py-1 text-left hover:bg-white rounded text-xs flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 rounded-full ${subType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
                        {subType?.icon || '👤'}
                      </div>
                      <div>
                        <div className="font-medium">{subordinate.name}</div>
                        <div className="text-xs text-gray-500">{subordinate.position}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-2 text-gray-500 text-xs">
                  No hay habitaciones disponibles
                </div>
              )}
            </div>
          </div>
        )}

        {isExpanded && subordinates.length > 0 && (
          <div className="mt-2">
            {subordinates.map(subordinateId => {
              const subordinate = getPersonById(subordinateId);
              return subordinate ? (
                <SubordinateItem
                  key={subordinateId}
                  person={subordinate}
                  supervisorId={person.id}
                  level={level + 1}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  const PersonCard = ({ person }) => {
    const subordinates = personRelations[person.id] || [];
    const isExpanded = expandedPeople[person.id];
    const showSelector = showSubordinateSelector[person.id];
    const personType = getTypeById(person.type);
    const availableSubordinates = getAvailableSubordinates(person.id);
    const isManager = person.type === 'internal';

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subordinates.length > 0 && (
                <button
                  onClick={() => toggleExpanded(person.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              )}
              
              <div className={`w-8 h-8 rounded-full ${personType?.color || 'bg-gray-400'} flex items-center justify-center text-white`}>
                {personType?.icon || '👤'}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-500">{person.position}</p>
                {isManager && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    Habitacion Base
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {subordinates.length > 0 && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users size={14} />
                  {subordinates.length}
                </span>
              )}
              <button
                onClick={() => toggleSubordinateSelector(person.id)}
                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500"
                title="Agregar habitacion"
              >
                <UserPlus size={18} />
              </button>
              {!isManager && (
                <button
                  onClick={() => deletePerson(person.id)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-red-500"
                  title="Eliminar habitacion"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selector de subordinados */}
        {showSelector && (
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={subordinateSearchTerm}
                  onChange={(e) => setSubordinateSearchTerm(e.target.value)}
                  placeholder="Buscar habitacion para relacionarla..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="max-h-32 overflow-y-auto">
              {availableSubordinates.length > 0 ? (
                availableSubordinates.map(subordinate => {
                  const subType = getTypeById(subordinate.type);
                  return (
                    <button
                      key={subordinate.id}
                      onClick={() => addSubordinate(person.id, subordinate.id)}
                      className="w-full px-3 py-2 text-left hover:bg-white rounded text-sm flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded-full ${subType?.color || 'bg-gray-400'} flex items-center justify-center text-xs`}>
                        {subType?.icon || '👤'}
                      </div>
                      <div>
                        <div className="font-medium">{subordinate.name}</div>
                        <div className="text-xs text-gray-500">{subordinate.position}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {subordinateSearchTerm ? 'No se encontraron habitaciones' : 'No hay habitaciones disponibles'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subordinados */}
        {isExpanded && subordinates.length > 0 && (
          <div className="p-4">
            {subordinates.map((subordinateId: string) => {
              const subordinate = getPersonById(subordinateId);
              return subordinate ? (
                <SubordinateItem
                  key={subordinateId}
                  person={subordinate}
                  supervisorId={person.id}
                  level={0}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getManagersOnly().map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>

        {getManagersOnly().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay habitaciones internas</h3>
            <p className="text-gray-500">Agrega al menos una habitacion interna para comenzar a construir la jerarquía</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDashboard;