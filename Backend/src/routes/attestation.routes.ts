import { Router } from 'express';
import * as attestationController from '../controllers/attestation.controller';

const router = Router();

// Attestation routes
router.post('/', attestationController.createAttestation);
router.get('/', attestationController.getAllAttestations);
router.get('/:objectId', attestationController.getAttestationById);

export default router;