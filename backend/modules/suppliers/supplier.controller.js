import Supplier from "./supplier.model.js";

export async function getSuppliers(req, res) {
  try {
    const { search, page = 1, limit = 100 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 100);
    const skip = (pageNum - 1) * limitNum;

    const [suppliers, total] = await Promise.all([
      Supplier.find(filter).sort({ name: 1 }).skip(skip).limit(limitNum),
      Supplier.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Suppliers retrieved",
      data: suppliers,
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
      message: error.message || "Failed to retrieve suppliers",
      errors: [],
    });
  }
}

export async function getSupplierById(req, res) {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Supplier retrieved",
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve supplier",
      errors: [],
    });
  }
}
