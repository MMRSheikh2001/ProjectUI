export interface GigPackageFeature {
  label: string;
  included: boolean;
}

export interface GigPackage {
  id?: string | number;
  gigId?: string | number;
  name: 'basic' | 'standard' | 'premium';
  price: number;
  deliveryDays: number;
  features: string;
  revisions: number;
  includesSourceCode: boolean;
  includesCommercialUse: boolean;
  featureList: GigPackageFeature[];
  description: string;
  popular: boolean;
}




