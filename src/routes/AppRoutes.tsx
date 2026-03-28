import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/landingpage/LandingPage'
import CustomerDashboard from '../pages/customer/customerdashboard/CustomerDashboard'
import SearchResults from '../pages/customer/customerdashboard/searchresults/SearchResults'
import ShopForm from '../pages/owner/onboardingpage/ShopForm'
import ManageBikes from '../pages/owner/ManageBikes'
import BikeForm from '../pages/owner/BikeForm'
import OwnerDashboard from '../pages/owner/ownerdashboard/dashboard'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/cd' element={<CustomerDashboard/>} />
      <Route path='/od' element={<OwnerDashboard/>} />
      <Route path='/sr' element={<SearchResults/>} />
      <Route path="/shopform" element={<ShopForm/>} />
      <Route path="/mb" element={<ManageBikes/>} />
      <Route path="/bf" element={<BikeForm/>} />
    </Routes>
  )
}

export default AppRoutes