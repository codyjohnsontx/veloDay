export type ListingCategory = "complete-bike" | "frame" | "wheelset";
export type TransactionMode =
  | "local-pickup"
  | "managed-shipping"
  | "inspection-partner";
export type SellerType =
  | "private"
  | "shop"
  | "consignment"
  | "certified-partner";
export type VerificationState = "unverified" | "pending" | "verified";
export type ConditionGrade = "excellent" | "very-good" | "good" | "fair";
export type Discipline =
  | "road"
  | "gravel"
  | "mountain"
  | "triathlon"
  | "commuter"
  | "e-bike";

export interface BikeModel {
  id: string;
  brand: string;
  modelFamily: string;
  modelName: string;
  modelYear: number;
  discipline: Discipline;
}

export interface ConditionReport {
  overallGrade: ConditionGrade;
  structuralFlag: "clear" | "disclosed-issue" | "inspection-recommended";
  estimatedMiles?: number;
  lastMajorService?: string;
  serviceNotes: string[];
  defectTags: string[];
}

export interface ProvenanceRecord {
  ownershipType:
    | "original-owner"
    | "second-owner"
    | "shop-owned"
    | "demo"
    | "race"
    | "rental";
  proofOfPurchase: VerificationState;
  commercialUse: boolean;
  accidentDisclosed: boolean;
}

export interface SerialVerification {
  state: VerificationState;
  maskedSerial: string;
  theftCheckStatus: "clear" | "pending" | "not-checked";
  verificationMethod: "seller-entry" | "receipt-match" | "inspection-partner";
}

export interface SellerProfile {
  id: string;
  name: string;
  sellerType: SellerType;
  location: string;
  verifiedIdentity: boolean;
  reviewScore: number;
  reviewCount: number;
  responseRate: number;
  accountAgeMonths: number;
}

export interface BikeListing {
  id: string;
  category: ListingCategory;
  title: string;
  model: BikeModel;
  seller: SellerProfile;
  price: number;
  originalMsrp?: number;
  dealScore: "below-market" | "fair" | "premium";
  frameSize?: string;
  riderHeightRange?: string;
  wheelSize?: string;
  frameMaterial?: string;
  drivetrain?: string;
  brakes?: string;
  suspension?: string;
  condition: ConditionReport;
  provenance: ProvenanceRecord;
  serial: SerialVerification;
  transactionModes: TransactionMode[];
  location: string;
  shipsTo?: string;
  daysOnMarket: number;
  views: number;
  saves: number;
  inquiries: number;
  heroImage: string;
  gallery: string[];
}

export interface Offer {
  id: string;
  listingId: string;
  buyerName: string;
  amount: number;
  status: "open" | "countered" | "accepted" | "declined";
  lastMessage: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, string | number | boolean>;
  resultCount: number;
  alertFrequency: "instant" | "daily" | "weekly";
}
