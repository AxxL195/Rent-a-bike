import { Route, Routes } from 'react-router-dom'
import Login from '../pages/login/Login'
import LandingPage from '../pages/landingpage/LandingPage'
import Home from '../pages/home/Home'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      {/* <Route path='/login' element={<Login/>} /> */}
      <Route path='/home' element={<Home/>} />
    </Routes>
  )
}

export default AppRoutes