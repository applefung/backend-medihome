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
};
export default schemas;