import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { ApiError } from '../middlewares/errorHandler';

const admin_email: string = process.env.ADMIN_EMAIL || "a@a.com";
const admin_pass: string = process.env.ADMIN_PASSWORD || "Asd123!@#";

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not autorized"
      })
    }

    const { username, full_name, avatar, password } = req.body;
    let user;

    if (username) {
      user = await UserModel.findByUserName(username);
      if (user && user.id !== req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Username already in use"
        })
      }
    }

    const updatedUser = await UserModel.updateProfile(req.user.id, {
      username,
      full_name,
      avatar,
      password
    });

    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// Update user balance
export const updateBalance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {

  } catch (error) {
    next(error)
  }
}

// Update user bonus
export const updateBonus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not autorized"
      })
    }

    const { email, bonus } = req.body;

    await UserModel.updateProfile(req.user.id, {
      bonus
    });

    const user = await UserModel.findByEmail(email);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const updatedUser = await UserModel.updateProfile(user.id, {
      bonus
    });

    res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  };
}

// Get all user
export const getAllUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.email !== admin_email) {
      return res.status(403).json({
        success: false,
        message: "You do not have admin permission"
      })
    }

    const users = await UserModel.findAllUser();

    res.status(200).json({
      success: true,
      users: users
    })
  } catch (error) {
    next(error)
  }
}

// Delete the user
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.email !== admin_email) {
      return res.status(403).json({
        success: false,
        message: "You do not have admin permission"
      })
    }

    const deleteUser = await UserModel.findByEmail(req.body.email);
    if (deleteUser) {
      await UserModel.deleteById(deleteUser.id);
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(201).json({
      success: true,
      message: "User removed successfully"
    })
  } catch (error) {
    next(error)
  }
}
