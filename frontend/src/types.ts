export interface ItemReport {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  reporterName: string;
  phone: string;
  locationName: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  date: string;
  reward?: number;
  status: 'active' | 'resolved' | 'verifying';
  verificationQr?: string;
}

export interface MatchResult {
  itemId: string;
  matchedItemId: string;
  similarity: string;
  confidence: 'High' | 'Medium' | 'Low';
  itemTitle: string;
  matchedTitle: string;
  type: 'lost' | 'found';
}

export interface ChatMessage {
  id: string;
  sender: 'finder' | 'owner';
  text: string;
  timestamp: string;
}

export interface UserReputation {
  score: number;
  level: string;
  successfulRecoveries: number;
}
