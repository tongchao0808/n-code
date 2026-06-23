import request from '@/utils/request'

// 获取知识图谱
export function getGraph(keyword = "", usedKg = "MAIN", limit = 100, maxDepth = 1) {

  return request({
    url: '/agent/knowledge/graph/search',
    method: 'post',
    data: {
      keyword,
      maxDepth,
      limit,
      neo4jType: usedKg,
    }
  })
}

// 获取节点详情
export function getNodeDetail(nodeId, usedKg = "MAIN") {
  return request({
    url: '/agent/knowledge/graph/detail/node',
    method: 'get',
    params: {
      nodeId,
      neo4jType: usedKg,
    }
  })
}

// 获取边详情
export function getLineDetail(edgeId, nodeId, usedKg = "MAIN") {
  return request({
    url: '/agent/knowledge/graph/detail/edge',
    method: 'get',
    params: {
      edgeId,
      nodeId,
      neo4jType: usedKg,
    }
  })
}

export function getNodeCount(usedKg = "MAIN") {
  return request({
    url: '/agent/knowledge/graph/node/count',
    method: 'get',
    params: {
      neo4jType: usedKg,
    }
  })
}

export function getLineCount(usedKg = "MAIN") {
  return request({
    url: '/agent/knowledge/graph/edge/count',
    method: 'get',
    params: {
      neo4jType: usedKg,
    }
  })
}
