export type Eligibility = "eligible" | "not-eligible" | "unknown";

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "mandate-pending"
  | "mandate-approved"
  | "allotment-pending"
  | "allotted"
  | "not-allotted"
  | "completed";

export interface Person {
  id: string;
  name: string;
  notes?: string;
  active: boolean;
}

export interface Account {
  id: string;
  personId: string;
  bank: string;
  broker: string;
  nickname?: string;
  availableFunds: number;
  upiId?: string;
  dematId?: string;
  notes?: string;
  active: boolean;
}

export interface Quota {
  id: string;
  name: string;
  minLots: number;
  maxLots: number;
  eligibility: Eligibility;
}

export interface IPO {
  id: string;
  name: string;
  company?: string;
  symbol?: string;
  openDate?: string;
  closeDate?: string;
  listingDate?: string;
  price: number;
  lotSize: number;
  quotas: Quota[];
  archived: boolean;
}

export interface Application {
  id: string;
  accountId: string;
  ipoId: string;
  quotaId: string;
  applicationNumber?: string;
  lots: number;
  amount: number;
  status: ApplicationStatus;
  notes?: string;
  sharesAllotted?: number;
  refundAmount?: number;
}

export interface AppData {
  people: Person[];
  accounts: Account[];
  ipos: IPO[];
  applications: Application[];
}

export const emptyData: AppData = {
  people: [],
  accounts: [],
  ipos: [],
  applications: [],
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  applied: "Applied",
  "mandate-pending": "Mandate Pending",
  "mandate-approved": "Mandate Approved",
  "allotment-pending": "Allotment Pending",
  allotted: "Allotted",
  "not-allotted": "Not Allotted",
  completed: "Completed",
};

export const STATUS_ORDER: ApplicationStatus[] = [
  "draft",
  "applied",
  "mandate-pending",
  "mandate-approved",
  "allotment-pending",
  "allotted",
  "not-allotted",
  "completed",
];
