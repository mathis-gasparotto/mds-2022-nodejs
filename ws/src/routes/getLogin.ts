import { Application } from "express-ws"
import path from 'path'

export function getLogin (app: Application) {
  app.get('/login', (req, res) => {
    if(req.signedCookies.ssid) {
      res.redirect('/')
      return
    }
    
    res.sendFile(path.join(__dirname, '../../pages/login/index.html'))
  })
}