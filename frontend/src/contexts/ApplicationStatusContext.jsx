import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import apiFetch from '../services/api'
import { UserContext } from './UserContext'

const ApplicationStatusContext = createContext({})

export const ApplicationStatusProvider = ({ children }) => {
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useContext(UserContext)

  useEffect(() => {
    const fetchStatusForStudent = async () => {
      if (!user || user.role !== 'student') return

      setLoading(true)

      try {
        // Lấy thông tin sinh viên
        const student = await apiFetch('/students/me', 'GET')
        if (!student || !student._id) return

        // Lấy danh sách các dự án đã apply
        const projects = await apiFetch('/projects/applied', 'GET')
        const map = {}

        for (const project of projects) {
          const applicant = project.applicants?.find(
            app => app?.student === student._id
          )
          if (applicant) {
            map[project._id] = {
              status: applicant.status,
              ...applicant
            }
          }
        }

        setStatusMap(map)
      } catch (err) {
        console.error('Failed to fetch application status:', err)
        setStatusMap({})
      } finally {
        setLoading(false)
      }
    }

    fetchStatusForStudent()
  }, [user])

  // Cập nhật trạng thái apply của 1 project
  const updateStatus = (projectId, statusObj) => {
    setStatusMap(prev => ({
      ...prev,
      [projectId]: statusObj
    }))
  }

  // Cho phép gọi lại từ component khác nếu muốn refetch
  const fetchAppliedStatus = useCallback(async () => {
    if (!user || user.role !== 'student') return

    try {
      const student = await apiFetch('/students/me', 'GET')
      const projects = await apiFetch('/projects/applied', 'GET')
      const map = {}

      for (const project of projects) {
        const applicant = project.applicants?.find(
          app => app?.student === student._id
        )
        if (applicant) {
          map[project._id] = {
            status: applicant.status,
            ...applicant
          }
        }
      }

      setStatusMap(map)
    } catch (err) {
      console.error('Failed to refetch application status:', err)
      setStatusMap({})
    }
  }, [user])

  return (
    <ApplicationStatusContext.Provider
      value={{ statusMap, updateStatus, fetchAppliedStatus, loading }}
    >
      {children}
    </ApplicationStatusContext.Provider>
  )
}

export { ApplicationStatusContext }
