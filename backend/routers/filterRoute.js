const express = require('express');
const router = express.Router();

const FilterController = require('../controllers/filterController');

router.get('/', FilterController.getAllFilters);
router.get('/friendsPosts/:id_user/:id_filter', FilterController.getFriendsPostsFilter);
router.get('/search/:name', FilterController.getFiltersByNames);

module.exports = router;