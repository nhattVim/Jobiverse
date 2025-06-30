import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const JobCardSkeleton = ({ jobCards }) => {
  return (
    Array(jobCards)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className={
            'inline-block w-[33%] h-full whitespace-normal align-top transition-transform duration-500 ease-in-out'
          }
        >
          <div className="mr-[50px]">
            <div className="group flex flex-col items-start gap-[30px] p-10 bg-white rounded-medium w-full cursor-pointer">
              <div className="flex flex-col items-start w-full gap-5">
                <div className="flex items-start justify-between w-full">
                  <div className="w-[70px] h-[70px] bg-white border border-white-low rounded-small flex justify-center items-center">
                    <Skeleton circle width={40} height={40} />
                  </div>
                  <Skeleton width={60} height={28} borderRadius={5} />
                </div>
                <Skeleton width={200} height={28} />
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center">
                    <Skeleton width={100} height={20} />
                  </div>
                  <div className="flex items-center">
                    <Skeleton width={160} height={20} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <Skeleton width={120} height={46} borderRadius={23} />
                <Skeleton circle width={46} height={46} />
              </div>
            </div>
          </div>
        </div>
      ))
  )
}

export default JobCardSkeleton