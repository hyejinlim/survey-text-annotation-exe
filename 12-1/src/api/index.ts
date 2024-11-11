import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import L from 'lodash';
import Swal from 'sweetalert2';
import config from './config';

const instance: AxiosInstance = axios.create({
  baseURL: config.host,
});

let isHandlingUnauthorized = false; // 동시에 여러 번 실행되는 것을 방지하기 위한 변수

const handleUnauthorized = (message: string, errorCode?: any) => {
  if (isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  Swal.fire({
    icon: 'error',
    title: `${message}`,
    confirmButtonText: '확인',
  }).then(() => {
    window.localStorage.removeItem('token');
    if (window.location.href.includes('/labeling/tool')) {
      window.close();
    } else {
      window.location.href = '/login';
    }
    isHandlingUnauthorized = false;
  });
};

const handleAuthority = (message: string) => {
  if (isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  Swal.fire({
    icon: 'error',
    title: `${message}`,
    confirmButtonText: '확인',
  }).then(() => {
    if (window.location.href.includes('/labeling/tool')) {
      window.close();
    } else {
      window.history.back();
    }
    isHandlingUnauthorized = false;
  });
};

instance.interceptors.request.use(
  (config) => {
    /**
     * HTTP Authorization 요청 헤더에 jwt-token을 넣음
     * 서버측 미들웨어에서 이를 확인하고 검증한 후 해당 API에 요청
     */
    const token = window.localStorage.getItem('token');

    try {
      if (token) {
        config.headers.token = `${token}`;
      }

      return config;
    } catch (err) {
      console.error('[_axios.interceptors.request] config : ' + err);
    }
    return config;
  },
  (error) => {
    // 요청 에러 직전 호출됩니다.
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    /**
     * http status가 200인 경우 응답 성공 직전 호출
     */

    const token = response.headers['token']; // 새로운 토큰을 응답 헤더에서 추출

    if (token) {
      window.localStorage.setItem('token', token); // 새로운 토큰을 로컬 스토리지에 저장
    }

    return response;
  },

  async (error) => {
    const statusCode = error.response.status;

    /**
     * http status가 200이 아닌 경우 응답 에러 직전 호출
     */
    if (error.response) {
      switch (statusCode) {
        case 401: // 로그인중복
          handleUnauthorized(error.response.data.detail.message);

          break;
        case 403:
          handleAuthority(error.response.data.detail.message);
          break;

        default:
          return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const response = (data: any, error?: any) => {
  // response.data가 배열 형식일 때 그대로 payload로 반환
  if (Array.isArray(data)) {
    return {
      response: { payload: data },
      error,
    };
  }

  const { list, ...rest } = data || {};

  const response = L.isNil(list)
    ? {
        payload: { ...rest },
      }
    : {
        payload: list,
        ...rest,
      };

  return {
    response,
    error,
  };
};

async function api(request: AxiosRequestConfig) {
  const token = window.localStorage.getItem('__TOKEN__') || null;
  const Authorization = token
    ? { headers: { Authorization: `Bearer ${token.replace(/"/g, '')}` } }
    : {};

  const url = request.url;
  const params: any = {
    ...request,
    url,
  };

  try {
    const res = await instance({ ...Authorization, ...params });
    return response(res.data);
  } catch (error: any) {
    // console.log('error', error);
    return response({}, error);
  }
}

export default api;
