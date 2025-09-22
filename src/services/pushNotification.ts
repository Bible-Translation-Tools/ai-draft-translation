import { VAPID_PUBLIC_KEY } from '../config/PushConfig';
import { PUSH_SERVER_URL } from '../config/PushConfig';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error('Failed to get service worker registration:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service worker not initialized');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource
      });

      this.subscription = subscription;
      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return false;
    }

    try {
      const result = await this.subscription.unsubscribe();
      this.subscription = null;
      // Try to remove from server if we stored an id
      const subscriptionId = localStorage.getItem('pushSubscriptionId');
      if (subscriptionId) {
        try {
          await fetch(`${PUSH_SERVER_URL}/api/push/subscribe/${encodeURIComponent(subscriptionId)}`, { method: 'DELETE' });
        } catch (e) {
          console.warn('Failed to remove subscription on server', e);
        }
      }
      localStorage.removeItem('pushSubscription');
      console.log('Unsubscribed from push notifications');
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }

    try {
      this.subscription = await this.registration.pushManager.getSubscription();
      return this.subscription;
    } catch (error) {
      console.error('Failed to get push subscription:', error);
      return null;
    }
  }

  getSubscriptionData(): PushSubscriptionData | null {
    if (!this.subscription) {
      return null;
    }

    return {
      endpoint: this.subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64Url(this.subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64Url(this.subscription.getKey('auth')!)
      }
    };
  }

  async sendSubscriptionToServer(subscriptionData: PushSubscriptionData): Promise<boolean> {
    try {
      // Send subscription to server
      const response = await fetch(`${PUSH_SERVER_URL}/api/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData)
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to register subscription on server: ${text}`);
      }
      const json = await response.json();
      if (json?.subscriptionId) {
        localStorage.setItem('pushSubscriptionId', json.subscriptionId);
      }
      localStorage.setItem('pushSubscription', JSON.stringify(subscriptionData));
      return true;
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // base64
    const base64 = window.btoa(binary);
    // convert to base64url
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}

export const pushNotificationService = PushNotificationService.getInstance();
