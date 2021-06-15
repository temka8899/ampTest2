import PushNotification from 'react-native-push-notification';

const showNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'HippoLeague', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    title: title,
    message: message,
  });
};

const handleScheduleNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'HippoLeague', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    title: title,
    message: message,
    date: new Date(Date.now() + 5 * 1000),
  });
};

const handleCancel = () => {
  PushNotification.cancelAllLocalNotifications();
};

export {showNotification, handleScheduleNotification, handleCancel};
