import md5 from 'md5'
import { ElMessage } from 'element-plus'
import axios from 'axios'

/**
 * 前端封装 curl 方法
 * @param options 请求参数
 */
const curl = ({
  url,
  method = 'post',
  query = {},
  data = {},
  headers = { 'Content-Type': 'application/json' },
  responseType = 'json',
  timeout = 5000,
  errorMessage = '网络异常',
}) => {
  const signKey = 'my-api-sign-key'
  const s_t = Date.now()
  const s_sign = md5(`${signKey}${s_t}`)

  const options = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: {
      s_sign,
      s_t,
      ...headers,
    },
  }

  return axios(options)
    .then((res) => {
      const resData = res.data || {}
      // 后端返回 API 格式
      const { success, msg, data = {}, metadata = null } = resData
      if (!success) {
        const { message, code } = resData
        if (code === 403) {
          ElMessage.error('签名验证失败，请检查请求是否合法')
        } else if (code === 445) {
          ElMessage.error('未登录或登录已过期，请重新登录')
        } else {
          ElMessage.error(message || errorMessage)
        }
        console.error(
          `[-- curl error --] url: ${url}, message: ${message || errorMessage}`,
        )
        return Promise.resolve({ success, code, message })
      }

      // 成功
      return Promise.resolve({ success, data, metadata })
    })
    .catch((err) => {
      ElMessage.error(err.message || errorMessage)
      throw err
    })
}

export default curl
