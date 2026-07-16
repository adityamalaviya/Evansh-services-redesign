import { Router, Request, Response, NextFunction } from 'express';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import { publicLimiter } from '../../middleware/rateLimiter';

const router = Router();

// GET /api/courses — list published courses
router.get('/', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.courses, [
      Query.equal('isPublished', true),
      Query.orderAsc('$createdAt'),
      Query.limit(100),
    ]);

    res.json({
      total: result.total,
      courses: result.documents.map((doc) => ({
        id: doc.$id,
        title: doc.title,
        subtitle: doc.subtitle,
        shortDescription: doc.shortDescription,
        aboutCourse: doc.aboutCourse,
        price: doc.price,
        slug: doc.slug,
        cardImageUrl: doc.cardImageUrl,
        heroImageUrl: doc.heroImageUrl,
        feature1Title: doc.feature1Title,
        feature1Subtitle: doc.feature1Subtitle,
        feature2Title: doc.feature2Title,
        feature2Subtitle: doc.feature2Subtitle,
        feature3Title: doc.feature3Title,
        feature3Subtitle: doc.feature3Subtitle,
        whatYouWillLearn: doc.whatYouWillLearn,
        isPublished: doc.isPublished,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/:slug — single course by slug
router.get('/:slug', publicLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.courses, [
      Query.equal('slug', slug),
      Query.equal('isPublished', true),
      Query.limit(1),
    ]);

    if (result.total === 0) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Course not found.' } });
      return;
    }

    const doc = result.documents[0];
    res.json({
      id: doc.$id,
      title: doc.title,
      subtitle: doc.subtitle,
      shortDescription: doc.shortDescription,
      aboutCourse: doc.aboutCourse,
      price: doc.price,
      slug: doc.slug,
      cardImageUrl: doc.cardImageUrl,
      heroImageUrl: doc.heroImageUrl,
      feature1Title: doc.feature1Title,
      feature1Subtitle: doc.feature1Subtitle,
      feature2Title: doc.feature2Title,
      feature2Subtitle: doc.feature2Subtitle,
      feature3Title: doc.feature3Title,
      feature3Subtitle: doc.feature3Subtitle,
      whatYouWillLearn: doc.whatYouWillLearn,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
