import Warehouse from "../models/warehouse.model.js";

export const getWarehouseStructure = async (req, res) => {
  
  try {
    const warehouses = await Warehouse.find().sort({ aisleNumber: 1 });
    console.log('Found warehouses:', warehouses);
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

