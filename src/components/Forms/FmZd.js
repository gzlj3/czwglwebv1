import React, { PureComponent } from 'react';
import {
  Input,
  Form,
  Row,
  Col,
} from 'antd';

const FormItem = Form.Item;

class FmFyxx extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 13 },
  };

  colLayout = {
    sm:24,
    md:12,
    lg:8,
    xxl:6,
  };

  fieldParams = {
    // validateTrigger: 'onBlur',
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      current,
    } = this.props;

    return (
      <div>
        <FormItem>
          {getFieldDecorator('id', {
                initialValue: current.id,
                })(<Input type='hidden' />)}
        </FormItem>
        <Row>
          <Col {...this.colLayout}>
            <b>{`${current.fwmc}  ${current.zhxm}`}</b>
          </Col>
        </Row>

      </div>
    );
  };
}
export default FmFyxx;