import Warehouse from "../models/warehouse.model.js";
import Item from "../models/item.model.js";
import User from "../models/user.model.js";
import { sendNotificationEmail } from "../lib/mail.js";

import seedWarehouses from '../seed/warehouse.seed.js';

export const resetWarehouse = async (req, res) => {
  try {
    await seedWarehouses(); // This clears and reseeds the warehouse collection
    return res.status(200).json({
      statusCode: 200,
      message: "Warehouse reset successfully"
    });
  } catch (error) {
    console.error('Error resetting warehouse:', error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Failed to reset warehouse"
    });
  }
};

export const getWarehouseStructure = async (req, res) => {
  
  try {
     const warehouses = await Warehouse.find().sort({ aisleNumber: 1 });
     return res.status(200).json({
      statusCode: 200,
      data: warehouses,
      message: "Warehouse structure retrieved successfully"
    });


  } catch (error) {
    console.error('Error in getWarehouseStructure:', error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Internal server error"
    });
  }
};

 export const getAisleDetails = async (req, res) => {
  try {
    const { aisleId } = req.params;
    const warehouse = await Warehouse.findOne({ aisleNumber: aisleId });
    
    if (!warehouse) {
      return res.status(404).json({
        statusCode: 404,
        message: "Aisle not found"
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: warehouse,
      message: "Aisle details retrieved successfully"
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Internal server error"
    });
  }
};


export const updateRowStatus = async (req, res) => {
  try {
    const { aisleId, rowId } = req.params;
    const { isReserved, reservedBy, startDate, endDate } = req.body;

    const warehouse = await Warehouse.findOne({ aisleNumber: aisleId });
    if (!warehouse) {
      return res.status(404).json({
        statusCode: 404,
        message: "Aisle not found"
      });
    }

    const row = warehouse.rows.id(rowId);
    if (!row) {
      return res.status(404).json({
        statusCode: 404,
        message: "Row not found"
      });
    }

    row.isReserved = isReserved;
    row.reservedBy = reservedBy;
    row.reservationStartDate = startDate;
    row.reservationEndDate = endDate;
    row.status = isReserved ? "reserved" : "available";

    await warehouse.save();

    return res.status(200).json({
      statusCode: 200,
      data: row,
      message: "Row status updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Internal server error"
    });
  }
};

export const deleteRow = async (req, res) => {
  try {
    const { aisleId, rowId } = req.params;

    // Find the warehouse and row
    const warehouse = await Warehouse.findOne({ aisleNumber: aisleId });
    if (!warehouse) {
      return res.status(404).json({
        statusCode: 404,
        message: "Aisle not found"
      });
    }

    const row = warehouse.rows.id(rowId);
    if (!row) {
      return res.status(404).json({
        statusCode: 404,
        message: "Row not found"
      });
    }

    // Check if there are any active items in this row
    const activeItemsInRow = await Item.find({ 
      reservedRowId: rowId,
      isActive: true 
    });
    
    if (activeItemsInRow.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Cannot remove reservation with active items",
        items: activeItemsInRow
      });
    }

    // If row is reserved, get the partner's email before clearing the reservation
    let partnerEmail = null;
    if (row.isReserved && row.reservedBy) {
      const partner = await User.findById(row.reservedBy);
      if (partner) {
        partnerEmail = partner.email;
      }
    }

    // Clear the reservation instead of deleting the row
    row.isReserved = false;
    row.reservedBy = null;
    row.reservationStartDate = null;
    row.reservationEndDate = null;
    row.status = "available";

    await warehouse.save();

    // If there was a partner, send them an email
    if (partnerEmail) {
      const emailSubject = "Storage Space Reservation Cancelled";
      const emailMessage = `Dear Partner,\n\nThis email is to inform you that your reservation for storage space in Aisle ${aisleId}, Row ${row.rowNumber} has been cancelled by the administrator.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nStoragePark Team`;
      
      await sendNotificationEmail(partnerEmail, emailSubject, emailMessage);
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Reservation removed successfully"
    });

  } catch (error) {
    console.error("Error removing row reservation:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to remove reservation",
      error: error.message
    });
  }
}; 

