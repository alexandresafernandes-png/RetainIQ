export type Business = {
  id: string;
  owner_id: string;
  name: string;
  phone: string | null;
  whatsapp_id: string | null;
  delay_hours: number;
  created_at: string;
};

export type Customer = {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email: string | null;
  tags: string[];
  created_at: string;
};

export type Template = {
  id: string;
  business_id: string;
  name: string;
  body: string;
  is_default: boolean;
  created_at: string;
};

export type InteractionStatus = "pending" | "sent" | "delivered" | "replied" | "failed";
export type InteractionDirection = "outbound" | "inbound";

export type Interaction = {
  id: string;
  business_id: string;
  customer_id: string;
  template_id: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  replied_at: string | null;
  status: InteractionStatus;
  direction: InteractionDirection;
  message_body: string | null;
  created_at: string;
};

export type FeedbackStatus = "pending" | "completed" | "expired";
export type Sentiment = "positive" | "neutral" | "negative";

export type FeedbackSession = {
  id: string;
  business_id: string;
  customer_id: string;
  interaction_id: string | null;
  token: string;
  status: FeedbackStatus;
  response_text: string | null;
  rating: number | null;
  sentiment: Sentiment | null;
  submitted_at: string | null;
  expires_at: string | null;
  created_at: string;
};

// Joined types for UI
export type InteractionWithCustomer = Interaction & {
  customers: Pick<Customer, "name" | "phone">;
};

export type FeedbackWithCustomer = FeedbackSession & {
  customers: Pick<Customer, "name" | "phone">;
};

export type DashboardStats = {
  totalCustomers: number;
  totalInteractions: number;
  replyRate: number;
  avgRating: number;
  positiveSentiment: number;
};
