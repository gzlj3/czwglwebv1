import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  List,
  Modal,
  Input,
  // Form,
  Card,
  Row,
  Col,
  message,
} from 'antd';

// const FormItem = Form.Item;

class FmFyxx extends PureComponent {
  state = {
    // currnetIndex:-1,
  };

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 13 },
  };

  colLayout = {
    sm: 24,
    md: 12,
    lg: 8,
    xxl: 6,
  };

  fieldParams = {
    // validateTrigger: 'onBlur',
  };

  makeSzdx = currnetIndex => {
    // const {currnetIndex} = this.state;
    if (currnetIndex >= 0) {
      const { zdList } = this.props;
      const zdxx = document.getElementById(`zdxxDiv_${currnetIndex}`);
      const szdxText = document.getElementById(`szdxText_${currnetIndex}`);
      const item = zdList[currnetIndex];
      szdxText.value = `${item.fwmc}房租户(${item.zhxm}),你好,${zdxx.innerText}`;
      szdxText.select();
      document.execCommand('Copy');
      message.info('收租短信已成功复制到系统粘贴板！');
    }
  };

  szdx = i => {
    this.setState(
      preState => ({
        // currnetIndex:i,
        [i]: !preState[i],
      }),
      () => {
        this.makeSzdx(i);
      }
    );
  };

  render() {
    // const {
    // form: { getFieldDecorator },
    // } = this.props;
    const { zdList, qrsz } = this.props;
    // const { szdxButton } = this.state;
    const curs = this.state;
    const showfy = (fym, fy) => (fy ? `${fym}：${fy}` : '');
    const colLayout = {
      sm: 24,
      md: 12,
      lg: 8,
      xxl: 8,
    };

    const getActions = (item, i) =>
      item.sfsz === '0'
        ? [
            <a
              onClick={e => {
                e.preventDefault();
                Modal.confirm({
                  title: '确认收租',
                  content: `确定该房源(${item.fwmc})已经收租了吗？`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => qrsz(item.housefyid),
                });
              }}
            >
              确认收租
            </a>,
            <a
              onClick={e => {
                e.preventDefault();
                this.szdx(i);
              }}
            >
              收租短信
            </a>,
          ]
        : null;

    const getSzzt = sfsz => {
      if (sfsz === '1') return <span style={{ marginLeft: 20 }}>已结清</span>;
      return <span style={{ marginLeft: 20, color: 'red' }}>未结清</span>;
    };

    return (
      <div>
        <List
          size="large"
          rowKey="id"
          grid={{ gutter: 8, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
          // loading={loading}
          pagination={false}
          dataSource={zdList}
          renderItem={(item, i) => (
            <List.Item>
              <Card
                title={
                  <span style={{ fontSize: 16 }}>
                    <span>{`${item.fwmc}  ${item.zhxm}`}</span>
                    <span style={{ marginLeft: 20 }}>{getSzzt(item.sfsz)}</span>
                  </span>
                }
                actions={getActions(item, i)}
              >
                <span style={{ marginLeft: 0 }}>{`时段：${item.rq1}--${item.rq2}`}</span>
                <br />
                <div id={`zdxxDiv_${i}`} style={{ display: `${curs[i] ? 'none' : ''}` }}>
                  <span style={{ fontSize: 16, color: 'blue' }}>{`${moment(item.rq1).format(
                    'YYYY年MM月'
                  )}应缴费用：${item.fyhj}元`}</span>
                  <br />
                  <span>
                    {`电费：${item.dfhj}元(上次:${item.dscds},本次:${item.dbcds},实用:${
                      item.dsyds
                    },公摊:${item.dgtds ? item.dgtds : 0},单价:${item.ddj})`}
                  </span>
                  <br />
                  <span>
                    {`水费：${item.sfhj}元(上次:${item.sscds},本次:${item.sbcds},实用:${
                      item.ssyds
                    },公摊:${item.sgtds ? item.sgtds : 0},单价:${item.sdj})`}
                  </span>
                  <br />
                  <Row>
                    <Col {...colLayout}>{showfy('月租费', item.czje)}</Col>
                    <Col {...colLayout}>{showfy('网络费', item.wlf)}</Col>
                    <Col {...colLayout}>{showfy('管理费', item.glf)}</Col>
                    <Col {...colLayout}>{showfy('卫生费', item.ljf)}</Col>
                    <Col {...colLayout}>{showfy('上月结转费', item.syjzf)}</Col>
                    <Col {...colLayout}>{showfy('其它费', item.qtf)}</Col>
                  </Row>
                </div>
                <Input.TextArea
                  id={`szdxText_${i}`}
                  rows="6"
                  readOnly
                  style={{ display: `${curs[i] ? '' : 'none'}` }}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default FmFyxx;
