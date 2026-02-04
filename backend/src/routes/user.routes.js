import {Router} from 'express';
import {registerUser, loginUser, logoutUser, getCurrentUser} from '../controllers/index.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

// login/register route
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);

export default router