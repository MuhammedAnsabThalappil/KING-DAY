import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as productController from '../controllers/productController';
import * as orderController from '../controllers/orderController';
import * as paymentController from '../controllers/paymentController';
import * as adminController from '../controllers/adminController';
import { adminGuard } from '../middlewares/authGuard';

const router = Router();

// --- Auth Routes ---
router.post('/auth/login', authController.login);

// --- Public Product Routes ---
router.get('/products', productController.getAllProducts);
router.get('/products/:slug', productController.getProductBySlug);

// --- Order Routes ---
router.post('/orders', orderController.createOrder);
router.post('/orders/track', orderController.trackOrder);

// --- Payment Routes ---
router.post('/payments/verify', paymentController.verifyPayment);

// --- Protected Admin Routes ---
router.get('/admin/dashboard', adminGuard, adminController.getDashboardStats);

router.get('/admin/products', adminGuard, adminController.getProducts);
router.post('/admin/products', adminGuard, adminController.createProduct);
router.put('/admin/products/:id', adminGuard, adminController.updateProduct);
router.delete('/admin/products/:id', adminGuard, adminController.deleteProduct);

router.get('/admin/orders', adminGuard, adminController.getOrders);
router.put('/admin/orders/:id/status', adminGuard, adminController.updateOrderStatus);

router.get('/admin/inventory', adminGuard, adminController.getInventoryAudit);

export default router;
