import React, { createContext, useState } from 'react'

const JobContext = createContext()

export const JobProvider = ({ children }) => {
  const [selectedMajors, setSelectedMajors] = useState(new Set())
  const [selectedSpecs, setSelectedSpecs] = useState(new Set())
  const [selectedExps, setSelectedExps] = useState(new Set())
  const [selectedTypes, setSelectedTypes] = useState(new Set())

  const clearAllFilters = () => {
    setSelectedMajors(new Set())
    setSelectedSpecs(new Set())
    setSelectedExps(new Set())
    setSelectedTypes(new Set())
  }

  return (
    <JobContext.Provider
      value={{
        selectedMajors,
        setSelectedMajors,
        selectedSpecs,
        setSelectedSpecs,
        selectedExps,
        setSelectedExps,
        selectedTypes,
        setSelectedTypes,
        clearAllFilters
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export { JobContext }
