import React from 'react';
import QRCode from 'react-qr-code';

const TableCard = ({ table, onEdit, onDelete, onToggleStatus, onViewQR }) => {
  const isActive = table.status === 'ACTIVE';
  const hasQR = !!table.qrToken;

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

      {/* QR Code Preview */}
      {hasQR && table.qrUrl && (
        <div className="table-qr-preview" onClick={() => onViewQR(table)}>
          <QRCode
            value={table.qrUrl}
            size={60}
            level="L"
            style={{ height: 'auto', maxWidth: '100%', width: '60px' }}
          />
        </div>
      )}

      <div className="table-actions">
        <button
          className="btn-small btn-qr"
          title={hasQR ? 'View QR Code' : 'Generate QR Code'}
          onClick={() => onViewQR(table)}
        >
          {hasQR ? '📱' : '➕'}
        </button>
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
