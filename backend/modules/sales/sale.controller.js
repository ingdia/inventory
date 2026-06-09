// backend/modules/sales/sale.controller.js
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Sale from "./sale.model.js";
import { generateReceiptNumber } from "./receiptNumber.util.js";
import Medicine from "../inventory/medicine.model.js";
import { recordStockMovement } from "../inventory/inventory.service.js";

export async function createSale(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const processedItems = [];

    for (const item of req.body.items) {
      const medicine = await Medicine.findById(item.medicine)
        .select("name unit stock isActive")
        .session(session);

      if (!medicine || !medicine.isActive) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Medicine not found or inactive: ${item.medicine}`,
          errors: [],
        });
      }

      if (medicine.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`,
          errors: [],
        });
      }

      const subtotal = item.quantity * item.unitPrice;

      processedItems.push({
        medicine: item.medicine,
        medicineName: medicine.name,
        unit: medicine.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal,
      });
    }

    const subtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discountAmount = req.body.discount || 0;
    const taxAmount = req.body.tax || 0;
    const total = subtotal - discountAmount + taxAmount;
    const receiptNumber = await generateReceiptNumber();

    const [sale] = await Sale.create(
      [
        {
          receiptNumber,
          customer: req.body.customer,
          items: processedItems,
          subtotal,
          discount: discountAmount,
          tax: taxAmount,
          total,
          paymentMethod: req.body.paymentMethod,
          soldBy: req.user._id,
        },
      ],
      { session }
    );

    for (const item of processedItems) {
      await recordStockMovement({
        medicine: item.medicine,
        type: "stock_out",
        quantity: item.quantity,
        reason: "sale",
        performedBy: req.user._id,
        session,
      });
    }

    await session.commitTransaction();
    await sale.populate("soldBy", "firstName lastName email");

    return res.status(201).json({
      success: true,
      message: "Sale created successfully",
      data: sale,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create sale",
      errors: [],
    });
  } finally {
    session.endSession();
  }
}

export async function getSales(req, res) {
  try {
    const {
      startDate,
      endDate,
      paymentMethod,
      status,
      soldBy,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (status) {
      filter.status = status;
    }

    if (soldBy) {
      filter.soldBy = soldBy;
    }

    if (search) {
      filter.$or = [
        { receiptNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await Sale.countDocuments(filter);
    const sales = await Sale.find(filter)
      .populate("soldBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Sales retrieved successfully",
      data: sales,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve sales",
      errors: [],
    });
  }
}

export async function getSaleById(req, res) {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("soldBy", "firstName lastName email")
      .populate("items.medicine", "name");

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sale retrieved successfully",
      data: sale,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve sale",
      errors: [],
    });
  }
}

export async function getTodaySummary(req, res) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [summary] = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          transactionCount: { $sum: 1 },
          averageSaleValue: { $avg: "$total" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Today's summary retrieved successfully",
      data: {
        totalRevenue: summary?.totalRevenue ?? 0,
        transactionCount: summary?.transactionCount ?? 0,
        averageSaleValue: summary?.averageSaleValue ?? 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve today's summary",
      errors: [],
    });
  }
}

export async function getSummaryByRange(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(422).json({
        success: false,
        message: "startDate and endDate are required",
        errors: [],
      });
    }

    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    const [summary, dailyBreakdown] = await Promise.all([
      Sale.aggregate([
        {
          $match: {
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total" },
            transactionCount: { $sum: 1 },
            averageSaleValue: { $avg: "$total" },
          },
        },
      ]),
      Sale.aggregate([
        {
          $match: {
            createdAt: { $gte: rangeStart, $lte: rangeEnd },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: 1,
            count: 1,
          },
        },
        { $sort: { date: 1 } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      data: {
        totalRevenue: summary[0]?.totalRevenue ?? 0,
        transactionCount: summary[0]?.transactionCount ?? 0,
        averageSaleValue: summary[0]?.averageSaleValue ?? 0,
        dailyBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve summary",
      errors: [],
    });
  }
}
