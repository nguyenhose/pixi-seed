export interface AccessTokenData {
    token: string;
    accessToken?: string;
    email: string;
    id: string;
    seq: number;
    isActive: boolean;
    displayName: string;
    status?: number;
    ttl: number;
    provider?: string;
    providerId?: string;
    isNew?: boolean
  }