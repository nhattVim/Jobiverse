import { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { Outlet, useLocation } from 'react-router-dom'
import News from '../components/News'
import Footer from '../components/Footer'

const MainLayout = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
      <News />
      <Footer />
    </div>
  )
}

export default MainLayout
