import axios from 'axios';
import { getAccessToken, getAccessTokenForRefresh, getRefreshToken, removeStoreLoggedUser, setAccessToken } from './utils/authUtils';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode';
const notification = message;

const BASE_API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`;

const getOptions = () => {
  const test = getAccessToken();
  console.log(test);
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getAccessToken(),
    },
    // NODE_TLS_REJECT_UNAUTHORIZED:'0'
  };
}

const instance = axios.create({
  headers: getOptions().headers,
  baseURL: BASE_API_URL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const accessToken = getAccessTokenForRefresh();
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return;
    }
    const data = {
      accessToken,
      refreshToken,
    }

    const resp = await axios.post(`${BASE_API_URL}/auth/refresh-token`, data, getOptions());
    if (resp?.status == 200) {
      setAccessToken(resp.data.accessToken);
    }
    return resp?.data?.accessToken;
  } catch (e) {
    console.log("Error", e);
    return null;
  }
};

const isTokenExpired = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const payload = jwtDecode(accessToken);
  const nowUtc = Math.floor(Date.now() / 1000); // unit: second

  // If a token has 5s before expired, still refresh it
  return nowUtc >= payload.exp - 5;
}

export const refreshTokenIfNeeded = async () => {
  const accessToken = getAccessToken();
  if (accessToken && isTokenExpired(accessToken)) {
    await refreshToken();
  }
}

instance.interceptors.response.use(
  (response) => {
    return {...response, success: [200, 204].includes(response.status)};
  },
  async function (error) {
    const originalRequest = error.config;
    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
      }

      return instance(originalRequest);
    }

    const data = error?.response?.data;
    const message = data?.message || error?.message;
    const errorResponse = {
      isError: true,
      status: error?.response?.status || 500,
      message,
      messageKey: !!message ? error?.messageKey : (error?.messageKey || 'common-error-message-key-implement-later'),
      data
    }
    handleError(errorResponse, error?.config || {});
    return Promise.resolve(errorResponse);
  }
);

const handleError = (error, config) => {
  const { skipAuthRedirect, skipAlert } = config;
  const {status} = error;

  let message = '';
  if (status === 401) {
    // Clear cache
    // Remove old access token if have
    const hasAccessToken = !!getAccessToken();
    // removeStoreLoggedUser();

    if (!skipAuthRedirect) {
      setTimeout(() => {
        // Navigate to login page
        const currentPath = window.location.pathname;
        // window.location.href = window.location.origin + `/login?redirect=${currentPath}`;
      }, 2000);
    }
    
    message = hasAccessToken ? 'Phiên đăng nhập đã hết hạn' : 'Bạn cần đưang nhập để thực hiện hành động này';
  } else {
    // Handle multiple language later
    message = error.messageKey || error.message;
  }

  !skipAlert && notification.error(message);
}

export const get = async (endpoint, { skipAuthRedirect, skipAlert, refreshTokenManually } = {}) => {
  const option = { skipAuthRedirect, skipAlert, };
  if (refreshTokenManually) {
    await refreshTokenIfNeeded();
  }
  return await instance.get(endpoint, option);
}

export const post = async (endpoint, data, { skipAuthRedirect, skipAlert } = {}) => {
  return await instance.post(endpoint, data, { skipAuthRedirect, skipAlert });
}

export const put = async (endpoint, data, { skipAuthRedirect, skipAlert } = {}) => {
  return await instance.put(endpoint, data, { skipAuthRedirect, skipAlert });
}

export const deleteAPI = async (endpoint, { skipAuthRedirect, skipAlert } = {}) => {
  return await instance.delete(endpoint, { skipAuthRedirect, skipAlert });
}