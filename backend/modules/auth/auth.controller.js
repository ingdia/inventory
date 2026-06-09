import jwt from "jsonwebtoken";
import User from "./user.model.js";

function signAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

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
  };
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [],
      });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [],
      });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { accessToken, user: sanitizeUser(user) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
      errors: [],
    });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
        errors: [],
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        errors: [],
      });
    }

    const accessToken = signAccessToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
      errors: [],
    });
  }
}

export async function logout(req, res) {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
      errors: [],
    });
  }
}

export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    message: "Profile retrieved",
    data: { user: sanitizeUser(req.user) },
  });
}

export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        errors: [],
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
      errors: [],
    });
  }
}
