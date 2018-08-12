let token = window.localStorage.getItem('token');

export const isAuthenticated = () => token !== null;

let subscribers = [];
export const subscribeToAuthenticationUpdates = callback =>
  subscribers.push(callback);

export const unsubscribeFromAuthenticationUpdates = callback => {
  subscribers = subscribers.filter(sub => callback === sub);
};

export const login = newToken => {
  token = newToken;
  window.localStorage.setItem('token', token);
  subscribers.forEach(callback => callback(true));
};

export const logout = () => {
  token = null;
  window.localStorage.removeItem('token');
  subscribers.forEach(callback => callback(false));
};
