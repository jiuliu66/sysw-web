import request from '@/utils/request'

// 查询测试示例列表
export function listExample(query) {
  return request({
    url: '/system/example/list',
    method: 'get',
    params: query
  })
}

// 查询测试示例详细
export function getExample(id) {
  return request({
    url: '/system/example/' + id,
    method: 'get'
  })
}

// 新增测试示例
export function addExample(data) {
  return request({
    url: '/system/example',
    method: 'post',
    data: data
  })
}

// 修改测试示例
export function updateExample(data) {
  return request({
    url: '/system/example',
    method: 'put',
    data: data
  })
}

// 删除测试示例
export function delExample(id) {
  return request({
    url: '/system/example/' + id,
    method: 'delete'
  })
}
