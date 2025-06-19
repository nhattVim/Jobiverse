import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const JobInfoSkeleton = () => {
  return (
    <div className="py-20 container-responsive">
      <div className="grid grid-cols-[1fr_0.5fr] gap-10 min-h-full">
        {/* Left Content */}
        <div className="w-full">
          <div className="flex flex-col gap-8 p-10 rounded-medium bg-white-bright">
            <Skeleton width={300} height={28} style={{ marginBottom: 0, borderRadius: 8 }} />
            <div className="flex justify-start gap-24">
              <Skeleton width={180} height={46} style={{ borderRadius: 20 }} />
              <Skeleton width={180} height={46} style={{ borderRadius: 20 }} />
              <Skeleton width={180} height={46} style={{ borderRadius: 20 }} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Skeleton width={220} height={32} style={{ borderRadius: 30 }} />
              <div className="flex gap-3 ml-auto">
                <Skeleton width={120} height={46} borderRadius={23} />
                <Skeleton circle width={46} height={46} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 p-10 mt-10 rounded-medium bg-white-bright">
            <Skeleton width={200} height={28} style={{ borderRadius: 8 }} />
            <Skeleton count={3} height={20} style={{ marginBottom: 8, borderRadius: 6 }} />
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="w-full overflow-visible">
          <div className="sticky top-[120px] flex flex-col gap-10">
            <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
              <div className="flex items-center gap-4">
                <Skeleton circle width={60} height={60} />
                <div className="flex flex-col gap-2">
                  <Skeleton width={120} height={24} style={{ borderRadius: 6 }} />
                  <Skeleton width={160} height={16} style={{ borderRadius: 6 }} />
                </div>
              </div>
              <Skeleton count={3} height={20} style={{ borderRadius: 6, marginBottom: 8 }} />
              <Skeleton height={46} style={{ borderRadius: 30 }} />
            </div>
            <div className="flex flex-col gap-5 p-10 rounded-medium bg-white-bright">
              <Skeleton width={180} height={24} style={{ borderRadius: 8 }} />
              <Skeleton count={4} height={20} style={{ marginBottom: 8, borderRadius: 6 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobInfoSkeleton
