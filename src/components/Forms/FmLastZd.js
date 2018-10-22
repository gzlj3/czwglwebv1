import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  List,
  Modal,
  // Input,
  // Form,
  Card,
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

    const getActions = (item)=>
      item.sfsz==='0'?[
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
      :null;
  
    return (
      <div>
        <List
          size="large"
          rowKey="id"
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          // loading={loading}
          pagination={false}
          dataSource={zdList}
          renderItem={item => (
            <List.Item>
              <Card
                title={
                  <span style={{fontSize:20}}>
                    <span>{`${item.fwmc}  ${item.zhxm}`}</span>
                    <span style={{ marginLeft: 30 }}>
                      {`${moment(item.szrq).format('YYYY年MM月')}费用:${item.fyhj}元,
                        ${item.sfsz==='1'?'已结清':'未结清'}
                      `}
                    </span>
                  </span>
                }
                actions={getActions(item)}
              >
                <span style={{ marginLeft: 30 }}>{`收费时段：${item.rq1}--${item.rq2}`}</span>
                水电费列表
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default FmFyxx;
