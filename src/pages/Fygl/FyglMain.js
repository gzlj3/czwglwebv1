import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  // Row,
  // Col,
  // Radio,
  // Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  // Avatar,
  Modal,
  Alert,
  Form,
  // DatePicker,
  // Select,
  // TextArea,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import Result from '@/components/Result';

import styles from './FyglMain.less';

import * as CONSTS from '@/utils/constants';
import FmFyxx from '@/components/Forms/FmFyxx';
import FmCb from '@/components/Forms/FmCb';
// import FmZd from '@/components/Forms/FmZd';
import FmMakezd from '@/components/Forms/FmMakezd';

@connect(
  ({
    fygl: { status, msg, fyList, currentObject, pageState, buttonAction, sdbList, zdList,selectedRowKeys },
    loading,
  }) => ({
    status,
    msg,
    fyList,
    currentObject,
    pageState,
    buttonAction,
    sdbList,
    zdList,
    selectedRowKeys,
    loading: loading.models.fygl,
  })
)
@Form.create()
class FyglMain extends PureComponent {
  // state = {
  //   fyDetailVisible: false, // 房源详细界面显示开关
  //   // done: false,
  //   // current: {},
  //   // pagestate: this.PAGE_QUERY,
  //   buttonAction: CONSTS.BUTTON_NONE,
  // };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/queryList',
      payload: {
        count: 5,
      },
    });
  }

  cb = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/querySdbList',
    });
  };

  makezd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/queryZdList',
    });
  };

  addFy = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/addFy',
    });
  };

  editFy = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/editFy',
      payload: item,
    });
  };

  deleteFy = houseid => {
    const { dispatch } = this.props;
    // const { buttonAction} = this.state;
    dispatch({
      type: 'fygl/delete',
      payload: { houseid },
    });
  };

  lastZd = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/queryLastZd',
      payload: item.fwmc,
    });
  };

  // handleDone = () => {
  //   setTimeout(() => this.addBtn.blur(), 0);
  //   this.setState({
  //     done: false,
  //     visible: false,
  //   });
  // };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    const { fyList, dispatch } = this.props;
    dispatch({
      type: 'fygl/initData',
      payload: fyList,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form ,selectedRowKeys,buttonAction } = this.props;
    setTimeout(() => this.addBtn.blur(), 0);
    if(buttonAction === CONSTS.BUTTON_MAKEZD){
      dispatch({
        type: 'fygl/submit',
        payload: { selectedRowKeys },
      });
      return;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      // console.log(fieldsValue);
      dispatch({
        type: 'fygl/submit',
        payload: { ...fieldsValue },
      });
    });
  };

  onMakezdSelectChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/changeState',
      payload: {selectedRowKeys},
    });
  };

  // onMakezdSelectChange = (selectedRowKeys) => {
  //   dispatch({
  //     type: 'fygl/submit',
  //     payload: { ...fieldsValue },
  //   });
  // };
  
  render() {
    const {
      fyList,
      loading,
      pageState,
      currentObject,
      status,
      msg,
      buttonAction,
      sdbList,
      zdList,
      selectedRowKeys,
    } = this.props;
    const { form } = this.props;
    // const { fyDetailVisible, current = {} } = this.state;
    const fyDetailVisible = [CONSTS.PAGE_QUERY, CONSTS.PAGE_NEW, CONSTS.PAGE_UPDATED].includes(
      pageState
    );

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.editFy(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除房源',
          content: `确定删除该房源(${currentItem.fwmc})吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteFy(currentItem.houseid),
        });
      }
    };

    // const modalFooter = !submitting
    //   ? { footer: null, onCancel: this.handleDone }
    //   : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.currentItem)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getCurrentForm = () => {
      switch(buttonAction){
        case CONSTS.BUTTON_CB:
          return <FmCb form={form} sdbList={sdbList} />;
        case CONSTS.BUTTON_MAKEZD:
          return <FmMakezd
            form={form}
            zdList={zdList}
            selectedRowKeys={selectedRowKeys} 
            onMakezdSelectChange={this.onMakezdSelectChange}
          />;
        default:
          return <FmFyxx form={form} current={currentObject} />;
      }
      // if (buttonAction === CONSTS.BUTTON_CB) return <FmCb form={form} sdbList={sdbList} />;
      // if (buttonAction === CONSTS.BUTTON_LASTZD) return <FmZd form={form} zdList={zdList} />;
    };

    const getModalContent = () => <Form>{getCurrentForm()}</Form>;

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered
            // title="标准列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            <Button
              type="primary"
              style={{ marginBottom: 8 }}
              icon="plus"
              onClick={this.addFy}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加房源
            </Button>
            <Button
              type="primary"
              style={{ marginBottom: 8, marginLeft: 8 }}
              // icon="plus"
              onClick={this.cb}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              抄表
            </Button>
            <Button
              type="primary"
              style={{ marginBottom: 8, marginLeft: 8 }}
              // icon="plus"
              onClick={this.makezd}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              创建帐单
            </Button>
            <List
              size="large"
              rowKey="id"
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              loading={loading}
              pagination={false}
              dataSource={fyList}
              renderItem={item => (
                <List.Item>
                  <Card
                    title={`${item.fwmc}  ${item.zhxm ? item.zhxm : '（未出租）'}`}
                    extra={<a href={item.href}>更多</a>}
                    actions={[
                      <a
                        onClick={e => {
                          e.preventDefault();
                          this.editFy(item);
                        }}
                      >
                        编辑
                      </a>,
                      <a
                        onClick={e => {
                          e.preventDefault();
                          this.lastZd(item);
                        }}
                      >
                        帐单
                      </a>,
                      <MoreBtn currentItem={item} />,
                    ]}
                  >
                    {item.szrq ? (
                      <div>
                        <span>{`收租日期：${moment(item.szrq).format('YYYY-MM-DD')}`}</span>
                        <span>
                          <Progress
                            percent={item.percent}
                            status={item.status}
                            showInfo={false}
                            strokeWidth={6}
                            style={{ width: 120 }}
                          />
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>

        <Modal
          title={`房源${CONSTS.getPageStateInfo(pageState)}`}
          // style={{ top: 20 }}
          centered
          // className={styles.standardListForm}
          width={900}
          // bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          maskClosable={false}
          visible={fyDetailVisible}
          confirmLoading={loading}
          okText="保存"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          {!this.loading && status !== CONSTS.REMOTE_SUCCESS ? (
            <Alert message={msg} type="error" showIcon />
          ) : (
            ''
          )}
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default FyglMain;
