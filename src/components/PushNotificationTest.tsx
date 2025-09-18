import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, TextField, Box, Alert } from '@mui/material';
import { sendPushNotification, checkPushServerHealth, getStoredSubscription } from '../api/push';
import { pushNotificationService } from '../services/pushNotification';

const PushNotificationTest: React.FC = () => {
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test push notification from AI Draft Translation');
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkServerHealth();
    checkSubscriptionStatus();
  }, []);

  const checkServerHealth = async () => {
    const online = await checkPushServerHealth();
    setIsServerOnline(online);
  };

  const checkSubscriptionStatus = async () => {
    const subscription = await pushNotificationService.getSubscription();
    const storedSubscription = getStoredSubscription();
    setIsSubscribed(!!subscription || !!storedSubscription);
  };

  const handleSendNotification = async () => {
    if (!title.trim()) {
      setMessage('Please enter a title for the notification');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await sendPushNotification({
        title: title.trim(),
        body: body.trim() || undefined,
        data: {
          timestamp: new Date().toISOString(),
          source: 'AI Draft Translation'
        },
        options: {
          tag: 'test-notification',
          requireInteraction: false
        }
      });
      setMessage('Push notification request sent to server!');
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      if (permission === 'granted') {
        const subscription = await pushNotificationService.subscribe();
        if (subscription) {
          const subscriptionData = pushNotificationService.getSubscriptionData();
          if (subscriptionData) {
            await pushNotificationService.sendSubscriptionToServer(subscriptionData);
            setIsSubscribed(true);
            setMessage('Successfully subscribed to push notifications!');
          }
        }
      } else {
        setMessage('Notification permission denied');
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        setIsSubscribed(false);
        setMessage('Successfully unsubscribed from push notifications');
      } else {
        setMessage('Failed to unsubscribe');
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Push Notification Test
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Alert 
            severity={isServerOnline ? 'success' : 'warning'} 
            sx={{ mb: 2 }}
          >
            Server: {isServerOnline ? 'Online' : 'Offline'}
          </Alert>
          
          <Alert 
            severity={isSubscribed ? 'success' : 'warning'} 
            sx={{ mb: 2 }}
          >
            Subscription: {isSubscribed ? 'Active' : 'Not subscribed'}
          </Alert>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleSubscribe}
            disabled={isSubscribed}
          >
            Subscribe
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleUnsubscribe}
            disabled={!isSubscribed}
          >
            Unsubscribe
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => { checkServerHealth(); checkSubscriptionStatus(); }}
          >
            Refresh Status
          </Button>
        </Box>

        <TextField
          fullWidth
          label="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notification Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSendNotification}
          disabled={!isSubscribed || loading || !isServerOnline}
        >
          {loading ? 'Sending...' : 'Send Test Notification'}
        </Button>

        {message && (
          <Alert 
            severity={message.includes('Error') ? 'error' : 'success'} 
            sx={{ mt: 2 }}
          >
            {message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationTest;
