import request from '@/utils/request'

// 查询欠费用户列表
export function listPostuser(query) {
  return request({
    url: '/system/postuser/list',
    method: 'get',
    params: query
  })
}

// 查询欠费用户详细
export function getPostuser(id) {
  return request({
    url: '/system/postuser/' + id,
    method: 'get'
  })
}

// 新增欠费用户
export function addPostuser(data) {
  return request({
    url: '/system/postuser',
    method: 'post',
    data: data
  })
}

// 修改欠费用户
export function updatePostuser(data) {
  return request({
    url: '/system/postuser',
    method: 'put',
    data: data
  })
}

// 删除欠费用户
export function delPostuser(id) {
  return request({
    url: '/system/postuser/' + id,
    method: 'delete'
  })
}

//推送欠费信息
export function pushArrearsInfo(userId, pushType) {
  const data = {
    userId, pushType
  }
  return request({
    url: '/system/postuser/pushParams',
    method: 'post',
    data: data
  })
}
