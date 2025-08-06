import express from 'express';
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher
} from '../controllers/voucherController.js';
import { requireSignIn } from '../Middlewares/authMiddlewares.js';

const router = express.Router();

// All routes require authentication
router.use(requireSignIn);

// Voucher routes
router.post('/create', createVoucher);
router.get('/get/all', getVouchers);
router.get('/get/:id', getVoucherById);
router.put('/update/:id', updateVoucher);
router.delete('/delete/:id', deleteVoucher);

export default router;