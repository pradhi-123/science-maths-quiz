// Real-time synchronization utility using BroadcastChannel and localStorage events.
// Allows the backstage Admin panel to remotely control the main Presenter display tab instantly.

const SYNC_CHANNEL_NAME = 'console_quiz_sync_channel';
let channel = null;

if (typeof window !== 'undefined' && window.BroadcastChannel) {
  channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
}

/**
 * Broadcast an event to other tabs
 * @param {string} type - Event action type (e.g. 'START_TIMER', 'RESET_TIMER', 'JUMP_QUESTION', 'REVEAL_ANSWER')
 * @param {object} payload - Optional parameters/data
 */
export function publishSyncEvent(type, payload = {}) {
  const event = { type, payload, timestamp: Date.now() };
  
  // 1. Post via BroadcastChannel (ultra-fast same-device communication)
  if (channel) {
    channel.postMessage(event);
  }
  
  // 2. Write to localStorage (triggers 'storage' listeners in other tabs as fallback)
  try {
    localStorage.setItem('console_quiz_sync_event', JSON.stringify(event));
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Register a listener for real-time sync events
 * @param {function} callback - Callback function receiving the sync event { type, payload }
 * @returns {function} Cleanup function to unsubscribe
 */
export function subscribeToSyncEvents(callback) {
  const handleBroadcastMessage = (e) => {
    callback(e.data);
  };

  if (channel) {
    channel.addEventListener('message', handleBroadcastMessage);
  }

  const handleStorageChange = (e) => {
    if (e.key === 'console_quiz_sync_event' && e.newValue) {
      try {
        const event = JSON.parse(e.newValue);
        callback(event);
      } catch (err) {
        console.error('Error parsing sync storage event:', err);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return unsubscribe cleanup function
  return () => {
    if (channel) {
      channel.removeEventListener('message', handleBroadcastMessage);
    }
    window.removeEventListener('storage', handleStorageChange);
  };
}
