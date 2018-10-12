// page当前状态
export const PAGE_LIST = 0;     // 列表查看状态
export const PAGE_SEEDETAIL = 1;    // 详表查看状态
export const PAGE_NEW = 2;      // 详表新增状态
export const PAGE_UPDATED = 3;  // 详表修改状态
export const getPageStateInfo=(pageState)=>['','详细','新增','编辑'][pageState];

// 后台处理返回状态
export const REMOTE_SUCCESS = 0; // 处理成功
export const REMOTE_ERROR = 1; // 处理错误
export const REMOTE_WAITTING = 10; // 等待远程处理返回状态

// 按钮点击动作
export const BUTTON_NONE = 0; // 无动作
export const BUTTON_ADD = 1; // 添加动作
export const BUTTON_MODIFY = 2; // 修改动作
export const BUTTON_DELETE = 3; // 删除动作
