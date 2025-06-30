/* eslint-disable no-unused-vars */
import { useEffect, useCallback, useState, useContext } from 'react'
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams
} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import Banner from '../components/Banner'
import { ROUTES } from '../routes/routePaths'
import ApplyPopup from '../components/ApplyPopup'
import { UserContext } from '../contexts/UserContext'
import apiFetch from '../services/api'
import CVPreviewModal from '../components/CVPreviewModal'
import PdfModal from '../components/PdfModal'
import { ToastContainer, toast } from 'react-toastify'
import { ApplicationStatusContext } from '../contexts/ApplicationStatusContext'
import JobInfo from '../components/JobInfo'
import Applicants from '../components/Applicants'
import Accepted from '../components/Accepted'
import Invited from '../components/Invited'
import JobInfoSkeleton from '../shared/loading/JobInfoSkeleton'
import Pagination from '../components/Pagination'

const JobDetail = () => {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const { statusMap, loading } = useContext(ApplicationStatusContext)
  const [searchParams] = useSearchParams()
  const isFavoritedInitial = searchParams.get('isFavorited') === 'true'
  const location = useLocation()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(
    searchParams.get('openApply') === 'true'
  )
  const [searchQuery, setSearchQuery] = useState(!searchParams.get('q') ? '' : searchParams.get('q'))
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitial)
  const [project, setProject] = useState(null)
  const [applicantDetails, setApplicantDetails] = useState([])
  const [acceptedDetails, setAcceptedDetails] = useState([])
  const [invitedDetails, setInvitedDetails] = useState([])
  const [previewId, setPreviewId] = useState(null)
  const [cvType, setCvType] = useState('')
  const [activeTab, setActiveTab] = useState('job')
  const [applicantsPage, setApplicantsPage] = useState(1)
  const [applicantsLimit] = useState(10)
  const [applicantsPagination, setApplicantsPagination] = useState(null)

  const isOwner = project?.account?._id === user?._id

  const fetchFullProjectData = useCallback(async (page = applicantsPage) => {
    try {
      const res = await apiFetch(`/projects/detail/${id}?page=${page}&limit=${applicantsLimit}`, 'GET')
      setProject(res)
      setApplicantsPagination(res.applicantsPagination)

      let pending = res.pendingApplicants
      let accepted = []
      let invited = []

      res.applicants?.forEach((applicant) => {
        if (applicant.status === 'accepted') {
          accepted.push(applicant)
        } else if (applicant.status === 'invited' || applicant.status === 'declinedInvitation') {
          invited.push(applicant)
        }
      })

      setApplicantDetails(pending)
      setAcceptedDetails(accepted)
      setInvitedDetails(invited)
    } catch (error) {
      console.error('Error fetching project data:', error)
    }
  }, [id, applicantsPage, applicantsLimit])

  const handleFavorite = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!')
      return
    }
    const newFavoriteState = !isFavorited
    setIsFavorited(newFavoriteState)

    try {
      if (newFavoriteState) {
        await apiFetch('/favorites', 'POST', { projectId: project._id })
      } else {
        await apiFetch(`/favorites/${project._id}`, 'DELETE')
      }
    } catch (err) {
      console.error('Failed to save favorite state', err)
      setIsFavorited(!newFavoriteState)
    }
  }

  useEffect(() => {
    fetchFullProjectData(applicantsPage)
  }, [isOpen, fetchFullProjectData, applicantsPage])

  useEffect(() => {
    // Chỉ scroll lên đầu trang khi chuyển trang phân trang (không phải lần đầu load)
    if (applicantsPagination && applicantsPagination.totalPages > 1) {
      const timeout = setTimeout(() => {
        window.scrollTo(0, 0)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [applicantsPage, applicantDetails, applicantsPagination])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen)
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  const handleApplyClick = async (studentId, action) => {
    try {
      await apiFetch(`/projects/${id}/respond/${studentId}`, 'POST', {
        action
      })
      await fetchFullProjectData()
      toast.success('Thao tác thành công. Ứng viên đã được xử lý.')
    } catch (error) {
      console.error('Failed to handle apply click:', error)
      toast.error(`Thao tác thất bại: ${error?.message || 'Đã xảy ra lỗi.'}`)
    }
  }

  const closePopup = () => {
    setIsOpen(false)
    const params = new URLSearchParams(location.search)
    params.delete('openApply')
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  if (!project || loading) {
    return (
      <>
        <Banner />
        <JobInfoSkeleton />
      </>
    )
  }

  const applicantStatus = statusMap[project._id]?.status

  // Variants
  const tabContentVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 }
  }

  const tabs = [
    { key: 'job', label: 'Tin tuyển dụng' },
    { key: 'applicants', label: `Ứng viên đã ứng tuyển (${applicantDetails.length > 0 ? applicantsPagination.total : 0})` },
    { key: 'accepted', label: `Ứng viên đã vào dự án (${acceptedDetails.length})` },
    { key: 'invited', label: `Ứng viên được mời (${invitedDetails.length})` }
  ]

  return (
    <>
      {isOpen && (
        <ApplyPopup
          closePopup={closePopup}
          applyTitle={project.title}
          projectId={project._id}
          toast={toast}
        />
      )}

      {previewId &&
        (cvType === 'CVUpload' ? (
          <PdfModal cvId={previewId} onClose={() => setPreviewId(null)} />
        ) : (
          <CVPreviewModal cvId={previewId} onClose={() => setPreviewId(null)} />
        ))}

      <ToastContainer position="top-right" autoClose={2000} />

      <Banner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClick={() => navigate(`${ROUTES.JOB_LIST}?q=${searchQuery}`)}
      />

      <div className="w-full py-20">
        <main className="container-responsive">
          {/* Tabs */}
          {isOwner && (
            <div className="flex items-center justify-center gap-6 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative font-semibold text-[17px] pb-2 outline-none cursor-pointer transition-colors duration-300 ${activeTab === tab.key
                    ? 'text-blue'
                    : 'text-gray-500 hover:text-blue'}`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute left-0 bottom-0 h-[2px] rounded-full w-full bg-blue"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'job' && (
                <motion.div
                  key="job"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <JobInfo
                    project={project}
                    isOwner={isOwner}
                    applicantStatus={applicantStatus}
                    setIsOpen={setIsOpen}
                    isFavorited={isFavorited}
                    handleFavorite={handleFavorite}
                    id={id}
                    toast={toast}
                    fetchFullProjectData={fetchFullProjectData}
                  />
                </motion.div>
              )}
              {activeTab === 'applicants' && isOwner && (
                <motion.div
                  key="applicants"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Applicants
                    applicantDetails={applicantDetails}
                    setPreviewId={setPreviewId}
                    setCvType={setCvType}
                    handleApplyClick={handleApplyClick}
                  />
                  {/* Pagination controls */}
                  {applicantsPagination && applicantDetails.length > 0 && applicantsPagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <Pagination
                        currentPage={applicantsPagination.page}
                        totalPages={applicantsPagination.totalPages}
                        onPageChange={setApplicantsPage}
                      />
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'accepted' && isOwner && (
                <motion.div
                  key="accepted"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Accepted
                    acceptedDetails={acceptedDetails}
                    setPreviewId={setPreviewId}
                    setCvType={setCvType}
                  />
                </motion.div>
              )}
              {activeTab === 'invited' && isOwner && (
                <motion.div
                  key="invited"
                  variants={tabContentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Invited
                    invitedDetails={invitedDetails}
                    setInvitedDetails={setInvitedDetails}
                    setPreviewId={setPreviewId}
                    setCvType={setCvType}
                    id={id}
                    reload={fetchFullProjectData}
                    toast={toast}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  )
}

export default JobDetail
