import axios from 'axios';

/**
 * getRequest
 */
export const getRequest = (url: string, params: any = {}) => {
  return axios({
    method: 'get',
    url,
    params: {
      ...params,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      // const { message } = e.toJSON();
      const { status, data } = e.response;

      return { status, ...data, error: true };
    });
};

/**
 * postRequest
 */
export const postRequest = (url: string, params: any = {}) => {
  return axios({
    method: 'post',
    url,
    data: {
      ...params,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      // const res = e.toJSON();
      // const { message } = res;
      const { status, data } = e.response;

      return { status, ...data, error: true };
    });
};

/**
 * deleteRequest
 */
export const deleteRequest = (url: string, params: any = {}) => {
  return axios({
    method: 'delete',
    url,
    data: {
      ...params,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      // const res = e.toJSON();
      // const { message } = res;
      const { status, data } = e.response;

      return { status, ...data, error: true };
    });
};

/**
 * putRequest
 */
export const putRequest = (url: string, params = {}) => {
  return axios({
    method: 'put',
    url,
    data: {
      ...params,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      // const res = e.toJSON();
      // const { message } = res;
      const { status, data } = e.response;

      return { status, ...data, error: true };
    });
};
