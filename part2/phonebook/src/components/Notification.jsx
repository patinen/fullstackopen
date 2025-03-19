import styles from '../styles/Notification.module.css'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  return <div className={`${styles.notification} ${styles[type]}`}>{message}</div>;
};

export default Notification;