const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const checkRoleAuth = require('../middleware/roleAuth');

const { getUserData,
    getAdminData

 } = require('../controllers/controll-api')


router.get('/user', checkAuth, getUserData);
router.get('/admin', checkAuth, getAdminData);

module.exports = router;