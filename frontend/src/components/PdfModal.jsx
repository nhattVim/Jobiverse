import { XMarkIcon } from '@heroicons/react/24/solid'
import React, { useState, useEffect, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import SpinnerLoading from '../shared/loading/SpinnerLoading'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PdfModal({ cvId, onClose }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const file = useMemo(() => ({
    url: `${import.meta.env.VITE_API_URL}/cv/uploads/${cvId}`,
    withCredentials: true
  }), [cvId])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div className="relative">
        <div className="fixed w-full max-w-3xl z-50 flex justify-end py-2 px-3 bg-white drop-shadow rounded-tl-small rounded-tr-small">
          <div
            onClick={onClose}
            className="p-1 font-bold rounded-full cursor-pointer text-gray-dark bg-white-mid hover:bg-red-100 hover:text-red"
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>

        <div
          className="relative bg-white w-3xl max-h-[88vh] overflow-y-auto shadow-lg scrollbar-custom mt-[48px] mb-4 p-5"
          onClick={e => e.stopPropagation()}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <SpinnerLoading color='border-blue'/>
            }
            className="flex justify-center select-none"
          >
            <Page pageNumber={pageNumber} width={720} />
          </Document>
          {numPages > 1 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center mt-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-1 text-sm text-white rounded-full shadow-lg select-none bg-black/60 w-fit">
                <button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 disabled:opacity-50"
                >
                  Prev
                </button>
                <p className="text-gray-light">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-between w-full max-w-3xl h-4 border-t bg-white rounded-br-small rounded-bl-small border-white-low">
        </div>
      </div>
    </div>
  )
}
