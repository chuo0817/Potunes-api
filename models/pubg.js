import request from 'koa-request'
import crypto from 'crypto'
import * as pool from '../models/db'
const appId = 'wx5e66eca60e4e9fc0'
import pubg from 'pubg.js'
const client = new pubg.Client('e6901174-dc02-4b2c-8b01-00c0b8a452ce')


// 根据GroupID返回本群吃鸡排行
function* queryGroup(open_Gid) {
  const selectAll = 'SELECT * FROM pubg_user INNER JOIN pubg_openGid_user ON pubg_openGid_user.open_id = pubg_user.open_id WHERE pubg_openGid_user.open_Gid = ? order by total_chickens desc;'
  const selectParams = [open_Gid]
  const result = yield pool.query(selectAll, selectParams)
  return result
}

export function* encryptData(body) {
  // 保存openid
  const query = 'SELECT * FROM pubg_user where open_id = ?'
  const param = [
    body.open_id,
  ]
  const isExists = yield pool.query(query, param)
  if (isExists.length == 0) {
    const insertOpenID = 'INSERT INTO pubg_user(open_id) VALUES(?)'
    yield pool.query(insertOpenID, param)
  }

  // base64 decode
  const sessionKey = new Buffer(body.session_key, 'base64')
  const encryptedData = new Buffer(body.encryptedData, 'base64')
  const iv = new Buffer(body.iv, 'base64')
  // 解密
  const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
  // 设置自动 padding 为 true，删除填充补位
  decipher.setAutoPadding(true)
  let decoded = decipher.update(encryptedData, 'binary', 'utf8')
  decoded += decipher.final('utf8')
  decoded = JSON.parse(decoded)
  const open_Gid = decoded.openGId

  // 用户和群关系表
  const GIDParams = [
    open_Gid,
    body.open_id,
  ]
  const GIDQuery = 'SELECT * FROM pubg_openGid_user where open_Gid = ? and open_id = ?'
  const queryExists = yield pool.query(GIDQuery, GIDParams)
  if (queryExists.length == 0) {
    const insertOpenGID = 'INSERT INTO pubg_openGid_user(open_Gid, open_id) VALUES(?, ?)'
    yield pool.query(insertOpenGID, GIDParams)
  }


  // try {
  //
  // } catch (err) {
  //   throw new Error('Illegal Buffer')
  // }
  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer')
  }
  const result = yield queryGroup(open_Gid)
  return result
}

export function* getPubgUserInfo(body) {
  const pubg_nickname = body.pubg_nickname
  const open_id = body.open_id
  const open_Gid = body.open_Gid
  const nickname = body.user_info.nickName
  const avatar = body.user_info.avatarUrl
  console.log(avatar)
  client.getProfile('lastshrek')
  .then(profile => {
      // const myRank = profile.getStats({
      //     region: 'as',
      //     season: '2017-pre6',
      //     match: 'squad'
      // }).getItem('Rating').rank;
      //
      // console.log(`My ranking in solo, oceania this season is ${myRank}`);
    console.log(profile)
  })
  .catch(err => {
    console.log(err)
  })

  // const response = yield request(options)
  // // 如果没有此用户
  // const user_info = JSON.parse(response.body)


  // // 保存到当前数据库中
  // const query = 'UPDATE pubg_user SET pubg_name = ? , total_chickens = ? , nickname = ?, avatar = ? where open_id = ?'
  // const params = [pubg_nickname, sum, nickname, avatar, open_id]
  // yield pool.query(query, params)
  // // 返回本群所有数据
  // const result = yield queryGroup(open_Gid)
  return new Promise((resolve, reject) => {
    client.getProfile('lastshrek')
    .then(profile => {
        // const myRank = profile.getStats({
        //     region: 'as',
        //     season: '2017-pre6',
        //     match: 'squad'
        // }).getItem('Rating').rank;
        //
        // console.log(`My ranking in solo, oceania this season is ${myRank}`);
      resolve(profile)
    })
    .catch(err => {
      reject(err)
    })
    // api.getProfileByNickname(pubg_nickname)
    //   .then((profile) => {
    //     const data = profile.content
    //     console.log(data)
        // 获取当前season
        // const defaultSeason = data.defaultSeason
        // // 获取当前season的数据
        // const stats = data.Stats
        // const thisSeasonStats = []
        // let sum = 0
        // stats.forEach((val, index, arr) => {
        //   const stat = arr[index]
        //   if (stat.Region == 'agg' && stat.Season == defaultSeason) {
        //     const wins = stat.Stats[4].ValueInt
        //     sum += wins
        //   }
        //   if (stat.Region !== 'agg' && stat.Season == defaultSeason) {
        //     thisSeasonStats.push(stat)
        //   }
        // })
        // console.log(sum)
        // resolve(thisSeasonStats)
      // })
      // .catch(err => {
      //   console.log(err)
      //   reject(err)
      // })
  })
}
