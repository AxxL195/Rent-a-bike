import { Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/landingpage/LandingPage'
import CustomerDashboard from '../pages/customer/customerdashboard/CustomerDashboard'
import SearchResults from '../pages/customer/customerdashboard/searchresults/SearchResults'
import ShopForm from '../pages/owner/shop/ShopForm'
import ManageBikes from '../pages/owner/ManageBikes'
import BikeForm from '../pages/owner/BikeForm'
import OwnerDashboard from '../pages/owner/ownerdashboard/OwnerDashboard'
import ViewBooking from '../pages/owner/ViewBooking'
import ShopManagement from '../pages/owner/shop/ShopManagement'
import ShopDetailsCustomer from '../pages/customer/shopdetails/ShopDetailsCustomer'
import BikeDetailsCustomer from '../pages/customer/customerdashboard/bikedetails/BikeDetailsCustomer'
import Checkout from '../pages/customer/booking/Checkout'
import MyBookings from '../pages/customer/customerdashboard/mybookings/MyBookings'


const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/customer/:customerId/dashboard' element={<CustomerDashboard/>} />
      <Route path='/owner/:ownerId/dashboard' element={<OwnerDashboard/>} />
      <Route path='/sr' element={<SearchResults/>} />
      <Route path="/owner/:ownerId/shops/create" element={<ShopForm/>} />
      <Route path="/owner/:ownerId/bikes" element={<ManageBikes/>} />
      <Route path="/owner/:shopId/bikes/create" element={<BikeForm/>} />
      <Route path="/owner/:ownerId/bookings" element={<ViewBooking/>} />
      <Route path="/owner/:ownerId/shops/:shopId/bikes" element={<ShopManagement />} />
      <Route path="/customer/:customerId/shops/:shopId" element={<ShopDetailsCustomer />} />
      <Route path="/customer/:customerId/:shopId/:bikeId" element={<BikeDetailsCustomer />} />
      <Route path="/customer/:customerId/:shopId/:bikeId/checkout" element={<Checkout/>}/>
      <Route path="/customer/:customerId/my-bookings" element={<MyBookings/>} />
    </Routes>
  )
}

export default AppRoutes