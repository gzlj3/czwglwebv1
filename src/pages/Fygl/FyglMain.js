import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {PAGE_QUERY,PAGE_NEW,PAGE_UPDATED,PAGE_DELETE } from '@/utils/constants';
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
import Result from '@/components/Result';

import styles from './FyglMain.less';

import FmFyxx from '@/components/Forms/FmFyxx';

// const FormItem = Form.Item;
// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
// const SelectOption = Select.Option;
// const { TextArea } = Input;

@connect(({ fygl, loading }) => ({
  list: fygl,
  loading: loading.models.fygl,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { 
    visible: false, 
    done: false, 
    current: {},
    pagestate: this.PAGE_QUERY,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/fetch',
      payload: {
        count: 10,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: {},
      pagestate: this.PAGE_NEW,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'fygl/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fygl/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    const {
      form,
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该任务吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
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

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FmFyxx form={form} current={current} />
        </Form>
      );
    };
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
              // type="dashed"
              type="primary"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加房源
            </Button>
            <List
              size="large"
              rowKey="id"
              grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
              loading={loading}
              pagination={false}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <Card
                    title={`${item.fwmc}  ${item.zhxm?item.zhxm:'（未出租）'}`}
                    extra={<a href={item.href}>更多</a>}
                    actions={[
                      <a
                        onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                      >
                      编辑
                      </a>,
                      <MoreBtn current={item} />,
                    ]}
                  >
                    {(item.szrq)?
                      <div>
                        <span>{`收租日期：${moment(item.szrq).format('YYYY-MM-DD')}`}</span>
                        <span>
                          <Progress percent={item.percent} status={item.status} showInfo={false} strokeWidth={6} style={{ width: 120 }} />
                        </span>
                      </div>
                      :''
                    }
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </div>

        <Modal
          title={done ? null : `房源${current && current!=={} ? '编辑' : '添加'}`}
          // style={{ top: 20 }}
          // centered
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Alert message="Error" type="error" showIcon />
          {getModalContent()}
        </Modal>
        {/* <Modal
          title={done ? null : `房源${current && current!=={} ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible
        >
          <span>aaaaaaaaaaaaaa</span>
        </Modal> */}
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
