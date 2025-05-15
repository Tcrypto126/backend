import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
// import walletRoutes from './walletRoutes';
// import transactionRoutes from './transactionRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/wallet', walletRoutes);
// router.use('/bonus', bonusRoutes);

export default router;