import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  InboxStackIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import ButtonArrowOne from '../shared/ButtonArrowOne'

const jobItem = {
  jobTitle: 'Backend Developer (C#, .NET)',
  companyInfo: {
    img: 'https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg',
    name: 'CodeLink',
    location: 'TP Hồ Chí Minh'
  },
  jobType: 'Thực tập',
  salary: 'Từ 2 - 4 triệu',
  location: 'TP Hồ Chí Minh',
  skill: ['C#', '.NET', 'SQL Server', 'REST API']
}

const jobItems = Array(4).fill(jobItem)
const EmployerInfo = () => {
  return (
    <>
      <div className="container-responsive">
        <div className="flex justify-between w-full bg-gradient-blue-right py-10 rounded-medium px-25">
          <div className="flex justify-center items-center gap-5">
            <div className="w-40 h-40 bg-white border border-white-low rounded-small flex justify-center items-center">
              <img
                src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0xPTEE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--e622a8382b21b032819f520d792bef976ace053e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--bb0ebae071595ab1791dc0ad640ef70a76504047/TX_RGB_Primary_onWhite.png"
                alt="imgcompany"
                className="object-cover"
              />
            </div>
            <div className="text-white flex flex-col items-start gap-5">
              <h6 className="text-3xl font-semibold">TymeX</h6>
              <div className="flex gap-5">
                <div className="flex items-center">
                  <MapPinIcon className="w-6 h-6 mr-[6px] text-gray" />
                  <p>TP Hồ Chí Minh</p>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="w-6 h-6 mr-[6px] text-gray" />
                  <p>10 việc làm đang tuyển dụng</p>
                </div>
              </div>
              <a
                href="#current-job"
                className="group/b flex items-center justify-center bg-blue text-white rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5 hover:bg-yellow hover:text-black transition-all duration-500 ease-in-out"
              >
                Xem các vị trí đang tuyển
                <div className="bg-white group-hover/b:bg-black rounded-full flex items-center justify-center w-[30px] h-[30px] transition-all duration-500 ease-in-out">
                  <ArrowUpRightIcon className="w-5 h-5 text-blue font-semibold group-hover/b:text-white transition-all duration-500 ease-in-out" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-20">
        <div className="container-responsive">
          <div className="grid grid-cols-[1fr_0.5fr] gap-10">
            <div className="flex flex-col gap-10">
              <div className="bg-white-bright p-10 rounded-medium">
                <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                  Giới thiệu công ty
                </h5>
                <p className="mt-5">
                  TymeX is a part of Tyme Group - one of the world’s
                  fastest-growing digital banking groups. Tyme Group is one of
                  the world’s fastest-growing digital banking groups, building
                  high-tech and high-touch banks in fast-growing, emerging
                  markets. Headquartered in Singapore with a Technology and
                  product Development Hub in Vietnam, Tyme designs, builds, and
                  commercializes digital banks for emerging markets, with
                  particular expertise in serving under-served and under-banked
                  populations. Established in 2016, TymeX has been Tyme Group's
                  Product & Technology Development Hub, bringing together
                  engineering and product people who share a global mission to
                  become serial bank builders, shaping the future of banking
                  through technology. We build products with the principle of
                  finding the right balance between the digital and physical
                  worlds. We have proudly provided the banking platform as a
                  service for: TymeBank, based in South Africa, is one of the
                  world’s fastest-growing digital banks, with over 7 million
                  customers since launching in February 2019. GoTyme Bank, based
                  in the Philippines, is a joint venture between the Gokongwei
                  Group and Tyme Group with the official launch in October 2022
                  and onboarded more than 1 million customers in less than nine
                  months.
                </p>
              </div>

              <div
                id="current-job"
                className="bg-white-bright p-10 rounded-medium flex flex-col gap-5"
              >
                <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                  Tuyển dụng
                </h5>
                {jobItems.map((job, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-medium shadow flex items-center justify-between hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-[#d5f5f6] rounded-xl flex items-center justify-center">
                        <img
                          src="https://cdn-icons-png.freepik.com/256/17359/17359748.png"
                          alt="logo"
                          className="w-10 h-10"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[22px]">
                          {job.jobTitle}
                        </h3>
                        <p className="text-black-low mt-2.5">{job.jobType}</p>
                        <div className="flex items-center text-black-low space-x-2 mt-2.5">
                          <span className="flex gap-2 items-center">
                            <InboxStackIcon className="text-blue w-6 h-6" />{' '}
                            Đang mở
                          </span>
                          <span>|</span>
                          <span className="flex gap-2 items-center">
                            <MapPinIcon className="text-blue w-6 h-6" />{' '}
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between h-full text-right gap-5">
                      <p className="text-sm text-black-low">{job.salary}</p>
                      <div className="flex items-center space-x-3 justify-end">
                        <ButtonArrowOne>Ứng tuyển</ButtonArrowOne>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-visible">
              <div className="sticky top-[120px]">
                <div className="bg-white-bright p-10 rounded-medium">
                  <h5 className="text-[22px] font-semibold pb-5 border-b border-gray-light">
                    Thông tin liên hệ
                  </h5>
                  <div className="flex flex-col gap-5 mt-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-[6px] text-blue" />
                        <p className="font-semibold">Địa chỉ công ty</p>
                      </div>
                      <p className="text-sm">
                        Số 6 Quang Trung, phường Trần Hưng Đạo, Quận Hoàn Kiếm,
                        Thành phố Hà Nội
                      </p>
                    </div>
                    <div className="flex items-center">
                      <TagIcon className="w-5 h-5 mr-[6px] text-blue" />
                      <span className="font-semibold mr-[6px]">Lĩnh vực: </span>
                      <p className="text-sm">Phần mềm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EmployerInfo
