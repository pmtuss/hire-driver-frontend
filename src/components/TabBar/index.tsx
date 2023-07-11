import { TabBar, TabBarProps } from 'antd-mobile'
import { AppOutline, TravelOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons'
import { useLocation, useNavigate } from 'react-router-dom'

export default function MTabBar(props: TabBarProps) {
  const location = useLocation()

  const { pathname } = location

  const navigate = useNavigate()

  const tabs = [
    {
      key: '/',
      icon: <AppOutline />,
      title: 'Home'
    },
    {
      key: '/booking',
      icon: <TravelOutline />,
      title: 'Booking'
    },
    {
      key: '/history',
      title: 'History',
      icon: <UnorderedListOutline />
    },
    {
      key: '/account',
      title: 'Account',
      icon: <UserOutline />
    }
  ]

  const handleChange = (value: string) => {
    navigate(value)
  }

  return (
    <TabBar {...props} safeArea activeKey={pathname} onChange={handleChange}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
