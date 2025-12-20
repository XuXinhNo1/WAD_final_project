import api from './api';
import config from '../config';

export const tableService = {
  // Get all tables with optional filters
  getAllTables: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters.location && filters.location !== 'ALL') {
      params.append('location', filters.location);
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy);
    }
    const queryString = params.toString();
    return api.get(`/tables${queryString ? `?${queryString}` : ''}`);
  },

  // Get table by ID
  getTableById: (id) => {
    return api.get(`/tables/${id}`);
  },

  // Create new table
  createTable: (tableData) => {
    return api.post('/tables', tableData);
  },

  // Update table
  updateTable: (id, tableData) => {
    return api.put(`/tables/${id}`, tableData);
  },

  // Update table status
  updateTableStatus: (id, status) => {
    return api.patch(`/tables/${id}/status`, { status });
  },

  // Delete table
  deleteTable: (id) => {
    return api.delete(`/tables/${id}`);
  },

  // Get QR code for table
  getTableQR: (id) => {
    return api.get(`/tables/${id}/qr`);
  },

  // Regenerate QR code
  regenerateQR: (id) => {
    return api.post(`/tables/${id}/qr/regenerate`);
  },

  // Regenerate all QR codes
  regenerateAllQRs: () => {
    return api.post('/tables/qr/regenerate-all');
  },

  // Get locations
  getLocations: () => {
    return api.get('/tables/locations');
  },

  // Download QR code URL
  getDownloadQRUrl: (id) => {
    return `${config.apiUrl}/tables/${id}/qr/download`;
  },

  // Download all QR codes URL
  getDownloadAllQRUrl: () => {
    return `${config.apiUrl}/tables/qr/download-all`;
  },

  // Get menu URL with token
  getMenuUrl: (tableId, token) => {
    // Use current frontend URL or fallback
    const frontendUrl = window.location.origin;
    return `${frontendUrl}/menu?table=${tableId}&token=${token || ''}`;
  },
};

export default tableService;
