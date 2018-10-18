import { stringify } from 'qs';
import request from '@/utils/request';
import * as CONSTS from '@/utils/constants';

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
  return request(`/fygl/fygl_list/${CONSTS.BUTTON_DELETEFY}?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

export async function addFyglList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/fygl/fygl_list/${CONSTS.BUTTON_ADDFY}?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

export async function updateFyglList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/fygl/fygl_list/${CONSTS.BUTTON_EDITFY}?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
    },
  });
}

export async function updateSdbList(params) {
  // const paramArray = params.row;

  // const { count = 5, ...restParams } = params;
  return request(`/fygl/sdb_list`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
