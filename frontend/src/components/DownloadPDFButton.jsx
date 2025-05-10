import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function DownloadPDFButton({ targetId, fileName = 'cv.pdf' }) {
  const handleDownload = () => {
    const element = document.getElementById(targetId)
    if (!element) return

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pageWidth = pdf.internal.pageSize.getWidth()
      const imgProps = pdf.getImageProperties(imgData)
      const pdfHeight = pageWidth * (imgProps.height / imgProps.width)

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight)
      pdf.save(fileName)
    })
  }

  return (
    <button onClick={handleDownload} className="px-4 py-2 text-white bg-blue-600 rounded">
      Tải xuống PDF
    </button>
  )
}
