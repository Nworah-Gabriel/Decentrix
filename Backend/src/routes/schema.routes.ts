import { Router } from 'express';
import * as schemaController from '../controllers/schema.controller';

// Schema routes
const router = Router();
router.post('/', schemaController.createSchema);
router.get('/', schemaController.getAllSchemas);
router.get('/:objectId', schemaController.getSchemaById);

export default router;