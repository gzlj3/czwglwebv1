import { queryFyglList, removeFakeList, addFyglList, updateFakeList } from '@/services/fygl';

export default {
  namespace: 'fygl',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFyglList, payload);
      const {status,message,data} = response;
      if(status>0){  // 业务返回错误
        yield put({
          type: 'handleError',
          payload: {status,message,data},
        });
      }else{
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
      const {status} = response;

      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
