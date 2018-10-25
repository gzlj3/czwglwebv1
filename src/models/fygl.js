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

// let buttonAction = CONSTS.BUTTON_NONE;  // 临时保存当前点击的按钮

const initialState = {
  status: CONSTS.REMOTE_SUCCESS, // 远程处理返回状态
  msg: '', // 远程处理返回信息
  fyList: [], // 房源列表数据
  currentObject: {}, // 当前form操作对象
  sourceList: [], // 保存列表
  selectedRowKeys: [], // 列表选中行
  buttonAction: CONSTS.BUTTON_NONE, // 当前处理按钮（动作）
  modalVisible: false, // 显示弹框
  modalTitle: null, // 弹框属性标题
  modalWidth: 1000, // 弹框属性宽度
  modalOkText: '保存', // 弹框属性确定按钮文本
  modalOkDisabled: false, // 弹框属性确定按钮可点击状态
};

function handleFyList(buttonAction, fyList, data) {
  if (!data) return fyList;
  let cloneFyList = fyList; // 直接赋值，暂未clone
  const house = data[0];
  if (buttonAction === CONSTS.BUTTON_ADDFY) {
    cloneFyList.push(house);
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

function* handleAfterRemote(response, put, select) {
  if (!response) return;
  const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
  const { fyList, buttonAction } = yield select(state => state.fygl);
  // console.log(`buttonAction:${buttonAction}`);

  yield put({
    // 更新远程处理返回状态
    type: 'changeState',
    payload: { status, msg },
  });
  const tsinfo = CONSTS.getButtonActionInfo(buttonAction);

  if (status === CONSTS.REMOTE_SUCCESS) {
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

function getRefreshState(buttonAction, response) {
  let responseData;
  if (response) {
    // 如果有远程返回值，则检查返回值状态
    const { status = CONSTS.REMOTE_SUCCESS, msg } = response;
    if (status !== CONSTS.REMOTE_SUCCESS) {
      message.info(`查询失败！${msg}`);
      return null;
    }
    responseData = response.data;
  }
  const modalVisible = ![CONSTS.BUTTON_NONE].includes(buttonAction);

  let tempState = {
    buttonAction,
    sourceList: responseData,
    modalTitle: CONSTS.getButtonActionInfo(buttonAction),
    modalVisible,
  };

  // let tsinfo='';
  switch (buttonAction) {
    case CONSTS.BUTTON_LASTZD:
      // if(responseData && responseData.length>0 && responseData[0].sfsz==='1'){
      //   tsinfo = '(在【创建帐单】功能中创建新帐单)';
      // }
      tempState = {
        ...tempState,
        // modalTitle: `查看/处理帐单${tsinfo}`,
        modalOkDisabled: true,
      };
      break;
    case CONSTS.BUTTON_MAKEZD:
      tempState = {
        ...tempState,
        // modalTitle: `上月帐单已结清且不小于收租日期的房源可创建新帐单`,
        modalWidth: 300,
        sourceList: responseData[0].rows,
        selectedRowKeys: responseData[0].selectedRowKeys,
        modalOkDisabled: responseData[0].selectedRowKeys.length <= 0,
      };
      break;
    case CONSTS.BUTTON_CB:
      tempState = {
        ...tempState,
        // modalTitle: `上月帐单已结清且接近收租日期的房源可抄表`,
        modalOkDisabled: !responseData || responseData.length <= 0,
      };
      break;
    default:
  }

  return tempState;
}

function* cmdRefresh(buttonAction, response, put, select) {
  const fyglState = yield select(state => state.fygl);
  const tempState = getRefreshState(buttonAction, response, fyglState);
  yield put({
    type: 'changeState',
    payload: tempState,
  });
}

export default {
  namespace: 'fygl',

  state: initialState,

  effects: {
    // *addFy({ payload }, { call, put,select }) {
    //   // const response = yield call(fyglService.queryLastZd, payload);
    //   yield cmdRefresh(CONSTS.BUTTON_ADDFY,null,put,select);
    // },
    *queryLastZd({ payload }, { call, put, select }) {
      const response = yield call(fyglService.queryLastZd, payload);
      yield cmdRefresh(CONSTS.BUTTON_LASTZD, response, put, select);
      // const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      // if (status !== CONSTS.REMOTE_SUCCESS) {
      //   message.info(`查询失败！${msg}`);
      //   return;
      // }
      // yield put({
      //   type: 'lastZd',
      //   payload: data,
      // });
    },
    *queryZdList({ payload }, { call, put, select }) {
      const response = yield call(fyglService.queryZdList, payload);
      yield cmdRefresh(CONSTS.BUTTON_MAKEZD, response, put, select);
      // if (!response) return;
      // const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      // if (status !== CONSTS.REMOTE_SUCCESS) {
      //   message.error(`查询失败！${msg}`, 10);
      //   return;
      // }
      // yield put({
      //   type: 'makezd',
      //   payload: data[0],
      // });
    },
    *querySdbList({ payload }, { call, put, select }) {
      const response = yield call(fyglService.querySdbList, payload);
      yield cmdRefresh(CONSTS.BUTTON_CB, response, put, select);

      // if (!response) return;
      // const { status = CONSTS.REMOTE_SUCCESS, msg, data } = response;
      // if (status !== CONSTS.REMOTE_SUCCESS) {
      //   message.error(`查询失败！${msg}`);
      //   return;
      // }
      // yield put({
      //   type: 'cb',
      //   payload: data,
      // });
    },
    *queryList({ payload }, { call, put, select }) {
      // const fyglState = yield select(state => state.fygl);
      const response = yield call(fyglService.queryFyglList, payload);
      yield handleAfterRemote(response, put, select);
    },
    *delete({ payload }, { call, put, select }) {
      const response = yield call(fyglService.removeFyglList, payload);
      const fyglState = yield select(state => state.fygl);
      fyglState.buttonAction = CONSTS.BUTTON_DELETEFY;
      yield handleAfterRemote(response, put, select);
    },
    *qrsz({ payload }, { call, put, select }) {
      const response = yield call(fyglService.qrsz, payload);
      // const fyglState = yield select(state => state.fygl);
      // fyglState.buttonAction = CONSTS.BUTTON_DELETEFY;
      yield handleAfterRemote(response, put, select);
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

      yield handleAfterRemote(response, put, select);
    },
  },

  reducers: {
    // lastZd(state, action) {
    //   return {
    //     ...state,
    //     pageState: CONSTS.PAGE_NEW,
    //     buttonAction: CONSTS.BUTTON_LASTZD,
    //     zdList: action.payload,
    //   };
    // },
    // makezd(state, action) {
    //   return {
    //     ...state,
    //     pageState: CONSTS.PAGE_NEW,
    //     buttonAction: CONSTS.BUTTON_MAKEZD,
    //     zdList: action.payload.rows,
    //     selectedRowKeys: action.payload.selectedRowKeys,
    //   };
    // },
    // cb(state, action) {
    //   return {
    //     ...state,
    //     pageState: CONSTS.PAGE_NEW,
    //     buttonAction: CONSTS.BUTTON_CB,
    //     sdbList: action.payload,
    //   };
    // },
    addFy(state) {
      const refreshState = getRefreshState(CONSTS.BUTTON_ADDFY, null, state);
      return {
        ...state,
        ...refreshState,
        currentObject: {},
      };
    },
    editFy(state, action) {
      const refreshState = getRefreshState(CONSTS.BUTTON_EDITFY, null, state);
      return {
        ...state,
        ...refreshState,
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
        ...action.payload,
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
