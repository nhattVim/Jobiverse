import emptyFolder from '../assets/empty-folder.png'
import { formatDateTime } from '../utils/dateTimeUtils'

const Applicants = ({
  applicantDetails,
  setPreviewId,
  setCvType,
  handleApplyClick
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-medium p-10 bg-white-bright">
      {applicantDetails.length > 0 && (
        <div className="flex items-center justify-between px-5">
          <span className='text-gray-500 w-1/5'>Họ và tên</span>
          <span className='text-gray-500 w-1/6'>Email</span>
          <span className='text-gray-500 w-1/6'>Tên trường</span>
          <span className='text-gray-500 w-[15%]'>Ngày ứng tuyển</span>
          <span className='text-gray-500 w-[10%]'>CV ứng tuyển</span>
          <span className='text-gray-500 w-1/6 pl-[19px]'>Hành động</span>
        </div>
      )}
      {applicantDetails.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[400px]">
          <img className='w-1/5' src={emptyFolder} alt="emptyFolder" />
          <p className="text-gray-500 font-semibold">Chưa có ai ứng tuyển.</p>
        </div>
      ) : (
        applicantDetails.map((s, index) => (
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
            <span className="text-sm text-gray-500 w-1/6">{s.student.university}</span>
            <span className="text-sm text-gray-500 w-[15%]">{formatDateTime(s.appliedAt)}</span>
            <span className="text-sm text-blue w-[10%] font-semibold underline cursor-pointer"

              onClick={() => {
                setPreviewId(s.cv)
                setCvType(s.cvType)
              }}
            >Xem CV</span>

            <div className="flex items-center gap-2 w-1/6 justify-end">
              <button
                onClick={() => handleApplyClick(s.student._id, 'accept')}
                className="text-sm px-4 py-2 text-white bg-green-600 rounded-full cursor-pointer hover:bg-green-700 outline-none"
              >
                  Chấp nhận
              </button>

              <button
                className="text-sm px-4 py-2 text-white bg-red rounded-full cursor-pointer hover:bg-red-700 outline-none"
                onClick={() => handleApplyClick(s.student._id, 'reject')}
              >
                  Từ chối
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Applicants
