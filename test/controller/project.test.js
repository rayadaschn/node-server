const assert = require('assert')
const supertest = require('supertest')
const md5 = require('md5')
const koaCore = require('../../koa-core')

const signKey = 'my-api-sign-key'
const s_t = Date.now()
const s_sign = md5(`${signKey}${s_t}`)

describe('test/controller/project.test.js', function () {
  this.timeout(10000)

  let request

  it('启动服务', async () => {
    const app = await koaCore.start()
    request = supertest(app.listen())
  })

  it('获取项目列表', async () => {
    let temRequest = request.get('/api/model/list')
    temRequest = temRequest.set('s_t', s_t)
    temRequest = temRequest.set('s_sign', s_sign)

    const res = await temRequest
    assert(res.body.success === true)

    const resData = res.body.data
    assert(resData.length > 0)

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i]
      assert(item.model)
      assert(item.model.key)
      assert(item.model.name)
      assert(item.project)
      for (const projKey in item.project) {
        const projItem = item.project[projKey]
        assert(projItem.name)
      }
    }
  })
})
