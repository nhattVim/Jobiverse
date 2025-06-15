import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const JobListSkeleton = ({ jobList }) => {
  return (
    Array(jobList)
      .fill(0)
      .map((_, i) => (
        <SkeletonTheme baseColor='#d4d6e8' highlightColor='#e5e6f2'>
          <div key={i} className="flex flex-col items-start gap-[30px] p-10 bg-white-mid rounded-medium w-full">
            <div className="flex flex-col items-start gap-5 w-full pb-[15px] border-b border-b-gray-light">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center w-full gap-5">
                  <div className="w-[60px] h-[60px] bg-white-bright border border-white-low rounded-small flex justify-center items-center shrink-0">
                    <Skeleton circle width={40} height={40} style={{ marginBottom: 3 }} />
                  </div>
                  <div className="flex flex-col justify-center w-full gap-1">
                    <Skeleton width={180} height={28} />
                    <Skeleton width={120} height={20} />
                  </div>
                </div>
                <Skeleton width={60} height={28} borderRadius={5} />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <Skeleton width={80} height={20} />
                </div>
                <div className="flex items-center">
                  <Skeleton width={120} height={20} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-wrap w-3/4 gap-2">
                <Skeleton width={80} height={32} borderRadius={16} style={{ marginRight: 8 }} />
                <Skeleton width={80} height={32} borderRadius={16} />
              </div>
              <Skeleton width={120} height={46} borderRadius={23} />
            </div>
          </div>
        </SkeletonTheme>
      ))
  )
}

export default JobListSkeleton