export const ACCESS_TOKEN_KEY = 'access_token';
export const ACCESS_TOKEN_KEY_FOR_REFRESH = 'access_token_for_refresh';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const saveInfo = (user) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, user.accessToken);
  localStorage.setItem(ACCESS_TOKEN_KEY_FOR_REFRESH, user.accessToken);

  if (user.remember) {
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
  } else {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
  }
}

export const getUserInfo = () => {
  return {
  };
}

export const removeStoreLoggedUser = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY_FOR_REFRESH);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

// For refresh the token only
export const getAccessTokenForRefresh = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY_FOR_REFRESH);
}

export const setAccessToken = (token) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
}