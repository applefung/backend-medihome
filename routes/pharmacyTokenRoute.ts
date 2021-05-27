import express from 'express';
import * as chatController from '../controllers/chat';
import * as pharmacyController from '../controllers/pharmacy';
import * as pharmacyCommentController from '../controllers/pharmacyComment';
import * as productController from '../controllers/product';
import * as orderController from '../controllers/order';
import * as categoryController from '../controllers/category';


import pharmacyAuthToken from '../util/pharmacyAuthToken';
const pharmacyTokenRoute = express.Router();

pharmacyTokenRoute.use(pharmacyAuthToken);
pharmacyTokenRoute.get('/getfriendlist', chatController.getPharmacyFriendList);
pharmacyTokenRoute.get('/getproductbypharmacyid', pharmacyController.getProductByPharmacyId);
pharmacyTokenRoute.put('/updatepharmacyinformation', pharmacyController.updatePharmacyInformation);
pharmacyTokenRoute.get('/getallpharmacycommentforpharmacy', pharmacyCommentController.getAllPharmacyComment);
pharmacyTokenRoute.put('/updateproductinformation', productController.updateProductInformation);
pharmacyTokenRoute.get('/getpharmacyorder', orderController.getPharmacyOrder);
pharmacyTokenRoute.get('/category', categoryController.getCategory);
pharmacyTokenRoute.post('/createproduct', productController.createProduct);


export default pharmacyTokenRoute;