const SpinnerLoading = ({ width, height, className }) => {
  return (
    <div className={`w-${width} h-${height} border-4 border-white rounded-full border-t-transparent animate-spin ${className}`}></div>
  )
}

export default SpinnerLoading