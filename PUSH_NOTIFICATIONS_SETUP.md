# Web Push Notifications Setup

This document explains how to set up and use web push notifications in the AI Draft Translation application.

## Overview

The web push notification system consists of two main components:

1. **Client-side subscription** - Users subscribe to push notifications in their browser
2. **Service worker** - Handles incoming push events and displays notifications

**Note**: This is a client-side only implementation. For production use, you'll need to implement a server to send push notifications to subscribed users.

## Setup Instructions

### 1. Start the Frontend Application

```bash
# Start the frontend
pnpm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### 2. Test Push Notifications

1. Open the application in your browser
2. Click on the "Push Test" mode in the top-right corner
3. Click "Subscribe" to enable push notifications (browser will ask for permission)
4. Once subscribed, you can send test notifications
5. Fill in the title and body, then click "Send Test Notification"

## How It Works

### Client-Side Flow

1. **Service Worker Registration**: The app registers a service worker (`/sw.js`) on startup
2. **Permission Request**: When the user clicks "Subscribe", the app requests notification permission
3. **Subscription Creation**: If permission is granted, a push subscription is created using VAPID keys
4. **Local Storage**: The subscription is stored locally in localStorage (in production, send to your server)

### Service Worker Flow

1. **Message Handling**: The service worker receives messages from the main thread to show notifications
2. **Notification Display**: The service worker displays notifications using the browser's notification API
3. **Click Handling**: When a notification is clicked, the app is focused and can handle the click event

### Current Implementation

- **Local Testing**: Notifications are sent via service worker messages (client-side only)
- **Subscription Storage**: Push subscriptions are stored in localStorage
- **No Server**: This implementation doesn't include a push server

## For Production Use

To use this in production, you'll need to implement a server that:

1. **Receives Subscriptions**: Store push subscriptions from clients
2. **Sends Notifications**: Use the web-push library to send notifications to subscribed users
3. **Handles Errors**: Remove invalid subscriptions and handle delivery failures

The client-side code is ready to work with your server - just update the `sendSubscriptionToServer` method in `src/services/pushNotification.ts` to send subscriptions to your server endpoint.

## Configuration

### VAPID Keys

The VAPID keys are currently hardcoded in the configuration. In production, you should:

1. Generate new VAPID keys for your domain
2. Store them as environment variables
3. Update the configuration files

To generate new VAPID keys:

```bash
npx web-push generate-vapid-keys
```

### Environment Variables

For production, set these environment variables:

```bash
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_EMAIL=mailto:your-email@example.com
PORT=3001
```

## Browser Support

Web push notifications are supported in:
- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

## Security Considerations

1. **HTTPS Required**: Push notifications only work over HTTPS (except for localhost)
2. **VAPID Keys**: Keep your private VAPID key secure
3. **Subscription Validation**: Validate subscription data before storing
4. **Rate Limiting**: Implement rate limiting for notification sending

## Troubleshooting

### Common Issues

1. **"Push messaging is not supported"**: The browser doesn't support push notifications
2. **"Notification permission denied"**: User denied permission or browser blocked it
3. **"Failed to send push notification"**: Push server is not running or subscription is invalid
4. **Notifications not appearing**: Check browser notification settings

### Debug Steps

1. Check browser console for errors
2. Verify push server is running (`http://localhost:3001/api/health`)
3. Check notification permissions in browser settings
4. Verify service worker is registered and active
5. Check network tab for failed API calls

## Production Deployment

For production deployment:

1. **Use HTTPS**: Push notifications require HTTPS
2. **Database Storage**: Replace in-memory storage with a proper database
3. **Environment Variables**: Use environment variables for configuration
4. **Error Monitoring**: Implement proper error monitoring and logging
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Security Headers**: Add appropriate security headers

## Files Modified/Added

- `public/sw.js` - Updated service worker with push event handling
- `src/main.tsx` - Added push notification initialization
- `src/services/pushNotification.ts` - Push notification service
- `src/api/push.ts` - Client-side push notification API
- `src/components/PushNotificationTest.tsx` - Test component
- `src/config/push.ts` - VAPID key configuration
- `package.json` - Updated with web-push dependency
