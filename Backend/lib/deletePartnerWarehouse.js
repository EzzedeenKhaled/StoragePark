import mongoose from 'mongoose';
import Warehouse from '../models/warehouse.model.js';

export const deletePartnerWarehouse = async (partnerId) => {
  try {
    await Warehouse.updateMany(
      { 'rows.reservedBy': partnerId },
      {
        $set: {
          'rows.$[elem].isReserved': false,
          'rows.$[elem].status': 'available',
          'rows.$[elem].reservedBy': null,
          'rows.$[elem].reservationStartDate': null,
          'rows.$[elem].reservationEndDate': null,
        }
      },
      {
        arrayFilters: [{ 'elem.reservedBy': new mongoose.Types.ObjectId(partnerId) }]
      }
    );

    console.log(`Cleared warehouse reservations for partner ${partnerId}`);
  } catch (error) {
    console.error('Error clearing warehouse reservations:', error);
    throw error;
  }
};
