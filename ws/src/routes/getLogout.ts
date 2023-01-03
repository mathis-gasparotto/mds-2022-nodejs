import { Application } from "express-ws"

export function getLogout (app: Application) {
  app.get('/logout', (req, res) => {
    if(!req.signedCookies.ssid) {
      res.redirect('/login')
      return
    }
    res.clearCookie('ssid')
    res.redirect('/login')
    return
  })
}