import request from '@/utils/request'

// 查询消息推送流水列表
export function listPostrecord(query) {
  return request({
    url: '/system/postrecord/list',
    method: 'get',
    params: query
  })
}

// 查询消息推送流水详细
export function getPostrecord(id) {
  return request({
    url: '/system/postrecord/' + id,
    method: 'get'
  })
}

// 新增消息推送流水
export function addPostrecord(data) {
  return request({
    url: '/system/postrecord',
    method: 'post',
    data: data
  })
}

// 修改消息推送流水
export function updatePostrecord(data) {
  return request({
    url: '/system/postrecord',
    method: 'put',
    data: data
  })
}

// 删除消息推送流水
export function delPostrecord(id) {
  return request({
    url: '/system/postrecord/' + id,
    method: 'delete'
  })
}
