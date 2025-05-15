import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { ApiError } from '../middlewares/errorHandler';

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
      user: {
        id: user.id,
        email: user.email,
        // username: user.username,
        // full_name: user.full_name,
        created_at: user.created_at
      }
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

    const user = await UserModel.findByUserName(req.body.username);

    const { username, full_name } = req.body;

    const updatedUser = await UserModel.updateProfile(req.user.id, {
      username,
      full_name
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
};

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

    const user = await UserModel.findByEmail(req.body.email);
    if (user) {
      await UserModel.deleteById(user.id);
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