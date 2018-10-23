import React, { PureComponent } from 'react';
import moment from 'moment';
import { Input, InputNumber, Form, DatePicker, Row, Col,Divider } from 'antd';

const FormItem = Form.Item;

class FmFyxx extends PureComponent {
  state = {
    qyzt: false,  // 签约状态，zhxm不为空，则表示处理签约状态
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

  componentDidMount() {
    const { current } = this.props;
    if(current && current.zhxm){
      this.onZhxmChange({target:{value:current.zhxm}});
    }
  }

  onZhxmChange = (e)=>{
    const qyzt = e.target.value !== null && e.target.value.length>0;
    // console.log(qyzt);
    this.setState({
      qyzt,
    }, () => {
      const {form} = this.props;
      if(!qyzt)
        form.validateFields(['dhhm','czje','htrqq','htrqz','dqsds','sqsds','ddj','sdj','szrq'], { force: true });
    });
  };

  onHtrqqChange = (date)=>{
    const {form} = this.props;
    const szrq = form.getFieldValue('szrq');
    if(szrq === null){
      // 根据合同日期起自动生成下次收租日期,加1月
      const htrqq = date.clone();
      form.setFieldsValue({'szrq':htrqq.add(1,'months')});
    }
    const htrqz = form.getFieldValue('htrqz');
    if(htrqz === null){
      // 根据合同日期起自动生成下次收租日期，加1年
      const htrqq = date.clone();
      form.setFieldsValue({'htrqz':htrqq.add(1,'years')});
    }
  }


  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { current } = this.props;
    const {qyzt} = this.state;

    return (
      <div>
        {/* 隐藏字段，避免在编辑时清空这些字段 */}
        {getFieldDecorator('houseid', {initialValue: current.houseid,})(<Input type="hidden" />)}
        {getFieldDecorator('yzhid', {initialValue: current.yzhid,})(<Input type="hidden" />)}
        {getFieldDecorator('sfsz', {initialValue: current.sfsz,})(<Input type="hidden" />)}
        {getFieldDecorator('dbcds', {initialValue: current.dbcds})(<Input type="hidden" />)}
        {getFieldDecorator('sbcds', {initialValue: current.sbcds})(<Input type="hidden" />)}
        <Row>
          <Col {...this.colLayout}>
            <FormItem label="房屋名称" {...this.formLayout}>
              {getFieldDecorator('fwmc', {
                rules: [{ required: true, message: '请输入房屋名称' }],
                initialValue: current.fwmc,
                ...this.fieldParams,
              })(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Divider orientation="left" dashed style={{fontSize: 8,color:'blue'}}>签约信息</Divider>          
          <Col {...this.colLayout}>
            <FormItem label="租户姓名" {...this.formLayout}>
              {getFieldDecorator('zhxm', {
                initialValue: current.zhxm,
              })(<Input placeholder="" onBlur={this.onZhxmChange} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="身份证号" {...this.formLayout}>
              {getFieldDecorator('sfzh', {
                initialValue: current.sfzh,
              })(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="电话号码" {...this.formLayout}>
              {getFieldDecorator('dhhm', {
                initialValue: current.dhhm,
                rules: [{ required: qyzt, message: '请输入电话号码' }],
              })(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="出租金额" {...this.formLayout}>
              {getFieldDecorator('czje', {
                initialValue: current.czje,
                rules: [{ required: qyzt, message: '请输入出租金额' }],
              })(<InputNumber min={0} step={50} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="押金" {...this.formLayout}>
              {getFieldDecorator('yj', {
                initialValue: current.yj,
              })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="合同日期起" {...this.formLayout}>
              {getFieldDecorator('htrqq', {
                initialValue: current.htrqq ? moment(current.htrqq) : null,
                rules: [{ required: qyzt, message: '请输入合同日期起' }],
              })(<DatePicker onChange={this.onHtrqqChange} placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="合同日期止" {...this.formLayout}>
              {getFieldDecorator('htrqz', {
                initialValue: current.htrqz ? moment(current.htrqz) : null,
                rules: [{ required: qyzt, message: '请输入合同日期止' }],
              })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="下次收租日期" {...this.formLayout}>
              {getFieldDecorator('szrq', {
                initialValue: current.szrq ? moment(current.szrq) : null,
                rules: [{ required: qyzt, message: '请输入收租日期' }],
              })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="电起始读数" {...this.formLayout}>
              {getFieldDecorator('dscds', {
                initialValue: current.dscds,
                rules: [{ required: qyzt, message: '请输入电起始读数' }],
              })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="水起始读数" {...this.formLayout}>
              {getFieldDecorator('sscds', {
                initialValue: current.sscds,
                rules: [{ required: qyzt, message: '请输入水起始读数' }],
              })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="电费单价" {...this.formLayout}>
              {getFieldDecorator('ddj', {
                initialValue: current.ddj,
                rules: [{ required: qyzt, message: '请输入电费单价' }],
              })(<InputNumber min={0} step={0.1} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="水费单价" {...this.formLayout}>
              {getFieldDecorator('sdj', {
                initialValue: current.sdj,
                rules: [{ required: qyzt, message: '请输入水费单价' }],
              })(<InputNumber min={0} step={0.1} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="电公摊度数" {...this.formLayout}>
              {getFieldDecorator('dgtds', {
                initialValue: current.dgtds,
              })(<InputNumber min={0} step={1} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="水公摊度数" {...this.formLayout}>
              {getFieldDecorator('sgtds', {
                initialValue: current.sgtds,
              })(<InputNumber min={0} step={1} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Divider orientation="left" dashed style={{fontSize: 12,color:'blue'}}>其它费用</Divider>          
          <Col {...this.colLayout}>
            <FormItem label="网络费" {...this.formLayout}>
              {getFieldDecorator('wlf', {
                initialValue: current.wlf,
              })(<InputNumber min={0} step={10} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="管理费" {...this.formLayout}>
              {getFieldDecorator('glf', {
                initialValue: current.glf,
              })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="卫生费" {...this.formLayout}>
              {getFieldDecorator('ljf', {
                initialValue: current.ljf,
              })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="其它费" {...this.formLayout}>
              {getFieldDecorator('qtf', {
                initialValue: current.qtf,
              })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="上月结转费" {...this.formLayout}>
              {getFieldDecorator('syjzf', {
                initialValue: current.syjzf,
              })(<InputNumber min={0} step={5} placeholder="" style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col {...this.colLayout}>
            <FormItem label="备注" {...this.formLayout}>
              {getFieldDecorator('bz', {
                initialValue: current.bz,
              })(<Input placeholder="" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}
export default FmFyxx;
