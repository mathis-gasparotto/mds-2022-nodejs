import { Application } from "express-ws"
import bodyParser from "body-parser"
import { findUserById, findUserByUsername } from "../../repositories/userRepository"

export function postLogin (app: Application) {
  app.post('/login', bodyParser.urlencoded(), async (req, res) => {
    const userById = findUserById(req.signedCookies.ssid)
    if(!userById) {
      res.redirect('/')
      return
    }
    const user = await findUserByUsername(req.body.username)
    if (!user) {
      res.status(401).send('Invalid username')
      setTimeout(() => res.redirect('/login'), 5000)
      return
    }
    const expiresDate = new Date()
    expiresDate.setDate(expiresDate.getDate() + 14);
    res.cookie('ssid', user.id, { signed: true, httpOnly: true, expires: expiresDate, sameSite: true })
    res.redirect('/')
  })
}