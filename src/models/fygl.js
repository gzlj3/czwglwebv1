import { queryFyglList, removeFyglList, addFyglList, updateFyglList } from '@/services/fygl';
import * as CONSTS from '@/utils/constants';

const initialState = {
    status: CONSTS.REMOTE_SUCCESS,// 远程处理返回状态
    message: '',                  // 远程处理返回信息
    data: [],                     // 列表数据
    currentObject: {},            // 当前form操作对象
    pageState: CONSTS.PAGE_LIST,  // 页面状态   
}

export default {
  namespace: 'fygl',

  state: {
    status: CONSTS.REMOTE_SUCCESS,// 远程处理返回状态
    message: '',                  // 远程处理返回信息
    data: [],                     // 列表数据
    currentObject: {},            // 当前form操作对象
    pageState: CONSTS.PAGE_LIST,  // 页面状态

  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const response = yield call(queryFyglList, payload);
      const {status=CONSTS.REMOTE_SUCCESS,message,data} = response;
      yield put({ // 更新远程处理返回状态
        type: 'changeStatus',
        payload: {status,message},
      });
      if(status===CONSTS.REMOTE_SUCCESS){  // 远程处理返回成功，更新列表数据
        yield put({
          type: 'initData',
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
    *delete({ payload }, { call, put}) {
      const response = yield call(removeFyglList, payload);
      const {status=CONSTS.REMOTE_SUCCESS,message,data} = response;
      yield put({ // 更新远程处理返回状态
        type: 'changeStatus',
        payload: {status,message},
      });
      if(status===CONSTS.REMOTE_SUCCESS){  // 远程处理返回成功，更新列表数据
        yield put({
          type: 'initData',
          payload: Array.isArray(data) ? data : [],
        });
      }
    },
    *submit({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      let callback;
      // if (payload.id) {
      //   callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      // } else {
      //   callback = addFyglList;
      // }
      if(fyglState.pageState===CONSTS.PAGE_NEW){
        callback = addFyglList;
      }else{
        callback = updateFyglList;
      }
      const response = yield call(callback, payload); // post
      const {status=CONSTS.REMOTE_SUCCESS,message,data} = response;
      yield put({ // 更新远程处理返回状态
        type: 'changeStatus',
        payload: {status,message},
      });
      if(status===CONSTS.REMOTE_SUCCESS){  // 远程处理返回成功，更新列表数据
        yield put({
          type: 'initData',
          payload: Array.isArray(data) ? data : [],
        });
      }
    },
  },

  reducers: {
    addFy(state) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        currentObject: {},
      }
    },
    editFy(state,action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_UPDATED,
        currentObject: action.payload,
      }
    },
    deleteFy(state,action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_DELETE,
        currentObject: action.payload,
      }
    },
    changeStatus(state, action) {
      return {
        ...state,
        status: action.payload.status,
        message: action.payload.message,
      };
    },

    initData(state, action) {
      return {
        ...state,
        ...initialState,
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
