import express from 'express';
import * as categoryController from '../controllers/category';
import * as productController from '../controllers/product';
import * as carouselController from '../controllers/carousel';
import * as pharmacyController from '../controllers/pharmacy';
import * as searchController from '../controllers/search';
import * as customerUserController from '../controllers/customerUser';
import * as pharmacyUserController from '../controllers/pharmacyUser';
import * as pharmacyCommentController from '../controllers/pharmacyComment';

// route
import tokenRoute from './tokenRoute';
import pharmacyTokenRoute from './pharmacyTokenRoute';
import authToken from '../util/authToken';
const router = express.Router();

router.get('/', (req, res) => res.send('HOME PAGE ONLY'));
router.get('/category', categoryController.getCategory);
router.get('/product', productController.getProduct);
router.get('/carousel', carouselController.getCarousel);
router.get('/pharmacy', pharmacyController.getPharmacy);
router.get('/search', searchController.search);
router.get('/getpharmacycomment', pharmacyCommentController.getAllPharmacyComment);

router.post('/login', customerUserController.login);
router.post('/signupverificationcode', customerUserController.signUpSendVerificationCode);
router.put('/signup', customerUserController.signUp);
router.post('/forgotpasswordverificationcode', customerUserController.forgotPasswordSendVerificationCode);
router.put('/forgotpassword', customerUserController.forgotPassword);

router.post('/pharmacy/login', pharmacyUserController.login);

router.use('/token', tokenRoute);
router.use('/pharmacytoken', pharmacyTokenRoute);




export default router;