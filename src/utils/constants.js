// page当前状态
export const PAGE_QUERY = 0; // 查看状态
export const PAGE_NEW = 1; // 新增状态
export const PAGE_UPDATED = 2; // 修改状态
export const PAGE_DELETE = 3; // 删除状态

// 后台处理返回状态
export const REMOTE_SUCCESS = 0; // 处理成功
export const REMOTE_ERROR = 1;   // 处理错误
export const REMOTE_WAITTING = 10; // 等待远程处理返回状态
