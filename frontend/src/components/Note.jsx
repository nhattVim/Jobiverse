const Note = ({ content, ...props }) => {
  return (
    <div className="flex items-start w-full gap-3 p-4 border border-yellow-300 rounded-lg shadow-sm bg-yellow-50" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 mt-1 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
      <p className="text-sm font-medium text-yellow-800">
        {content}
      </p>
    </div>
  )
}

export default Note
