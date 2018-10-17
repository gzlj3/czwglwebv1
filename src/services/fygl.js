import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryFyglList(params) {
  return request(`/fygl/fygl_list?${stringify(params)}`);
}

export async function querySdbList(params) {
  return request(`/fygl/sdb_list?${stringify(params)}`);
}

export async function queryLastZd(params) {
  return request(`/fygl/lastzd?${stringify(params)}`);
}

export async function removeFyglList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/fygl/fygl_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFyglList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/fygl/fygl_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFyglList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/fygl/fygl_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}
