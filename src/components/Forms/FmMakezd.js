import React, { PureComponent } from 'react';
// import moment from 'moment';
import { Table, } from 'antd';


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

  columns = [{
    title: '房屋名称',
    dataIndex: 'fwmc',
  }, {
    title: '租户姓名',
    dataIndex: 'zhxm',
  }, {
    title: '帐单费用',
    dataIndex: 'qtf',
  }, {
    title: '状态',
    dataIndex: 'bz',
  }];

  render() {
    const {
      zdList, // 水电列表
      selectedRowKeys, // 选中行
      onMakezdSelectChange,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: onMakezdSelectChange,
      getCheckboxProps: record => ({
        disabled: record.bz !== null, 
        name: record.fwmc,
      }),      
    };    
    // const hasSelected = selectedRowKeys && selectedRowKeys.length > 0;
    return (
      <div>
        <Table pagination={false} rowKey='houseid' rowSelection={rowSelection} columns={this.columns} dataSource={zdList} />
      </div>
    );
  }
}
export default FmCb;
