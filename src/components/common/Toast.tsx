import { useGameStore } from '../../context/GameContext';
import './Toast.css';

export function Toast() {
  const notifications = useGameStore(state => state.notifications);

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`toast ${notification.type}`}
        >
          <span className="toast-icon">
            {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
          </span>
          <span className="toast-message">{notification.message}</span>
        </div>
      ))}
    </div>
  );
}
