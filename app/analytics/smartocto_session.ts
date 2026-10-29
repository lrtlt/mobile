import {createMMKV} from 'react-native-mmkv';

/**
 * smartocto visitor ids, the app's counterparts of the web tracker's `_ain_uid` (lifetime)
 * and `_ain_cid` (session) cookies.
 */

const SESSION_TIMEOUT = 30 * 60 * 1000;
/** Visitor lifetime ids are renewed after two years. Exported for tests. */
export const LIFETIME_ID_TTL = 2 * 365 * 24 * 60 * 60 * 1000;

const KEY_LIFETIME_ID = 'lifetime_id';
const KEY_SESSION_ID = 'session_id';
const KEY_SESSION_ACTIVITY = 'session_last_activity';

const storage = createMMKV({
  id: 'smartocto-storage',
});

// Same format as the web tracker's cookie ids: `<timestamp ms>.<random * 1e9>`.
// For the lifetime id the timestamp doubles as its renewal expiry.
const generateId = (timestamp: number) => `${timestamp}.${Math.random() * 1e9}`;

export const getLifetimeId = () => {
  const stored = storage.getString(KEY_LIFETIME_ID);
  const [expiry] = stored?.split('.') ?? [];
  if (stored && Number(expiry) > Date.now()) {
    return stored;
  }
  // First visit, an expired id or a malformed value: start a new lifetime id.
  const id = generateId(Date.now() + LIFETIME_ID_TTL);
  storage.set(KEY_LIFETIME_ID, id);
  return id;
};

// Renewed after 30 minutes without page views or attention
export const getSessionId = () => {
  const now = Date.now();
  let id = storage.getString(KEY_SESSION_ID);
  if (!id || now - (storage.getNumber(KEY_SESSION_ACTIVITY) ?? 0) > SESSION_TIMEOUT) {
    id = generateId(now);
    storage.set(KEY_SESSION_ID, id);
  }
  storage.set(KEY_SESSION_ACTIVITY, now);
  return id;
};

// Keeps the session of a visit alive while the page is being read
export const touchSession = () => storage.set(KEY_SESSION_ACTIVITY, Date.now());
