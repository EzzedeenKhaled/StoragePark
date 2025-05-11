import { useState, useEffect } from 'react';
import Header from '../../../../components/Admin/Header';
import { toast } from 'react-hot-toast';
import axios from '../../../../lib/axios';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Store = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [addRowAisle, setAddRowAisle] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [detailsRow, setDetailsRow] = useState(null);
  const [detailsItems, setDetailsItems] = useState([]);
  const [detailsPartner, setDetailsPartner] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouse/structure');
      if (response.data.statusCode === 200) {
        setWarehouses(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch warehouse data');
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch warehouse data');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post('/warehouse/reset');
      toast.success('Warehouse reset!');
      fetchWarehouses();
    } catch {
      toast.error('Failed to reset warehouse');
    }
  };

  const handleViewDetails = async (row) => {
    try {
      const res = await axios.get(`/admins/allProducts`);
      const items = Array.isArray(res.data) ? res.data.filter(item => String(item.reservedRowId) === String(row._id)) : [];
      setDetailsItems(items);
      
      // Get partner information from the first item that has it
      const itemWithPartner = items.find(item => item.partner);
      if (itemWithPartner?.partner) {
        setDetailsPartner(itemWithPartner.partner);
      } else {
        setDetailsPartner(null);
      }
      setDetailsRow(row);
    } catch (error) {
      console.error('Error fetching row details:', error);
      toast.error('Failed to fetch row details');
    }
  };

  const handleDeleteRow = async () => {
    try {
      const response = await axios.delete(`/warehouse/${deleteRow.aisle.aisleNumber}/rows/${deleteRow.row._id}`);
      
      if (response.data.statusCode === 200) {
        toast.success('Reservation removed successfully');
        setDeleteRow(null);
        fetchWarehouses();
      }
    } catch (error) {
      if (error.response?.data?.statusCode === 400) {
        // Show items in the row that prevent removal
        const items = error.response.data.items;
        toast.error(
          <div>
            <p className="font-semibold mb-2">Cannot remove reservation with active items:</p>
            <ul className="list-disc pl-4">
              {items.map(item => (
                <li key={item._id}>{item.productName} (Qty: {item.quantity})</li>
              ))}
            </ul>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.error(error.response?.data?.message || 'Failed to remove reservation');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30">
        <div className={`${editRow || addRowAisle || deleteRow || detailsRow ? 'backdrop-blur-md' : ''}`}>
          <Header />
        </div>
      </div>
      <div className="min-h-screen flex flex-col mt-16">
        {/* Title Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Reset All Storage
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {warehouses.map(aisle => (
                <div key={aisle._id} className="bg-white shadow-sm rounded-lg border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Aisle {aisle.aisleNumber}
                        </h3>
                        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                          aisle.storageType === 'standard' ? 'bg-green-100 text-green-800' :
                          aisle.storageType === 'fragile' ? 'bg-red-100 text-red-800' :
                          aisle.storageType === 'temperature' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {aisle.storageType.charAt(0).toUpperCase() + aisle.storageType.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => setAddRowAisle(aisle)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Row
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions (W×D)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {aisle.rows.map(row => (
                            <tr key={row._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.rowNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{row.side}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.dimensions.width}×{row.dimensions.depth} cm</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  row.status === 'available' ? 'bg-green-100 text-green-800' :
                                  row.status === 'reserved' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => setEditRow({ aisle, row })}
                                    className="text-blue-500 hover:text-blue-600"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                  {row.isReserved && (
                                    <>
                                      <button
                                        onClick={() => setDeleteRow({ aisle, row })}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <TrashIcon className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={() => handleViewDetails(row)}
                                        className="text-orange-500 hover:text-orange-600"
                                      >
                                        View Details
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Modals */}
        {(editRow || addRowAisle || deleteRow || detailsRow) && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-40">
            <div className="relative w-full max-w-md mx-4">
              {/* Blurred background layer */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-lg"></div>
              
              {/* Content layer */}
              <div className="relative">
                {editRow && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-lg">
                    <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                      <h2 className="text-xl font-semibold text-orange-800">Edit Row</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">Edit functionality coming soon...</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditRow(null)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {addRowAisle && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-lg">
                    <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                      <h2 className="text-xl font-semibold text-orange-800">Add Row</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">Add row functionality coming soon...</p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setAddRowAisle(null)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {deleteRow && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-lg">
                    <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                      <div className="flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
                        <h3 className="text-lg font-medium text-orange-800">Remove Reservation</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-6 text-center">
                        Are you sure you want to remove the reservation for row {deleteRow.row.rowNumber} in aisle {deleteRow.aisle.aisleNumber}?
                        {deleteRow.row.isReserved && (
                          <span className="block mt-2 text-orange-600">
                            The partner will be notified of this reservation removal.
                          </span>
                        )}
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setDeleteRow(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteRow}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Remove Reservation
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {detailsRow && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-lg">
                    <div className="bg-gradient-to-r from-orange-50/90 to-orange-100/90 backdrop-blur-xl px-6 py-4 rounded-t-lg border-b border-orange-200/50">
                      <h2 className="text-xl font-semibold text-orange-800">Reserved Row Details</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Partner:</span>
                          {detailsPartner ? (
                            <div className="mt-1">
                              {detailsPartner.companyName && (
                                <span className="block text-gray-900">{detailsPartner.companyName}</span>
                              )}
                              {detailsPartner.firstName && detailsPartner.lastName && (
                                <span className="block text-gray-900">
                                  {detailsPartner.firstName} {detailsPartner.lastName}
                                </span>
                              )}
                              {detailsPartner.email && (
                                <span className="block text-gray-500 text-sm">{detailsPartner.email}</span>
                              )}
                            </div>
                          ) : (
                            <span className="block text-gray-500">No partner information available</span>
                          )}
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Row Space:</span>
                          {detailsRow && (() => {
                            const totalArea = ((detailsRow.dimensions.width * detailsRow.dimensions.depth) / 10000);
                            const usedSpace = detailsItems.reduce((sum, item) => {
                              const itemArea = ((Number(item.packageWidth || 0) * Number(item.packageHeight || 0) * Number(item.quantity || 0)) / 10000);
                              return sum + (isNaN(itemArea) ? 0 : itemArea);
                            }, 0);
                            const freeSpace = Math.max(0, totalArea - usedSpace);
                            return (
                              <div className="space-y-1">
                                <span className="block text-gray-700">Total: <span className="font-semibold">{totalArea.toFixed(2)} m²</span></span>
                                <span className="block text-gray-700">Used: <span className="font-semibold">{usedSpace.toFixed(2)} m²</span></span>
                                <span className="block text-green-700 font-semibold">Free: {freeSpace.toFixed(2)} m²</span>
                              </div>
                            );
                          })()}
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Stored Items:</span>
                          {detailsItems && detailsItems.length > 0 ? (
                            <ul className="mt-2 list-disc pl-5 text-gray-800">
                              {detailsItems.map(item => (
                                <li key={item._id} className="mb-2">
                                  <div className="flex items-start">
                                    <div className="flex-1">
                                      <span className="font-medium">{item.productName}</span>
                                      <span className="text-gray-600"> (Qty: {item.quantity})</span>
                                      {item.packageWidth && item.packageHeight && (
                                        <span className="text-gray-500 text-sm block ml-4">
                                          Size: {item.packageWidth}×{item.packageHeight} cm
                                        </span>
                                      )}
                                    </div>
                                    {item.isActive !== undefined && (
                                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        item.isActive ? 'bg-orange-100 text-orange-800' : 'bg-orange-50 text-orange-600'
                                      }`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="block text-gray-500">No items found in this row.</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setDetailsRow(null)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Store; 