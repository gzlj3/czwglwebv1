import {
  queryFyglList,
  querySdbList,
  queryLastZd,
  removeFyglList,
  addFyglList,
  updateFyglList,
  updateSdbList,
} from '@/services/fygl';
import { message } from 'antd';
import * as CONSTS from '@/utils/constants';

const initialState = {
  status: CONSTS.REMOTE_SUCCESS, // 远程处理返回状态
  msg: '', // 远程处理返回信息
  fyList: [], // 房源列表数据
  currentObject: {}, // 当前form操作对象
  pageState: CONSTS.PAGE_LIST, // 页面状态
  sdbList: [], // 水电列表
  zdList: [], // 帐单列表
  buttonAction: CONSTS.BUTTON_NONE, // 当前处理按钮（动作）
};

function handleFyList(buttonAction, fyList, data) {
  let cloneFyList = fyList; // 直接赋值，暂未clone，看是否会出问题
  const house = data[0];
  if (buttonAction === CONSTS.BUTTON_ADDFY) {
    cloneFyList.unshift(house);
  } else if (buttonAction === CONSTS.BUTTON_EDITFY) {
    cloneFyList.forEach((element, i) => {
      if (element.houseid === house.houseid) cloneFyList[i] = Object.assign(element, house);
    });
  } else if (buttonAction === CONSTS.BUTTON_DELETEFY) {
    cloneFyList = cloneFyList.filter(element => element.houseid !== house.houseid);
  } else {
    cloneFyList = data;
  }
  return cloneFyList;
}

function* handleAfterRemote(pageState, response, put, select) {
  if (!response) return;
  const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
  const { fyList, buttonAction } = yield select(state => state.fygl);
  console.log(`buttonAction:${buttonAction}`);

  yield put({
    // 更新远程处理返回状态
    type: 'changeStatus',
    payload: { status, msg },
  });
  const tsinfo = CONSTS.getButtonActionInfo(buttonAction);

  if (status === CONSTS.REMOTE_SUCCESS) {
    // 远程处理返回成功，更新列表数据
    if (tsinfo.length > 0) message.info(`${tsinfo}成功完成！`);

    if (buttonAction === CONSTS.BUTTON_CB) {
      // 抄表存盘完成需要重新查询词源列表
      yield put({
        type: 'queryList',
        payload: {},
      });
      return;
    }

    const resultList = handleFyList(buttonAction, fyList, data);
    yield put({
      type: 'initData',
      payload: resultList,
    });
  } else {
    message.error(`${tsinfo}处理失败！${msg}`, 10);
  }
}

export default {
  namespace: 'fygl',

  state: initialState,

  effects: {
    *queryLastZd({ payload }, { call, put }) {
      const response = yield call(queryLastZd, payload);
      const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      if (status !== CONSTS.REMOTE_SUCCESS) {
        message.info(`查询失败！${msg}`);
        return;
      }
      yield put({
        type: 'lastZd',
        payload: data,
      });
    },
    *querySdbList({ payload }, { call, put }) {
      const response = yield call(querySdbList, payload);
      if (!response) return;
      const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      if (status !== CONSTS.REMOTE_SUCCESS) {
        message.error(`查询失败！${msg}`);
        return;
      }
      yield put({
        type: 'cb',
        payload: data,
      });
    },
    *queryList({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      fyglState.buttonAction = CONSTS.BUTTON_NONE;
      const response = yield call(queryFyglList, payload);
      yield handleAfterRemote(fyglState.pageState, response, put, select);
    },
    *delete({ payload }, { call, put, select }) {
      const response = yield call(removeFyglList, payload);
      const fyglState = yield select(state => state.fygl);
      fyglState.buttonAction = CONSTS.BUTTON_DELETEFY;
      yield handleAfterRemote(fyglState.pageState, response, put, select);
    },
    *submit({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      let callback;
      if (fyglState.buttonAction === CONSTS.BUTTON_ADDFY) {
        callback = addFyglList;
      } else if (fyglState.buttonAction === CONSTS.BUTTON_EDITFY) {
        callback = updateFyglList;
      } else if (fyglState.buttonAction === CONSTS.BUTTON_CB) {
        callback = updateSdbList;
      }
      const response = yield call(callback, payload); // post

      yield handleAfterRemote(fyglState.pageState, response, put, select);
    },
  },

  reducers: {
    lastZd(state, action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        buttonAction: CONSTS.BUTTON_LASTZD,
        zdList: action.payload,
      };
    },
    cb(state, action) {
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
        buttonAction: CONSTS.BUTTON_ADDFY,
        currentObject: {},
      };
    },
    editFy(state, action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_UPDATED,
        buttonAction: CONSTS.BUTTON_EDITFY,
        currentObject: action.payload,
      };
    },
    // deleteFy(state, action) {
    //   return {
    //     ...state,
    //     pageState: CONSTS.PAGE_DELETE,
    //     buttonAction: CONSTS.BUTTON_DELETEFY,
    //     currentObject: action.payload,
    //   };
    // },
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
        fyList: action.payload,
      };
    },
  },
};
