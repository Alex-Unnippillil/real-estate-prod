import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { PropertyRepository } from '../repositories/propertyRepository';
import { createPropertyController } from '../controllers/propertyControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const propertyRepository = new PropertyRepository(prisma);
const controller = createPropertyController(propertyRepository);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', controller.getProperties);
router.get('/:id', controller.getProperty);
router.post(
  '/',
  authMiddleware(['manager']),
  upload.array('photos'),
  controller.createProperty
);

export default router;
