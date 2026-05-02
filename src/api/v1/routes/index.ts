import { Router } from 'express';
import { auth } from './auth';
import { board } from './boards';
import { tasks } from './tasks';
import { authVerification } from '../../../middlewares';

const router = Router();

router.use('/auth', auth());
router.use('/boards', authVerification, board());
router.use('/tasks', authVerification, tasks());

export { router };
