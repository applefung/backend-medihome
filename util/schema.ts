const Joi = require('joi');

const schemas = {
  getProduct: Joi.object().keys({
    productId: Joi.string().optional().allow(null).allow('').empty(''),
    categoryName: Joi.string().optional().allow(null).allow('').empty(''),
    lang: Joi.string().valid('en', 'cn').optional(),
  }),
  getPharmacy: Joi.object().keys({
    pharmacyId: Joi.string().optional().allow(null).allow('').empty(''),
  }),
  search: Joi.object().keys({
    searchKey: Joi.string().optional().allow(null).allow('').empty(''),
  }),
  login: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  signupVerificationCode: Joi.object().keys({
    email: Joi.string().required(),
  }),
  signup: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    verificationCode: Joi.string().required(),
  }),
  forgotPasswordVerificationCode: Joi.object().keys({
    email: Joi.string().required(),
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    verificationCode: Joi.string().required(),
  }),
  addToShoppingCart: Joi.object().keys({
    customerUserId: Joi.number().required(),
    productId: Joi.string().required(),
    type: Joi.number().valid(0, 1).required(),
  }),        
  getShoppingCart: Joi.object().keys({
    customerUserId: Joi.number().required(),
  }),
  createOrder: Joi.object().keys({
    customerUserId: Joi.number().required(),
    pharmacyIds: Joi.string().required(),
    productIds: Joi.string().required(),
    address: Joi.string().optional().allow(null).allow('').empty(''),
    contact: Joi.string().optional().allow(null).allow('').empty(''),
    remark: Joi.string().optional().allow(null).allow('').empty(''),
    deliveryDate: Joi.string().required(),
    sumOfTotal: Joi.string().required(),
  }),
  chat: Joi.object().keys({
    customerUserId: Joi.number().required(),
    pharmacyId: Joi.number().required(),
  }),
  getPharmacyFriendList: Joi.object().keys({
    pharmacyId: Joi.number().required(),
  }),
  getCustomerFriendList: Joi.object().keys({
    customerUserId: Joi.number().required(),
  }),
  getOrder: Joi.object().keys({
    customerUserId: Joi.number().required(),
  }),
  editPersonalInformation: Joi.object().keys({
    customerUserId: Joi.number().required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }),
  getAllPharmacyComment: Joi.object().keys({
    pharmacyId: Joi.number().required(),
  }),
  postPharmacyComment: Joi.object().keys({
    customerUserId: Joi.number().required(),
    pharmacyId: Joi.number().required(),
    content: Joi.string().required(),
    rating: Joi.number().required(),
  }),
  createNewBookmark: Joi.object().keys({
    customerUserId: Joi.number().required(),
    pharmacyId: Joi.number().required(),
    type: Joi.number().required(),
  }),
  getProductByPharmacyId: Joi.object().keys({
    pharmacyId: Joi.number().required(),
  }),
  createProduct: Joi.object().keys({
    categoryId: Joi.number().required(),
    titleEn: Joi.string().required(),
    titleCn: Joi.string().required(),
    descriptionEn: Joi.string().required(),
    descriptionCn: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    pharmacyId: Joi.number().required(),
  }),
  updatePharmacyInformation: Joi.object().keys({
    pharmacyId: Joi.number().required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
  }),
  updateProductInformation: Joi.object().keys({
    productId: Joi.string().required(),
    key: Joi.string().required(),
    value: Joi.string().required(),
    pharmacyId: Joi.number().required(),
  }),
  getPharmacyOrder: Joi.object().keys({
    pharmacyId: Joi.number().required(),
  }),
};
export default schemas;