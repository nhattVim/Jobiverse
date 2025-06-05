import { Link } from 'react-router-dom'
import { FaGears, FaUsers, FaHandsHoldingCircle, FaHandshake } from 'react-icons/fa6'

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with blurred background image */}
      <header className="relative min-h-screen flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backgroundBlendMode: 'overlay'

          }}
        ></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Giới thiệu</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto ">
            Jobiverse là cầu nối giữa nhà tuyển dụng và người tìm việc, giúp quá trình tuyển dụng trở nên dễ dàng, nhanh chóng và hiệu quả hơn bao giờ hết.
          </p>
        </div>
      </header>

      <div className="w-full py-30">
        <div className="container-responsive">
          {/* Section 1: Chúng tôi là ai? */}
          <section className="flex flex-col md:flex-row items-stretch bg-white-low rounded-small overflow-hidden h-[500px] mb-30">
            <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left p-[50px]">
              <h2 className="text-3xl font-bold mb-6">Chúng tôi là ai?</h2>
              <p className="mb-6 text-justify ">
                Jobiverse là một nền tảng công nghệ giúp kết nối người tìm việc với các cơ hội nghề nghiệp phù hợp. Với hệ thống gợi ý công việc thông minh, quản lý hồ sơ cá nhân, và hỗ trợ nhà tuyển dụng đăng tin tuyển dụng nhanh chóng, chúng tôi hướng tới việc tối ưu hóa hành trình nghề nghiệp cho hàng triệu người lao động Việt Nam.
              </p>
              <Link
                to="/contact"
                className="bg-yellow px-6 py-4 rounded-full font-semibold self-center md:self-start hover:bg-yellow-400 transition-all duration-300"
              >
                Liên hệ ngay!
              </Link>
            </div>
            <div className="md:w-1/2 flex items-center">
              <img
                src={'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                alt="Nhóm làm việc cùng nhau"
                className="w-full h-full object-cover rounded-r-2xl max-h-[16rem] md:max-h-full"
                loading="lazy"
              />
            </div>
          </section>
          {/* Section 2: Sứ mệnh, Tầm nhìn, Mục tiêu */}
          <section className="flex flex-col md:flex-row items-stretch bg-white rounded-small overflow-hidden h-full mb-30">
            <div className="md:w-1/2 flex items-center">
              <img
                src={'https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                alt="Sự hợp tác nhóm"
                className="w-full h-[460px] object-cover rounded-2xl max-h-[16rem] md:max-h-full"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2 flex flex-col justify-center ml-10 space-y-10 overflow-y-auto text-sm">
              <div>
                <h3 className="text-xl font-bold text-black flex gap-4 items-center">
                  <div className="w-12 h-12 p-2.5 bg-blue rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold text-white ">
                      01
                    </div>
                  </div>
                  Sứ mệnh
                </h3>
                <p className="text-gray-700 ml-16 text-base">
                  Cung cấp nền tảng tuyển dụng hiệu quả, minh bạch và đáng tin cậy để hỗ trợ các ứng viên lẫn doanh nghiệp phát triển bền vững.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black flex gap-4 items-center">
                  <div className="w-12 h-12 p-2.5 bg-blue rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold text-white ">
                      02
                    </div>
                  </div>
                  Tầm nhìn
                </h3>
                <p className="text-gray-700 ml-16 text-base">
                  Trở thành nền tảng tuyển dụng hàng đầu tại Việt Nam và khu vực Đông Nam Á, tiên phong ứng dụng công nghệ vào quản lý nguồn nhân lực.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black flex gap-4 items-center">
                  <div className="w-12 h-12 p-2.5 bg-blue rounded-[50px] flex flex-col justify-between items-center">
                    <div className="justify-start text-lg font-semibold text-white ">
                      03
                    </div>
                  </div>
                  Mục tiêu chiến lược
                </h3>
                <p className="text-gray-700 ml-16 text-base">
                  Phát triển hệ sinh thái tuyển dụng tích hợp AI để kết nối 1 triệu ứng viên với hơn 10.000 nhà tuyển dụng úy tín tại Việt Nam và Đông Nam Á vào năm 2027.
                </p>
              </div>
            </div>
          </section>
          {/* Section 3: Giá trị cốt lõi */}
          <section className="bg-white-low p-12 md:p-13 rounded-small text-center">
            <h2 className="text-3xl font-bold text-black pb-10">Giá trị cốt lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
              {[
                { icon: <FaGears />, text: 'Luôn cập nhật công nghệ để cải thiện trải nghiệm người dùng.' },
                { icon: <FaUsers />, text: 'Tạo môi trường tuyển dụng công bằng và rõ ràng.' },
                { icon: <FaHandsHoldingCircle />, text: 'Lắng nghe người dùng và không ngừng hoàn thiện dịch vụ.' },
                { icon: <FaHandshake />, text: 'Gắn bó và phát triển cùng người tìm việc và doanh nghiệp.' }
              ].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <span className="text-blue text-5xl md:text-6xl ">{value.icon}</span>
                  <p className="text-black">{value.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutPage