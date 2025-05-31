import { Router } from 'express';
import attestationRoutes from './attestation.routes';
import schemaRoutes from './schema.routes';
const router = Router();

// Main application routes
router.use('/attestations', attestationRoutes);
router.use('/schemas', schemaRoutes);
export default router;