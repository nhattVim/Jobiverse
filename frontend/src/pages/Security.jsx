import Sidebar from '../components/Sidebar'
import BannerText from '../components/BannerText'
import { ToastContainer, toast } from 'react-toastify'

const Security = () => {
  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <BannerText title="CV của tôi" caption="Tải CV của bạn bên dưới để có thể sử dụng xuyên suốt quá trình tìm việc." />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <div className="flex-shrink-0 w-1/4">
          <Sidebar />
        </div>

        <div className="w-3/4 space-y-10">
          aa
        </div>
      </div>
    </div>
  )
}

export default Security
