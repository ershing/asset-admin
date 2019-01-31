import axios from '@/libs/api.request'

//字典
export const getAllBaseDict = () => {
    return axios.request({
        method: 'get',
        url: '/dict/all-base'
    })
}

//首页
export const getFlow = (params) => {
    return axios.request({
        method: 'get',
        url: 'asset-charge/flow',
        params,
    })
}

export const getFlexibleCount = (params) => {
    return axios.request({
        method: 'get',
        url: 'spending/flexible-count',
        params,
    })
}

//资产
export const getAsset = (params) => {
    return axios.request({
        method: 'get',
        url: 'asset/list',
        params,
    })
}

export const upsertAsset = (data) => {
    return axios.request({
        method: 'post',
        url: 'asset/upsert',
        data,
    })
}

export const deleteAsset = (data) => {
    return axios.request({
        method: 'post',
        url: 'asset/delete',
        data,
    })
}

export const assetNowProfit = (params) => {
    return axios.request({
        method: 'get',
        url: 'asset/now-profit',
        params,
    })
}

export const assetOriginProfit = (params) => {
    return axios.request({
        method: 'get',
        url: 'asset/origin-profit',
        params,
    })
}

export const assetTrend = (params) => {
    return axios.request({
        method: 'get',
        url: 'asset/trend',
        params,
    })
}

//账单
export const getCharge = (params) => {
    return axios.request({
        method: 'get',
        url: 'charge/list',
        params,
    })
}

export const upsertCharge = (data) => {
    return axios.request({
        method: 'post',
        url: 'charge/upsert',
        data,
    })
}

export const deleteCharge = (data) => {
    return axios.request({
        method: 'post',
        url: 'charge/delete',
        data,
    })
}

export const getByChargeType = (params) => {
    return axios.request({
        method: 'get',
        url: 'charge/charge-type',
        params,
    })
}

//定期账单
export const getRegularCharge = (params) => {
    return axios.request({
        method: 'get',
        url: 'regular-charge/list',
        params,
    })
}

export const upsertRegularCharge = (data) => {
    return axios.request({
        method: 'post',
        url: 'regular-charge/upsert',
        data,
    })
}

export const deleteRegularCharge = (data) => {
    return axios.request({
        method: 'post',
        url: 'regular-charge/delete',
        data,
    })
}

//分类
export const createDictClass = (data) => {
    return axios.request({
        method: 'post',
        url: 'dict-class/upsert',
        data,
    })
}

export const getDictClass = (params) => {
    return axios.request({
        method: 'get',
        url: 'dict-class/list',
        params,
    })
}

export const delDictClass = (data) => {
    return axios.request({
        method: 'post',
        url: 'dict-class/delete',
        data,
    })
}

export const classifyBaseDict = (data) => {
    return axios.request({
        method: 'post',
        url: 'dict-base/classify',
        data,
    })
}

