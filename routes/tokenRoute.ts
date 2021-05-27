import express from 'express';
import * as shoppingCartController from '../controllers/shoppingCart';
import * as orderController from '../controllers/order';
import * as chatController from '../controllers/chat';
import * as customerUserController from '../controllers/customerUser';
import * as pharmacyCommentController from '../controllers/pharmacyComment';
import authToken from '../util/authToken';
const tokenRoute = express.Router();

tokenRoute.use(authToken);
tokenRoute.put('/addtoshoppingcart', shoppingCartController.addToShoppingCart);
tokenRoute.get('/getshoppingcart', shoppingCartController.getShoppingCartItems);
tokenRoute.post('/createorder', orderController.createOrder);
tokenRoute.get('/getroom', chatController.getRoom);
tokenRoute.get('/getfriendlist', chatController.getCustomerFriendList);
tokenRoute.get('/getcustomerorder', orderController.getCustomerOrder);
tokenRoute.post('/editpersonalinformation', customerUserController.editPersonalInformation);
tokenRoute.post('/postpharmacycomment', pharmacyCommentController.postPharmacyComment);
tokenRoute.post('/togglebookmark', customerUserController.createNewBookmark);

export default tokenRoute;