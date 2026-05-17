export interface UserLevel {
  id?: string | number;
  userId?: string | number;
  freelancerLevel: 'new' | 'level1' | 'level2' | 'topseller';
  employerLevel: 'basic' | 'trusted' | 'premium';
}




