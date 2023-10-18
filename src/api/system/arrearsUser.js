import request from '@/utils/request'

// 查询欠费用户列表
export function listArrearsUser(query) {
  return request({
    url: '/system/arrearsUser/list',
    method: 'get',
    params: query
  })
}

// 查询欠费用户详细
export function getArrearsUser(id) {
  return request({
    url: '/system/arrearsUser/' + id,
    method: 'get'
  })
}

// 新增欠费用户
export function addArrearsUser(data) {
  return request({
    url: '/system/arrearsUser',
    method: 'post',
    data: data
  })
}

// 修改欠费用户
export function updateArrearsUser(data) {
  return request({
    url: '/system/arrearsUser',
    method: 'put',
    data: data
  })
}

// 删除欠费用户
export function delArrearsUser(id) {
  return request({
    url: '/system/arrearsUser/' + id,
    method: 'delete'
  })
}
//推送欠费信息
export function pushArrearsInfo(id) {
  return request({
    url: '/system/arrearsUser/' + id,
    method: 'post'
  })
}
