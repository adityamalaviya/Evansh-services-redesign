import { Router, Request, Response, NextFunction } from 'express';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import { requireAdmin } from '../../middleware/auth';
import { adminLimiter } from '../../middleware/rateLimiter';

const router = Router();

// GET /api/admin/stats — aggregated stats for dashboard
router.get('/stats', adminLimiter, requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [allProjects, threeDProjects, courses, services, contactMessages] = await Promise.all([
      databases.listDocuments(DB_ID, COLLECTIONS.projects, [Query.limit(1)]),
      databases.listDocuments(DB_ID, COLLECTIONS.projects, [
        Query.equal('category', '3D Printing'),
        Query.limit(1),
      ]),
      databases.listDocuments(DB_ID, COLLECTIONS.courses, [Query.limit(1)]),
      databases.listDocuments(DB_ID, COLLECTIONS.services, [Query.limit(1)]),
      databases.listDocuments(DB_ID, COLLECTIONS.contactMessages, [Query.limit(1)]),
    ]);

    res.json({
      totalProjects: allProjects.total,
      threeDProjects: threeDProjects.total,
      totalCourses: courses.total,
      totalServices: services.total,
      totalContactMessages: contactMessages.total,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
