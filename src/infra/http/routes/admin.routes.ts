import { Router } from 'express';
import { createPubs, deletePubs, getAllPubs, updatePubs } from '../controllers';

const router = Router();

router.post('/create-pub', createPubs);
router.get('/get-all-pubs', getAllPubs);
router.put('/pubs', updatePubs);
router.delete('/pubs/:id', deletePubs);

export default router;