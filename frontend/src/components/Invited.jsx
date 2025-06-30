import emptyFolder from '../assets/empty-folder.png'
import apiFetch from '../services/api'
import { formatDateTime } from '../utils/dateTimeUtils'

const Invited = ({ invitedDetails, setInvitedDetails, setPreviewId, setCvType, id, reload, toast }) => {
  const handleInvite = async (studentId) => {
    try {
      await apiFetch(`/projects/${id}/invite/${studentId}`, 'POST')
      const updatedInvited = invitedDetails.map(item => {
        if (item.student._id === studentId) {
          return { ...item, status: 'invited' }
        }
        return item
      })
      setInvitedDetails(updatedInvited)
      toast.success('Gửi lời mời thành công')
    } catch (error) {
      toast.error('Gửi lời mời thất bại: ' + error.message)
    }
  }
  const handleDeleteInvited = async (studentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ mời ứng viên này?'))
      return

    try {
      await apiFetch(`/projects/invited/${id}/${studentId}`, 'DELETE')
      const updatedInvited = invitedDetails.filter(item => item.student._id !== studentId)
      setInvitedDetails(updatedInvited)
      reload()
    } catch (err) {
      console.log('Cannot delete applied job', err.message)
    }
  }

  const checkStatus = invitedDetails.every(item => item.status === 'invited')

  return (
    <div className="flex flex-col gap-4 rounded-medium p-10 bg-white-bright">
      {invitedDetails.length > 0 && (
        <div className="flex items-center justify-between px-5">
          <span className='text-gray-500 w-1/5'>Họ và tên</span>
          <span className='text-gray-500 w-1/6'>Email</span>
          <span className='text-gray-500 w-[15%]'>Ngày mời</span>
          <span className='text-gray-500 w-1/6'>Trạng thái</span>
          <span className='text-gray-500 w-[15%]'>CV ứng tuyển</span>
          <span className='text-gray-500 w-[12%]'>Hành động</span>
        </div>
      )}
      {invitedDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[400px]">
          <img className='w-1/5' src={emptyFolder} alt="emptyFolder" />
          <p className="text-gray-500 font-semibold">Bạn chưa mời ai vào dự án.</p>
        </div>
      ) : (
        invitedDetails.map((s, index) => (
          <div key={index} className="flex items-center justify-between p-5 border border-white-mid rounded-small hover:shadow">
            <div className="flex items-center gap-4 w-1/5">
              <img
                src={`data:image/png;base64,${s.student.account?.avatar?.data || s.student.account?.avatar}`}
                alt={s.student.name}
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h4
                  className="text-lg font-semibold"
                >
                  {s.student.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {s.student.mssv}
                </p>
              </div>
            </div>

            <span className="text-sm text-gray-500 w-1/6">{s.student.account?.email}</span>
            <span className="text-sm text-gray-500 w-[15%]">{formatDateTime(s.appliedAt)}</span>
            <span className="text-sm font-semibold w-1/6">
              {checkStatus ? (
                <div className="inline-flex items-center gap-2 border text-yellow-500 border-yellow-500 px-2 py-1 rounded-full bg-yellow-50">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Chờ chấp nhận
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 border text-red-500 border-red-500 px-2 py-1 rounded-full bg-red-50">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Bị từ chối
                </div>
              )}
            </span>
            <span className="text-sm text-blue w-[15%] font-semibold underline cursor-pointer"

              onClick={() => {
                setPreviewId(s.cv)
                setCvType(s.cvType)
              }}
            >Xem CV</span>

            <div className="w-[12%] space-x-2">
              {!checkStatus && (
                <button
                  className="text-sm px-4 py-2 text-white bg-blue rounded-full cursor-pointer hover:bg-blue-700 outline-none"
                  onClick={() => handleInvite(s.student._id)}
                >
                  Mời lại
                </button>
              )}
              <button
                className="text-sm px-4 py-2 text-white bg-red rounded-full cursor-pointer hover:bg-red-700 outline-none"
                onClick={() => handleDeleteInvited(s.student._id)}
              >
                  Huỷ
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Invited