export interface CreatorService {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  deliveryDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCreatorServiceRequest {
  title: string;
  description: string;
  category: string;
  startingPrice: number;
  deliveryDays: number;
}
