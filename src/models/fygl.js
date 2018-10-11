import { queryFyglList, removeFakeList, addFyglList, updateFakeList } from '@/services/fygl';
import * as CONSTS from '@/utils/constants';

export default {
  namespace: 'fygl',

  state: {
    status: CONSTS.SUCCESS,   // 远程处理返回状态
    message: '',              // 远程处理返回信息
    data: [],                 // 列表数据
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFyglList, payload);
      const {status=CONSTS.SUCCESS,message,data} = response;
      yield put({ // 更新远程处理返回状态
        type: 'changeStatus',
        payload: {status,message},
      });
      if(status===CONSTS.SUCCESS){  // 远程处理返回成功，更新列表数据
        yield put({
          type: 'queryList',
          payload: Array.isArray(data) ? data : [],
        });
      }
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFyglList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFyglList;
      }
      const response = yield call(callback, payload); // post
      const {status=CONSTS.SUCCESS,message,data} = response;
      yield put({ // 更新远程处理返回状态
        type: 'changeStatus',
        payload: {status,message},
      });
      if(status===CONSTS.SUCCESS){  // 远程处理返回成功，更新列表数据
        yield put({
          type: 'queryList',
          payload: Array.isArray(data) ? data : [],
        });
      }
    },
  },

  reducers: {
    changeStatus(state, action) {
      return {
        ...state,
        status: action.payload.status,
        message: action.payload.message,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        data: state.list.concat(action.payload),
      };
    },
  },
};
