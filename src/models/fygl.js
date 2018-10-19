// import {
//   queryFyglList,
//   querySdbList,
//   queryLastZd,
//   removeFyglList,
//   addFyglList,
//   updateFyglList,
//   updateSdbList,
// } from '@/services/fygl';
import { message } from 'antd';
import * as CONSTS from '@/utils/constants';

import * as fyglService from '@/services/fygl';

const initialState = {
  status: CONSTS.REMOTE_SUCCESS, // 远程处理返回状态
  msg: '', // 远程处理返回信息
  fyList: [], // 房源列表数据
  currentObject: {}, // 当前form操作对象
  pageState: CONSTS.PAGE_LIST, // 页面状态
  sdbList: [], // 水电列表
  zdList: [], // 帐单列表
  selectedRowKeys: [], // 帐单列表选中行
  buttonAction: CONSTS.BUTTON_NONE, // 当前处理按钮（动作）
};

function handleFyList(buttonAction, fyList, data) {
  let cloneFyList = fyList; // 直接赋值，暂未clone
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
    type: 'changeState',
    payload: { status, msg },
  });
  const tsinfo = CONSTS.getButtonActionInfo(buttonAction);

  if (status === CONSTS.REMOTE_SUCCESS) {
    // 远程处理返回成功，更新列表数据
    if (tsinfo.length > 0) message.info(`${tsinfo}成功完成！`);

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
      const response = yield call(fyglService.queryLastZd, payload);
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
    *queryZdList({ payload }, { call, put }) {
      const response = yield call(fyglService.queryZdList, payload);
      if (!response) return;
      const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      if (status !== CONSTS.REMOTE_SUCCESS) {
        message.error(`查询失败！${msg}`,10);
        return;
      }
      yield put({
        type: 'makezd',
        payload: data[0],
      });
    },
    *querySdbList({ payload }, { call, put }) {
      const response = yield call(fyglService.querySdbList, payload);
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
      const response = yield call(fyglService.queryFyglList, payload);
      yield handleAfterRemote(fyglState.pageState, response, put, select);
    },
    *delete({ payload }, { call, put, select }) {
      const response = yield call(fyglService.removeFyglList, payload);
      const fyglState = yield select(state => state.fygl);
      fyglState.buttonAction = CONSTS.BUTTON_DELETEFY;
      yield handleAfterRemote(fyglState.pageState, response, put, select);
    },
    *submit({ payload }, { call, put, select }) {
      const fyglState = yield select(state => state.fygl);
      let callback;
      if (fyglState.buttonAction === CONSTS.BUTTON_ADDFY) {
        callback = fyglService.addFyglList;
      } else if (fyglState.buttonAction === CONSTS.BUTTON_EDITFY) {
        callback = fyglService.updateFyglList;
      } else if (fyglState.buttonAction === CONSTS.BUTTON_CB) {
        callback = fyglService.updateSdbList;
      } else if (fyglState.buttonAction === CONSTS.BUTTON_MAKEZD) {
        callback = fyglService.updateZdList;
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
    makezd(state, action) {
      return {
        ...state,
        pageState: CONSTS.PAGE_NEW,
        buttonAction: CONSTS.BUTTON_MAKEZD,
        zdList: action.payload.rows,
        selectedRowKeys: action.payload.selectedRowKeys,
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
    // changeStatus(state, action) {
    //   return {
    //     ...state,
    //     status: action.payload.status,
    //     msg: action.payload.msg,
    //   };
    // },
    changeState(state, action) {
      return {
        ...state,
        ...action.payload
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
