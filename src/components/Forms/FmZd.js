import React, { PureComponent } from 'react';
import {
  List,
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

  render() {
    // const {
    // form: { getFieldDecorator },
    // } = this.props;
    const { zdList } = this.props;

    return (
      <div>
        <List
          size="large"
          rowKey="id"
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          // loading={loading}
          pagination={false}
          dataSource={zdList}
          renderItem={item => (
            <List.Item>
              <Card
                title={
                  <span>
                    <b>{`${item.fwmc}  ${item.zhxm}`}</b>
                    <span style={{ marginLeft: 30 }}>{`收费时段：${item.rq1}--${item.rq2}`}</span>
                  </span>
                }
                actions={[
                  <a
                    onClick={e => {
                      e.preventDefault();
                      this.editFy(item);
                    }}
                  >
                    确认收租
                  </a>,
                  <a
                    onClick={e => {
                      e.preventDefault();
                      this.lastZd(item);
                    }}
                  >
                    收租短信
                  </a>,
                ]}
              >
                content
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default FmFyxx;
