export const SubordinateItem = ({ person, supervisorId, level = 0 }) => {
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