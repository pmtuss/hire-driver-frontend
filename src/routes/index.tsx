import AuthLayout from '~/layouts/AuthLayout'
import BackLayout from '~/layouts/BackLayout'
import DriverLayout from '~/layouts/DriverLayout'
import MainLayout from '~/layouts/MainLayout'
import NotFound from '~/pages/NotFound'
import AddressPage from '~/pages/account/Address'
import AddressNewPage from '~/pages/account/Address/new'
import LogoutPage from '~/pages/account/Logout'
import ProfilePage from '~/pages/account/Profile'
import VehiclePage from '~/pages/account/Vehicle'
import NewVehiclePage from '~/pages/account/Vehicle/new'
import LoginPage from '~/pages/auth/Login'
import RegisterPage from '~/pages/auth/Register'
import DriverHomePage from '~/pages/driver/Home'
import RidesPage from '~/pages/driver/Rides'
import AccountPage from '~/pages/main/Account'
import BookingPage from '~/pages/main/Booking'
import HistoryPage from '~/pages/main/History'
import HomePage from '~/pages/main/Home'

export const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    element: LoginPage,
    layout: AuthLayout
  },
  {
    path: '/register',
    name: 'Register',
    element: RegisterPage,
    layout: AuthLayout
  },
  {
    path: '/test',
    name: 'Test',
    element: HomePage,
    layout: MainLayout
  }
]

export const privateRoutes = [
  {
    path: '/',
    name: 'Home',
    element: HomePage,
    layout: MainLayout
  },
  {
    path: '/booking',
    name: 'Booking',
    element: BookingPage,
    layout: MainLayout
  },
  {
    path: '/history',
    name: 'History',
    element: HistoryPage,
    layout: MainLayout
  },
  {
    path: '/account',
    name: 'Account',
    element: AccountPage,
    layout: MainLayout
  },
  {
    path: '/profile',
    name: 'Profile',
    element: ProfilePage,
    layout: BackLayout
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    element: VehiclePage,
    layout: BackLayout
  },
  {
    path: '/vehicles/new',
    name: 'Add new vehicle',
    element: NewVehiclePage,
    layout: BackLayout
  },
  {
    path: '/vehicles/:id',
    name: 'Update vehicles',
    element: NewVehiclePage,
    layout: BackLayout
  },
  {
    path: '/addresses',
    name: 'Your Addresses',
    element: AddressPage,
    layout: BackLayout
  },
  {
    path: '/addresses/new',
    name: 'Add new address',
    element: AddressNewPage,
    layout: BackLayout
  },
  {
    path: '/addresses/:id',
    name: 'Update address',
    element: AddressNewPage,
    layout: BackLayout
  },
  {
    path: '/logout',
    name: 'Logout',
    element: LogoutPage
  },
  {
    path: '*',
    name: 'NotFound',
    element: NotFound
  }
]

export const driverPrivateRoutes = [
  {
    path: '/',
    name: 'Home',
    element: DriverHomePage,
    layout: DriverLayout
  },
  {
    path: '/rides',
    name: 'Rides',
    element: RidesPage,
    layout: DriverLayout
  },
  {
    path: '/profile',
    name: 'Profile',
    element: ProfilePage,
    layout: DriverLayout
  },
  {
    path: '/logout',
    name: 'Logout',
    element: LogoutPage
  },
  {
    path: '*',
    name: 'NotFound',
    element: NotFound
  }
]
