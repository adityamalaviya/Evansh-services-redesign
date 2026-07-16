import { Router, Request, Response, NextFunction } from 'express';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import { publicLimiter } from '../../middleware/rateLimiter';

const router = Router();

// GET /api/services — list active services
router.get('/', publicLimiter, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.services, [
      Query.equal('active', true),
      Query.orderAsc('display_order'),
      Query.limit(100),
    ]);

    res.json({
      total: result.total,
      services: result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        slug: doc.slug,
        description: doc.description,
        image: doc.ImageUrl || doc.icon || '',
        displayOrder: doc.display_order,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:slug — single service
router.get('/:slug', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.services, [
      Query.equal('slug', slug),
      Query.equal('active', true),
      Query.limit(1),
    ]);

    if (result.total === 0) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service not found.' } });
      return;
    }

    const doc = result.documents[0];
    res.json({
      id: doc.$id,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      image: doc.ImageUrl || doc.icon || '',
      displayOrder: doc.display_order,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
