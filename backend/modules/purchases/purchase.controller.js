// backend/modules/purchases/purchase.controller.js
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import Purchase from "./purchase.model.js";
import Medicine from "../inventory/medicine.model.js";
import { recordStockMovement } from "../inventory/inventory.service.js";

export async function createPurchase(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const processedItems = [];

    for (const item of req.body.items) {
      const medicine = await Medicine.findById(item.medicine).select("name");

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found: ${item.medicine}`,
          errors: [],
        });
      }

      const subtotal = item.quantity * item.purchasePrice;

      processedItems.push({
        medicine: item.medicine,
        medicineName: medicine.name,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        subtotal,
      });
    }

    const totalAmount = processedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const purchase = await Purchase.create({
      invoiceNumber: req.body.invoiceNumber,
      supplier: req.body.supplier,
      items: processedItems,
      totalAmount,
      status: "pending",
      purchaseDate: req.body.purchaseDate,
      expectedDelivery: req.body.expectedDelivery,
      notes: req.body.notes,
      recordedBy: req.user._id,
    });

    await purchase.populate([
      { path: "supplier", select: "name" },
      { path: "recordedBy", select: "firstName lastName" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create purchase",
      errors: [],
    });
  }
}

export async function getPurchases(req, res) {
  try {
    const {
      startDate,
      endDate,
      supplier,
      status,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) filter.purchaseDate.$gte = new Date(startDate);
      if (endDate) filter.purchaseDate.$lte = new Date(endDate);
    }

    if (supplier) {
      filter.supplier = supplier;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.invoiceNumber = { $regex: search, $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await Purchase.countDocuments(filter);
    const purchases = await Purchase.find(filter)
      .populate("supplier", "name")
      .populate("recordedBy", "firstName lastName")
      .sort({ purchaseDate: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Purchases retrieved successfully",
      data: purchases,
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
      message: error.message || "Failed to retrieve purchases",
      errors: [],
    });
  }
}

export async function getPurchaseById(req, res) {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name contactPerson phone")
      .populate("recordedBy", "firstName lastName")
      .populate("receivedBy", "firstName lastName")
      .populate("items.medicine", "name unit");

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase retrieved successfully",
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve purchase",
      errors: [],
    });
  }
}

export async function receivePurchase(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const purchase = await Purchase.findById(req.params.id).session(session);

    if (!purchase) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
        errors: [],
      });
    }

    if (purchase.status !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Purchase already marked as received",
        errors: [],
      });
    }

    for (const item of purchase.items) {
      await recordStockMovement({
        medicine: item.medicine,
        type: "stock_in",
        quantity: item.quantity,
        reason: "purchase",
        performedBy: req.user._id,
        session,
      });
    }

    purchase.status = "received";
    purchase.receivedAt = new Date();
    purchase.receivedBy = req.user._id;
    await purchase.save({ session });

    await session.commitTransaction();

    await purchase.populate([
      { path: "supplier", select: "name contactPerson phone" },
      { path: "recordedBy", select: "firstName lastName" },
      { path: "receivedBy", select: "firstName lastName" },
      { path: "items.medicine", select: "name unit" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Purchase received successfully",
      data: purchase,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to receive purchase",
      errors: [],
    });
  } finally {
    session.endSession();
  }
}

export async function cancelPurchase(req, res) {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
        errors: [],
      });
    }

    if (purchase.status === "received") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a purchase that has already been received",
        errors: [],
      });
    }

    if (purchase.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Purchase is already cancelled",
        errors: [],
      });
    }

    purchase.status = "cancelled";
    await purchase.save();

    return res.status(200).json({
      success: true,
      message: "Purchase cancelled successfully",
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel purchase",
      errors: [],
    });
  }
}
