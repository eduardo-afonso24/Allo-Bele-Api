import { Router } from 'express';
import { createPubs, getAllPubs } from '../controllers';

const router = Router();

router.post('/create-pub', createPubs);
router.get('/get-all-pubs', getAllPubs);

export default router;