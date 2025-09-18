export interface PushNotificationPayload {
  title: string;
  body?: string;
  data?: any;
  options?: {
    tag?: string;
    requireInteraction?: boolean;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  };
}

export interface ServerSubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
}

import { PUSH_SERVER_URL } from '../config/PushConfig';

// Get stored subscription from localStorage
export const getStoredSubscription = (): any => {
  try {
    const stored = localStorage.getItem('pushSubscription');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting stored subscription:', error);
    return null;
  }
};

export const storeServerSubscriptionId = (subscriptionId: string) => {
  try {
    localStorage.setItem('pushSubscriptionId', subscriptionId);
  } catch (e) {
    console.error('Failed to store subscriptionId', e);
  }
};

export const getServerSubscriptionId = (): string | null => {
  try {
    return localStorage.getItem('pushSubscriptionId');
  } catch {
    return null;
  }
};

// Send push request to server to broadcast
export const sendPushNotification = async (payload: PushNotificationPayload): Promise<void> => {
  const res = await fetch(`${PUSH_SERVER_URL}/api/push/send`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }
};

// Send push notification to specific subscription
export const sendPushNotificationToSubscription = async (
  subscriptionId: string,
  payload: PushNotificationPayload
): Promise<void> => {
  const res = await fetch(`${PUSH_SERVER_URL}/api/push/send/${encodeURIComponent(subscriptionId)}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }
};

// Subscribe on server: POST subscription object
export const subscribeOnServer = async (subscription: any): Promise<string> => {
  const res = await fetch(`${PUSH_SERVER_URL}/api/push/subscribe`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    body: JSON.stringify(subscription),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to register subscription: ${text}`);
  }
  const json: ServerSubscriptionResponse = await res.json();
  if (!json.success || !json.subscriptionId) {
    throw new Error('Invalid subscribe response');
  }
  storeServerSubscriptionId(json.subscriptionId);
  return json.subscriptionId;
};

// Get all subscriptions from server
export const getSubscriptions = async (): Promise<any> => {
  const res = await fetch(`${PUSH_SERVER_URL}/api/push/subscriptions`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch subscriptions: ${res.status}`);
  return res.json();
};

// Remove subscription on server
export const removeSubscription = async (subscriptionId: string): Promise<void> => {
  const res = await fetch(`${PUSH_SERVER_URL}/api/push/subscribe/${encodeURIComponent(subscriptionId)}`, {
    method: 'DELETE',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to remove subscription: ${text}`);
  }
};

// Health check
export const checkPushServerHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${PUSH_SERVER_URL}/api/health`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json?.status === 'OK';
  } catch {
    return false;
  }
};
