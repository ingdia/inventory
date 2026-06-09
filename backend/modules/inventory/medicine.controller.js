import Medicine from "./medicine.model.js";

export async function getMedicines(req, res) {
  try {
    const { search, page = 1, limit = 30 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 30);
    const skip = (pageNum - 1) * limitNum;

    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
      Medicine.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Medicines retrieved",
      data: {
        medicines,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve medicines",
      errors: [],
    });
  }
}

export async function getMedicineById(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Medicine retrieved",
      data: medicine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve medicine",
      errors: [],
    });
  }
}
