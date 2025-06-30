import emptyFolder from '../assets/empty-folder.png'
import { formatDateTime } from '../utils/dateTimeUtils'

const Accepted = ({ acceptedDetails, setPreviewId, setCvType }) => {
  return (
    <div className="flex flex-col gap-4 p-10 rounded-medium bg-white-bright">
      {acceptedDetails.length > 0 && (
        <div className="flex items-center justify-between px-5">
          <span className='w-1/5 text-gray-500'>Họ và tên</span>
          <span className='w-1/6 text-gray-500'>Email</span>
          <span className='w-1/6 text-gray-500'>Tên trường</span>
          <span className='text-gray-500 w-[15%]'>Ngày ứng tuyển</span>
          <span className='w-1/6 text-gray-500'>Trạng thái</span>
          <span className='text-gray-500 w-[10%]'>CV ứng tuyển</span>
        </div>
      )}
      {acceptedDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[400px]">
          <img className='w-1/5' src={emptyFolder} alt="emptyFolder" />
          <p className="font-semibold text-gray-500">Chưa có ai vào dự án.</p>
        </div>
      ) : (
        acceptedDetails.map((s, index) => (
          <div key={index} className="flex items-center justify-between p-5 border border-white-mid rounded-small hover:shadow">
            <div className="flex items-center w-1/5 gap-4">
              <img
                src={`data:image/png;base64,${s.student.account?.avatar?.data || s.student.account?.avatar}`}
                alt={s.student.name}
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="text-lg font-semibold">
                  {s.student.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {s.student.mssv}
                </p>
              </div>
            </div>

            <span className="w-1/6 text-sm text-gray-500">{s.student.account?.email}</span>
            <span className="w-1/6 text-sm text-gray-500">{s.student.university}</span>
            <span className="text-sm text-gray-500 w-[15%]">{formatDateTime(s.appliedAt)}</span>
            <span className="w-1/6 text-sm font-semibold text-green-500">
              <div className="inline-flex items-center gap-2 px-2 py-1 border border-green-500 rounded-full bg-green-50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
