const SpinnerLoading = ({ width = 6, height = 6, color = 'border-white', className = '' }) => {
  return (
    <div
      className={`w-${width} h-${height} border-4 ${color} border-t-transparent rounded-full animate-spin ${className}`}
    />
  )
}

export default SpinnerLoading
