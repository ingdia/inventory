import User from "../auth/user.model.js";

function sanitizeUser(user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isActive: user.isActive,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function getUsers(req, res) {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    return res.status(200).json({
      success: true,
      message: "Users retrieved",
      data: { users, pagination: { page: pageNum, pages: Math.ceil(total / limitNum), total } },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
      errors: [],
    });
  }
}

export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
        errors: [],
      });
    }

    const user = await User.create({ firstName, lastName, email, password, role, phone });
    return res.status(201).json({
      success: true,
      message: "User created",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
      errors: [],
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { firstName, lastName, phone, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user",
      errors: [],
    });
  }
}

export async function deactivateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deactivated",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to deactivate user",
      errors: [],
    });
  }
}

export async function activateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "User activated",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to activate user",
      errors: [],
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: { user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
      errors: [],
    });
  }
}
