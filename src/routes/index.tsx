import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import LoginPage from '~/pages/auth/Login'
import RegisterPage from '~/pages/auth/Register'
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
  }
]
