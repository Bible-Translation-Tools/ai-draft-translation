import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { pushNotificationService } from './services/pushNotification'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker (PWA) and initialize push notifications
if ('serviceWorker' in navigator) {
  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      if (registration.waiting) {
        // new SW is installed but not active yet
        console.info('Service worker installed');
      } else if (registration.active) {
        console.info('Service worker active');
      }

      // Initialize push notifications
      await initializePushNotifications();
    } catch (error) {
      console.error('Service worker registration failed', error);
    }
  };
  register();
}

async function initializePushNotifications() {
  try {
    // Initialize the push notification service
    const isSupported = await pushNotificationService.initialize();
    if (!isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return;
    }

    // Check if we already have a subscription
    const existingSubscription = await pushNotificationService.getSubscription();
    if (existingSubscription) {
      console.log('Existing push subscription found');
      const subscriptionData = pushNotificationService.getSubscriptionData();
      if (subscriptionData) {
        await pushNotificationService.sendSubscriptionToServer(subscriptionData);
      }
      return;
    }

    // Request permission and subscribe
    const permission = await pushNotificationService.requestPermission();
    if (permission === 'granted') {
      const subscription = await pushNotificationService.subscribe();
      if (subscription) {
        const subscriptionData = pushNotificationService.getSubscriptionData();
        if (subscriptionData) {
          await pushNotificationService.sendSubscriptionToServer(subscriptionData);
        }
      }
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
  }
}