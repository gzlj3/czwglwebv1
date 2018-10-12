import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Input,
  InputNumber,
  Form,
  DatePicker,
  // Select,
} from 'antd';

const FormItem = Form.Item;
// const SelectOption = Select.Option;
// const { TextArea } = Input;

class FmFyxx extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
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
        <FormItem label="房屋名称" {...this.formLayout}>
          {getFieldDecorator('fwmc', {
                rules: [{ required: true, message: '请输入房屋名称' }],
                initialValue: current.fwmc,
                ...this.fieldParams,
                })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="租户姓名" {...this.formLayout}>
          {getFieldDecorator('zhxm', {
                initialValue: current.zhxm,
                })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="身份证号" {...this.formLayout}>
          {getFieldDecorator('sfzh', {
                initialValue: current.sfzh,
                })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="电话号码" {...this.formLayout}>
          {getFieldDecorator('dhhm', {
                initialValue: current.dhhm,
                })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="出租金额" {...this.formLayout}>
          {getFieldDecorator('czje', {
                initialValue: current.czje,
                })(<InputNumber min={0} step={50} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="押金" {...this.formLayout}>
          {getFieldDecorator('yj', {
                initialValue: current.yj,
                })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>

        <FormItem label="下次收租日期" {...this.formLayout}>
          {getFieldDecorator('szrq', {
                initialValue: current.szrq ? moment(current.szrq) : null,
                })(
                  <DatePicker
                    placeholder="请选择"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
        </FormItem>
        <FormItem label="合同日期起" {...this.formLayout}>
          {getFieldDecorator('htrqq', {
                initialValue: current.htrqq ? moment(current.htrqq) : null,
                })(
                  <DatePicker
                    placeholder="请选择"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
        </FormItem>
        <FormItem label="合同日期止" {...this.formLayout}>
          {getFieldDecorator('htrqz', {
                initialValue: current.htrqz ? moment(current.htrqz) : null,
                })(
                  <DatePicker
                    placeholder="请选择"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />
                )}
        </FormItem>
        <FormItem label="电起始读数" {...this.formLayout}>
          {getFieldDecorator('dqsds', {
                initialValue: current.dqsds,
                })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="水起始读数" {...this.formLayout}>
          {getFieldDecorator('sqsds', {
                initialValue: current.sqsds,
                })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="电费单价" {...this.formLayout}>
          {getFieldDecorator('dfdj', {
                initialValue: current.dfdj,
                })(<InputNumber min={0} step={0.1} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="水费单价" {...this.formLayout}>
          {getFieldDecorator('sfdj', {
                initialValue: current.sfdj,
                })(<InputNumber min={0} step={0.1} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="网络费" {...this.formLayout}>
          {getFieldDecorator('wlf', {
                initialValue: current.wlf,
                })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="垃圾费" {...this.formLayout}>
          {getFieldDecorator('ljf', {
                initialValue: current.ljf,
                })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem label="备注" {...this.formLayout}>
          {getFieldDecorator('bz', {
                initialValue: current.bz,
                })(<Input placeholder="" />)}
        </FormItem>
      </div>
    );
  };
}
export default FmFyxx;