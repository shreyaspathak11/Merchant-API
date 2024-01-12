const express = require('express');
const router = express.Router();


const {
    listMerchants,
    addMerchant,
    updateMerchant,
    deleteMerchant,
    getMerchant,
    filterMerchants,
}  = require('../controllers/merchantController');

router.route('/').get(listMerchants);
router.route('/').post(addMerchant);
router.route('/:merchantId').put(updateMerchant);
router.route('/:merchantId').delete(deleteMerchant);
router.route('/:merchantId').get(getMerchant);
router.route('/filter').get(filterMerchants);

module.exports = router;
