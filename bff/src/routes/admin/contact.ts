import { Router, Request, Response, NextFunction } from 'express';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';

const router = Router();

// GET /api/admin/contact — list contact messages
router.get('/', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.contactMessages, queries);
    res.json({
      total: result.total,
      messages: result.documents,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/contact/:id — delete a contact message
router.delete('/:id', adminLimiter, requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await databases.deleteDocument(DB_ID, COLLECTIONS.contactMessages, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
