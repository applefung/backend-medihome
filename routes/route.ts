import express from 'express';
import * as categoryController from '../controllers/category';
import * as productController from '../controllers/product';
import * as carouselController from '../controllers/carousel';
import * as pharmacyController from '../controllers/pharmacy';
import * as searchController from '../controllers/search';
const router = express.Router();

router.get('/', (req, res) => res.send('HOME PAGE ONLY'));
router.get('/category', categoryController.getCategory);
router.get('/product', productController.getProduct);
router.get('/carousel', carouselController.getCarousel);
router.get('/pharmacy', pharmacyController.getPharmacy);
router.get('/search', searchController.search);

export default router;