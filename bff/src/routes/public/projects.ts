import { Router, Request, Response, NextFunction } from 'express';
import { databases, DB_ID, COLLECTIONS, Query, getFilePreviewUrl } from '../../lib/appwrite';
import { publicLimiter } from '../../middleware/rateLimiter';

const router = Router();

// GET /api/projects?category=3d — list projects, optional category filter
router.get('/', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queries: Parameters<typeof databases.listDocuments>[2] = [
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ];

    if (req.query.category === '3d') {
      queries.push(Query.equal('category', '3D Printing'));
    }

    const result = await databases.listDocuments(DB_ID, COLLECTIONS.projects, queries);

    res.json({
      total: result.total,
      projects: result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        imageUrl: doc.thumbnailUrl || (doc.thumbnailFileId ? getFilePreviewUrl(doc.thumbnailFileId, 800, 600) : null),
        imageId: doc.thumbnailFileId,
        createdAt: doc.$createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id — single project
router.get('/:id', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.projects, req.params.id);
    res.json({
      id: doc.$id,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      imageUrl: doc.thumbnailUrl || (doc.thumbnailFileId ? getFilePreviewUrl(doc.thumbnailFileId, 1200, 900) : null),
      imageId: doc.thumbnailFileId,
      createdAt: doc.$createdAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
