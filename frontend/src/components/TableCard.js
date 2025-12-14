import React from 'react';

const TableCard = ({ table, onEdit, onDelete, onToggleStatus }) => {
  const isActive = table.status === 'ACTIVE';

  return (
    <div className={`table-tile ${isActive ? 'available' : 'inactive'}`}>
      <div className="table-number">{table.tableNumber}</div>
      <div className={`table-status ${isActive ? 'available' : 'inactive'}`}>
        {isActive ? '✅ Active' : '❌ Inactive'}
      </div>
      <div className="table-info">
        <span>{table.capacity} seats</span>
        <span>{table.location || 'No location'}</span>
      </div>
      {table.description && (
        <div className="table-description">{table.description}</div>
      )}
      <div className="table-actions">
        <button 
          className="btn-small btn-edit" 
          title="Edit"
          onClick={() => onEdit(table)}
        >
          &#9998;
        </button>
        <button 
          className="btn-small btn-toggle" 
          title={isActive ? 'Deactivate' : 'Activate'}
          onClick={() => onToggleStatus(table)}
        >
          {isActive ? '🔒' : '🔓'}
        </button>
        <button 
          className="btn-small btn-delete" 
          title="Delete"
          onClick={() => onDelete(table.id)}
        >
          &#128465;
        </button>
      </div>
    </div>
  );
};

export default TableCard;
