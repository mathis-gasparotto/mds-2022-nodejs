import { Application } from 'express-ws'
import path from 'path'
import { findUserById } from '../../repositories/userRepository'

export function getChat(app: Application) {
  app.get('/', async (req, res) => {
    if(!req.signedCookies.ssid) {
      res.redirect('/login')
      return
    }

    const user = await findUserById(req.signedCookies.ssid)
    if(!user) {
      res.clearCookie('ssid')
      res.redirect('/login')
      return
    }
  
    res.sendFile(path.join(__dirname, '../../pages/index.html'))
  })
}