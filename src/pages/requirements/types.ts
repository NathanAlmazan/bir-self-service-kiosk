export type Requirements = {
  id: string;
  name: string;
  note?: string;
  group?: string;
  optional?: boolean;
  source?: {
    label: string;
    link: string;
  };
};

export type Transaction = {
  id: string;
  title: string;
  fee: string;
  duration: string;
  service: string;
  category?: string;
  checklist?: {
    pdfLink: string;
    imageLink: string;
  };
};

export type TransactionNode = {
  id: string;
  name: string;
  type: "condition" | "requirement";
  format?: "single-select" | "multi-select";
  // transaction fields
  fee?: string;
  duration?: string;
  service?: string;
  category?: string;
  publish?: boolean;
  // requirement fields
  note?: string;
  group?: string;
  optional?: boolean;
  source?: {
    label: string;
    link: string;
  };
  children?: TransactionNode[];
};

export type Taxpayer = {
  uuid: string;
  firstName: string;
  lastName: string;
  rdo: string;
  contact: string;
  taxpayerName: string;
  taxpayerTIN: string;
  submittedAt: string;
  privacyPolicyA: boolean;
  privacyPolicyB: boolean;
  privacyPolicyC: boolean;
};

export enum TransactionsStatus {
  COMPLETE_REQUIREMENTS = "COMPLETE REQUIREMENTS",
  INCOMPLETE_REQUIREMENTS = "INCOMPLETE REQUIREMENTS",
  RECEIVED_REQUIREMENTS = "RECEIVED REQUIREMENTS",
  VERIFIED_REQUIREMENTS = "VERIFIED REQUIREMENTS",
  INVALID_REQUIREMENTS = "INVALID REQUIREMENTS"
};

export type ServiceType =
  | "REGISTRATION"
  | "FILING & PAYMENT"
  | "CERTIFICATE & CLEARANCE"
  | "AUDIT & INVESTIGATION"
  | "COMPLIANCE & ENFORCEMENT";
