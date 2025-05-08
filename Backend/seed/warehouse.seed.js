import mongoose from 'mongoose';
import Warehouse from '../models/warehouse.model.js';

const warehouseData = [
  {
    aisleNumber: 1,
    storageType: 'standard',
    rows: [
      {
        rowNumber: 1,
        side: 'left',
        dimensions: { width: 200, height: 200, depth: 200 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'left',
        dimensions: { width: 200, height: 200, depth: 200 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 1,
        side: 'right',
        dimensions: { width: 200, height: 200, depth: 200 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'right',
        dimensions: { width: 200, height: 200, depth: 200 },
        isReserved: false,
        status: 'available'
      }
    ]
  },
  {
    aisleNumber: 2,
    storageType: 'fragile',
    rows: [
      {
        rowNumber: 1,
        side: 'left',
        dimensions: { width: 150, height: 150, depth: 150 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'left',
        dimensions: { width: 150, height: 150, depth: 150 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 1,
        side: 'right',
        dimensions: { width: 150, height: 150, depth: 150 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'right',
        dimensions: { width: 150, height: 150, depth: 150 },
        isReserved: false,
        status: 'available'
      }
    ]
  },
  {
    aisleNumber: 3,
    storageType: 'temperature',
    rows: [
      {
        rowNumber: 1,
        side: 'left',
        dimensions: { width: 180, height: 180, depth: 180 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'left',
        dimensions: { width: 180, height: 180, depth: 180 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 1,
        side: 'right',
        dimensions: { width: 180, height: 180, depth: 180 },
        isReserved: false,
        status: 'available'
      },
      {
        rowNumber: 2,
        side: 'right',
        dimensions: { width: 180, height: 180, depth: 180 },
        isReserved: false,
        status: 'available'
      }
    ]
  }
];

const seedWarehouses = async () => {
  try {
    // Clear existing data
    await Warehouse.deleteMany({});
    
    // Insert new data
    const warehouses = await Warehouse.insertMany(warehouseData);
    console.log('Warehouse data seeded successfully:', warehouses);
  } catch (error) {
    console.error('Error seeding warehouse data:', error);
  }
};

export default seedWarehouses; 