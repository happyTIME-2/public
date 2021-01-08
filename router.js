const express = require('express');

const router = express.Router();

const apiRouters = require('./routes/apiRouter');
const webRouters = require('./routes/webRouter');

router.use('/api', apiRouters);
router.use(webRouters);

module.exports = router;