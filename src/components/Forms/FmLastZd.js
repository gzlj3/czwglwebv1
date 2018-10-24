import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  List,
  Modal,
  // Input,
  // Form,
  Card,
  Row,
  Col,
} from 'antd';

// const FormItem = Form.Item;

class FmFyxx extends PureComponent {
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

  szdx = () => {
    window.clipboardData.setData('Text', 'test');
  };

  render() {
    // const {
    // form: { getFieldDecorator },
    // } = this.props;
    const { zdList, qrsz } = this.props;
    const showfy = (fym, fy) => (fy ? `${fym}：${fy}` : '');
    const colLayout = {
      sm: 24,
      md: 12,
      lg: 8,
      xxl: 8,
    };

    const getActions = item =>
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
                this.szdx(item);
              }}
          >
              收租短信
          </a>,
          ]
        : null;

    const getSzzt = (sfsz) =>{
      if(sfsz === '1') return <span style={{marginLeft:20}}>已结清</span>
      return <span style={{marginLeft:20,color:'red'}}>未结清</span>
    }

    return (
      <div>
        <List
          size="large"
          rowKey="id"
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
          // loading={loading}
          pagination={false}
          dataSource={zdList}
          renderItem={item => (
            <List.Item>
              <Card
                title={
                  <span style={{ fontSize: 16 }}>
                    <span>{`${item.fwmc}  ${item.zhxm}`}</span>
                    <span style={{ marginLeft: 30 }}>
                      {`${moment(item.rq1).format('YYYY年MM月')}费用：${item.fyhj}元`}
                      {getSzzt(item.sfsz)}
                    </span>
                  </span>
                }
                actions={getActions(item)}
              >
                <span style={{ marginLeft: 0 }}>{`收费时段：${item.rq1}--${item.rq2}`}</span>
                <br />
                <span>
                  {`电费合计：${item.dfhj}元(上次:${item.dscds},本次:${item.dbcds},实用:${
                    item.dsyds
                  },公摊:${item.dgtds},单价:${item.ddj})`}
                </span>
                <br />
                <span>
                  {`水费合计：${item.sfhj}元(上次:${item.sscds},本次:${item.sbcds},实用:${
                    item.ssyds
                  },公摊:${item.sgtds},单价:${item.sdj})`}
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
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default FmFyxx;
