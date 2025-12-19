import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TableCard from '../components/TableCard';
import TableModal from '../components/TableModal';
import QRCodeModal from '../components/QRCodeModal';
import axios from 'axios';

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTableForQR, setSelectedTableForQR] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Fetch tables with QR URLs
  const fetchTables = async () => {
    try {
      setLoading(true);
      let url = '/api/tables';
      const params = [];

      if (filterStatus !== 'ALL') {
        params.push(`status=${filterStatus}`);
      }
      if (filterLocation !== 'ALL') {
        params.push(`location=${encodeURIComponent(filterLocation)}`);
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await axios.get(url);

      // Fetch QR data for each table that has a qrToken
      const tablesWithQR = await Promise.all(
        response.data.map(async (table) => {
          if (table.qrToken) {
            try {
              const qrResponse = await axios.get(`/api/tables/${table.id}/qr`);
              return { ...table, qrUrl: qrResponse.data.qrUrl };
            } catch (error) {
              return table;
            }
          }
          return table;
        })
      );

      setTables(tablesWithQR);
      setFilteredTables(tablesWithQR);
    } catch (error) {
      console.error('Error fetching tables:', error);
      alert('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/tables/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterLocation]);

  const handleAddTable = () => {
    setEditingTable(null);
    setShowModal(true);
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setShowModal(true);
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;

    try {
      await axios.delete(`/api/tables/${id}`);
      fetchTables();
      alert('Table deleted successfully!');
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('Failed to delete table');
    }
  };

  const handleToggleStatus = async (table) => {
    try {
      const newStatus = table.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await axios.patch(`/api/tables/${table.id}/status`, { status: newStatus });
      fetchTables();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update table status');
    }
  };

  const handleSaveTable = async (tableData) => {
    try {
      if (editingTable) {
        // Update existing table
        await axios.put(`/api/tables/${editingTable.id}`, tableData);
        alert('Table updated successfully!');
      } else {
        // Create new table
        await axios.post('/api/tables', tableData);
        alert('Table created successfully!');
      }
      setShowModal(false);
      fetchTables();
    } catch (error) {
      console.error('Error saving table:', error);
      alert(error.response?.data?.message || 'Failed to save table');
    }
  };

  // Handle viewing QR code
  const handleViewQR = async (table) => {
    // Fetch latest QR data
    try {
      const response = await axios.get(`/api/tables/${table.id}/qr`);
      setSelectedTableForQR(response.data);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error fetching QR data:', error);
      // If no QR exists, still open modal to allow generation
      setSelectedTableForQR(table);
      setShowQRModal(true);
    }
  };

  // Handle generating/regenerating QR code
  const handleGenerateQR = async (tableId) => {
    try {
      const response = await axios.post(`/api/tables/${tableId}/qr/generate`);
      // Refresh the selected table data
      const tableResponse = await axios.get(`/api/tables/${tableId}/qr`);
      setSelectedTableForQR(tableResponse.data);
      fetchTables();
      alert('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR:', error);
      alert('Failed to generate QR code');
    }
  };

  // Handle regenerating QR code (invalidates old)
  const handleRegenerateQR = async (tableId) => {
    try {
      await axios.post(`/api/tables/${tableId}/qr/regenerate`);
      // Refresh the selected table data
      const tableResponse = await axios.get(`/api/tables/${tableId}/qr`);
      setSelectedTableForQR(tableResponse.data);
      fetchTables();
      alert('QR Code regenerated successfully! The old QR code is now invalid.');
    } catch (error) {
      console.error('Error regenerating QR:', error);
      alert('Failed to regenerate QR code');
    }
  };

  const stats = {
    total: tables.length,
    active: tables.filter(t => t.status === 'ACTIVE').length,
    inactive: tables.filter(t => t.status === 'INACTIVE').length,
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">Table Management</h1>
            <p className="page-subtitle">Manage tables and view table status</p>
          </div>
          <button className="btn-primary" onClick={handleAddTable}>
            + Add Table
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f8f5', color: '#27ae60' }}>
              &#129689;
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Tables</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f5e9', color: '#4caf50' }}>
              &#9989;
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ffebee', color: '#f44336' }}>
              &#10060;
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.inactive}</div>
              <div className="stat-label">Inactive</div>
            </div>
          </div>
        </div>

        {/* Tables List */}
        <div className="table-card">
          <div className="table-header">
            <h3>All Tables</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              
              <select 
                className="filter-select"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="ALL">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : filteredTables.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No tables found. Click "Add Table" to create one.
            </div>
          ) : (
            <div className="tables-grid">
              {filteredTables.map(table => (
                <TableCard
                  key={table.id}
                  table={table}
                  onEdit={handleEditTable}
                  onDelete={handleDeleteTable}
                  onToggleStatus={handleToggleStatus}
                  onViewQR={handleViewQR}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TableModal
          table={editingTable}
          locations={locations}
          onSave={handleSaveTable}
          onClose={() => setShowModal(false)}
        />
      )}

      {showQRModal && selectedTableForQR && (
        <QRCodeModal
          table={selectedTableForQR}
          qrUrl={selectedTableForQR.qrUrl}
          onClose={() => {
            setShowQRModal(false);
            setSelectedTableForQR(null);
          }}
          onRegenerate={selectedTableForQR.qrToken ? handleRegenerateQR : handleGenerateQR}
        />
      )}
    </div>
  );
};

export default TablesPage;
