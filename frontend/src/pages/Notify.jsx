import BannerText from '../components/BannerText'
import Sidebar from '../components/Sidebar'
import apiFetch from '../services/api'
import { useState, useEffect } from 'react'

const Notify = () => {
  const [loading, setLoading] = useState(true)
  const [notiList, setNotiList] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await apiFetch('/notify/mark-as-read', 'PUT')
        const data = await apiFetch('/notify', 'GET')
        setNotiList(data ? data : [])
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  return (
    <div className="min-h-screen">
      <BannerText title="Thông báo" caption="Quản lí thông báo" />

      <div className="flex items-start gap-16 px-6 py-20 mx-auto max-w-7xl">
        <aside className="flex-shrink-0 w-1/4"><Sidebar /></aside>

        {loading ? (
          <div className="flex items-center justify-center w-full h-60">
            <p className="text-lg text-gray-500">Đang tải thông báo...</p>
          </div>
        ) : (
          <section className="w-full p-10 border border-gray-200 shadow-md bg-white-low rounded-medium">

            <div className='flex items-center justify-between mb-6'>
              <h2 className="text-lg font-semibold">Thông báo của bạn</h2>

              <button
                onClick={() => apiFetch('/notify', 'DELETE').then(() => setNotiList([]))}
                className="px-5 py-2 text-sm text-white rounded-full cursor-pointer bg-red hover:bg-red-700"
              >
                Xoá tất cả
              </button>
            </div>

            {notiList.length > 0 ? (
              <ul className="space-y-4">
                {notiList.map((noti) => (
                  <li key={noti._id} className="flex items-center justify-between p-4 transition-colors bg-white rounded shadow hover:bg-gray-50">
                    <div>
                      <p className="text-sm text-gray-600">{noti.content}</p>
                      <span className="text-xs text-gray-400">{new Date(noti.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      className='mr-10'
                      onClick={() => {
                        apiFetch(`/notify/${noti._id}`, 'DELETE')
                          .then(() => setNotiList(notiList.filter(item => item._id !== noti._id)))
                          .catch(err => console.error('Delete error:', err))
                      }}
                    >
                      Xoá
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center w-full h-60">
                <p className="text-lg text-gray-500">Không có thông báo nào.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Notify
