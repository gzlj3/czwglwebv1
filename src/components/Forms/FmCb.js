import React, { PureComponent } from 'react';
// import moment from 'moment';
import { Input, InputNumber, Form, List, Card } from 'antd';

const FormItem = Form.Item;

class FmCb extends PureComponent {
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
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      sdbList, // 水电列表
    } = this.props;

    return (
      <div>
        <List
          size="large"
          rowKey="id"
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          // loading={loading}
          pagination={false}
          dataSource={sdbList}
          renderItem={(item, i) => (
            <List.Item>
              <FormItem>
                {getFieldDecorator(`rows[${i}].houseid`, {
                  initialValue: item.houseid,
                })(<Input type="hidden" />)}
              </FormItem>
              <Card title={`${item.fwmc}  ${item.zhxm ? item.zhxm : '（未出租）'}`}>
                <FormItem label="水表读数" {...this.formLayout}>
                  {getFieldDecorator(`rows[${i}].sbcds`, {
                    initialValue: item.sbcds,
                  })(
                    <InputNumber
                      min={0}
                      step={10}
                      placeholder={`上次:${item.sscds}`}
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
                <FormItem label="电表读数" {...this.formLayout}>
                  {getFieldDecorator(`rows[${i}].dbcds`, {
                    initialValue: item.dbcds,
                  })(
                    <InputNumber
                      min={0}
                      step={10}
                      placeholder={`上次:${item.dscds}`}
                      style={{ width: '100%' }}
                    />
                  )}
                </FormItem>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default FmCb;
