import { queryFyglList, querySdbList,queryLastZd, removeFyglList, addFyglList, updateFyglList } from '@/services/fygl';
import { message } from 'antd';
import * as CONSTS from '@/utils/constants';

const initialState = {
  status: CONSTS.REMOTE_SUCCESS, // 远程处理返回状态
  msg: '', // 远程处理返回信息
  data: [], // 列表数据
  currentObject: {}, // 当前form操作对象
  pageState: CONSTS.PAGE_LIST, // 页面状态
  sdbList: [],  //水电列表
  buttonAction:CONSTS.BUTTON_NONE, // 当前处理按钮（动作）
};

function* handleAfterRemote(pageState, response, put) {
  const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
  // const {fyglState:{pageState}} = select(state => state.fygl);
  yield put({
    // 更新远程处理返回状态
    type: 'changeStatus',
    payload: { status, msg },
  });
  const tsinfo = CONSTS.getPageStateInfo(pageState);

  if (status === CONSTS.REMOTE_SUCCESS) {
    // 远程处理返回成功，更新列表数据
    if (tsinfo.length > 0) message.info(`${tsinfo}成功完成！`);
    yield put({
      type: 'initData',
      payload: Array.isArray(data) ? data : [],
    });
  }
}

export default {
  namespace: 'fygl',

  state: initialState,

  effects: {
    *queryLastZd({ payload }, { call, put}) {
      const response = yield call(queryLastZd, payload);
      const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      if (status !== CONSTS.REMOTE_SUCCESS) {
        message.info(`查询失败！${msg}`);
        return;
      }
      yield put({
        type:'lastZd',
        payload:data,
      })
    },
    *querySdbList({ payload }, { call, put}) {
      const response = yield call(querySdbList, payload);
      const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      if (status !== CONSTS.REMOTE_SUCCESS) {
        message.info(`查询失败！${msg}`);
        return;
      }
      yield put({
        type:'cb',
        payload:data,
      })
    },
    *queryList({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      const response = yield call(queryFyglList, payload);
      yield handleAfterRemote(fyglState.pageState, response, put);
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFyglList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *delete({ payload }, { call, put, select }) {
      const response = yield call(removeFyglList, payload);
      const fyglState = yield select(state => state.fygl);
      yield handleAfterRemote(fyglState.pageState, response, put);

      // const {status=CONSTS.REMOTE_SUCCESS,msg,data} = response;
      // yield put({ // 更新远程处理返回状态
      //   type: 'changeStatus',
      //   payload: {status,msg},
      // });
      // if(status===CONSTS.REMOTE_SUCCESS){  // 远程处理返回成功，更新列表数据
      //   yield put({
      //     type: 'initData',
      //     payload: Array.isArray(data) ? data : [],
      //   });
      // }
    },
    *submit({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      let callback;
      if (fyglState.pageState === CONSTS.PAGE_NEW) {
        callback = addFyglList;
      } else {
        callback = updateFyglList;
      }
      const response = yield call(callback, payload); // post

      yield handleAfterRemote(fyglState.pageState, response, put);

      // const {status=CONSTS.REMOTE_SUCCESS,msg,data} = response;
      // yield put({ // 更新远程处理返回状态
      //   type: 'changeStatus',
      //   payload: {status,msg},
      // });
      // if(status===CONSTS.REMOTE_SUCCESS){  // 远程处理返回成功，更新列表数据
      //   message.info('存盘成功完成！');
      //   yield put({
      //     type: 'initData',
      //     payload: Array.isArray(data) ? data : [],
      //   });
      // }
    },
  },

  reducers: {
    lastZd(state,action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        buttonAction: CONSTS.BUTTON_LASTZD,
        currentObject: action.payload,
      };
    },
    cb(state,action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        buttonAction: CONSTS.BUTTON_CB,
        sdbList: action.payload,
      };
    },
    addFy(state) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        currentObject: {},
      };
    },
    editFy(state, action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_UPDATED,
        currentObject: action.payload,
      };
    },
    deleteFy(state, action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_DELETE,
        currentObject: action.payload,
      };
    },
    changeStatus(state, action) {
      return {
        ...state,
        status: action.payload.status,
        msg: action.payload.msg,
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
