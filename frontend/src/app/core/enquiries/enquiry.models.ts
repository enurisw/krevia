export type EnquiryStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED';

export interface Enquiry {
  id: number;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  serviceId: number | null;
  serviceTitle: string | null;
  title: string;
  description: string;
  budget: number | null;
  preferredDeadline: string | null;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryRequest {
  recipientId: number;
  serviceId: number | null;
  title: string;
  description: string;
  budget: number | null;
  preferredDeadline: string | null;
}

export interface UpdateEnquiryStatusRequest {
  status: EnquiryStatus;
}
