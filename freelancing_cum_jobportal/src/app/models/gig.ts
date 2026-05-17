import { GigPackageFeature } from './gig-package';

export interface GigFaq {
  question: string;
  answer: string;
}

export interface GigReview {
  id?: string | number;
  reviewerId?: string | number;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  communicationRating: number;
  deliveryRating: number;
  valueRating: number;
  createdAt: string;
}



export interface Gig {
  id?: string | number;
  freelancerId?: string | number;
  categoryId?: string | number;

  startingPrice?: number;

  // ── Basic (existing) ──
  title: string;
  description: string;
  status: 'active' | 'paused' | 'deleted';
  isDeleted: boolean;
  coverImage?: string;
  rating?: number;
  totalOrders?: number;

  // ── Extended Fields ──
  images: string[];
  videoUrl: string;
  tags: string[];
  technologies: string[];
  whatYouGet: string[];
  faqs: GigFaq[];
  reviews: GigReview[];
  queueCount: number;
  responseTime: string;
  languages: string[];
  isFeatured: boolean;
  totalRevenue: number;
  repeatClientPercent: number;
  communicationRating: number;
  deliveryRating: number;
  valueRating: number;
  viewCount: number;
  savedCount: number;
  publishedDate: string;
}




