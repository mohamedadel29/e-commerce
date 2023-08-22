const express = require('express');

const authService = require('../services/authservices');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../services/addressservices');

const router = express.Router();

router.use(authService.protect, authService.allowedto('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;