import PushNotificationIOS from 'react-native-push-notification';

const showNotification = (title, message) => {
  PushNotificationIOS.presentLocalNotification({
    alerTitle: title,
    alertBody: message,
  });
};

const handleScheduleNotification = (title, message) => {
  const date = new Date();
  date.setSeconds(date.getSeconds() + 5);
  PushNotificationIOS.scheduleLocalNotification({
    alertTitle: title,
    alertBody: message,
    fireDate: date.toISOString(),
  });
};

const handleCancel = () => {
  PushNotificationIOS.removeAllDeliveredNotifications();
};

export {showNotification, handleScheduleNotification, handleCancel};
