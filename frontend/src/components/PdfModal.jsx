import React, { useState, useEffect, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PdfModal({ onClose, pdfUrl }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const file = useMemo(() => ({
    url: pdfUrl,
    withCredentials: true
  }), [pdfUrl])

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
      <div
        className="bg-white max-w-4xl w-full max-h-[98vh] overflow-y-auto rounded-lg shadow-lg relative"
        onClick={e => e.stopPropagation()}
      >

        <div className="sticky top-0 z-50 flex justify-end py-1 bg-white border-b">
          <button onClick={onClose} className="mr-4 text-black hover:text-red"> &times;</button>
        </div>

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p>Loading PDF...</p>}
          className="flex justify-center select-none"
        >
          <Page pageNumber={pageNumber} width={800} />
        </Document>

        {numPages > 1 && (
          <div className="sticky bottom-0 flex justify-center mt-4 mb-4 ">
            <div className="flex items-center gap-2 px-4 py-1 text-sm text-white rounded-full shadow-lg select-none bg-black/80 w-fit">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="px-4 py-2 disabled:opacity-50"
              >
                Prev
              </button>
              <p className="text-gray">
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
    </div>
  )
}
