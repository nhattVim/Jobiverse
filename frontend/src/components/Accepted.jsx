import { formatDate } from '../utils/dateUtils'
import emptyFolder from '../assets/empty-folder.png'

const Accepted = ({ acceptedDetails, setPreviewId, setCvType }) => {
  return (
    <div className="flex flex-col gap-4 rounded-medium p-10 bg-white-bright">
      {acceptedDetails.length > 0 && (
        <div className="flex items-center justify-between px-5">
          <span className='text-gray-500 w-1/5'>Họ và tên</span>
          <span className='text-gray-500 w-1/6'>Email</span>
          <span className='text-gray-500 w-1/6'>Tên trường</span>
          <span className='text-gray-500 w-[15%]'>Ngày ứng tuyển</span>
          <span className='text-gray-500 w-1/6'>Trạng thái</span>
          <span className='text-gray-500 w-[10%]'>CV ứng tuyển</span>
        </div>
      )}
      {acceptedDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[400px]">
          <img className='w-1/5' src={emptyFolder} alt="emptyFolder" />
          <p className="text-gray-500 font-semibold">Chưa có ai vào dự án.</p>
        </div>
      ) : (
        acceptedDetails.map((s, index) => (
          <div key={index} className="flex items-center justify-between p-5 border border-white-mid rounded-small hover:shadow">
            <div className="flex items-center gap-4 w-1/5">
              <img
                src={`data:image/png;base64,${s.student.account?.avatar?.data}`}
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
            <span className="text-sm text-gray-500 w-1/6">{s.student.university}</span>
            <span className="text-sm text-gray-500 w-[15%]">{formatDate(s.appliedAt)}</span>
            <span className="text-sm text-green-500 font-semibold w-1/6">
              <div className="inline-flex items-center gap-2 border border-green-500 px-2 py-1 rounded-full bg-green-50">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Đã duyệt
              </div>
            </span>
            <span className="text-sm text-blue w-[10%] font-semibold underline cursor-pointer"

              onClick={() => {
                setPreviewId(s.cv)
                setCvType(s.cvType)
              }}
            >Xem CV</span>
          </div>
        ))
      )}
    </div>
  )
}

export default Accepted