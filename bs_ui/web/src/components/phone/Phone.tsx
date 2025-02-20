import { Route, Routes } from 'react-router-dom'
import Home from './apps/home/Home'
import PhoneHeader from './components/header/PhoneHeader'
import NavigationBar from './components/navigationbar/NavigationBar'
import Notification from './components/notification/Notification'
import { APPS } from './config/apps'
import PhoneWrapper from './PhoneWrapper'

export default function Phone() {
  return (
    <>
      <PhoneWrapper>
        <PhoneHeader />
        <Notification />
        <div className="phone-app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            {APPS.map((app) => (
              <Route path={app.rootPath} element={<app.component />} />
            ))}
          </Routes>
        </div>
        <NavigationBar />
      </PhoneWrapper>
    </>
  )
}
