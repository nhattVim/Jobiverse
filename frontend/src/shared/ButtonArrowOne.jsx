import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Link } from 'react-router-dom'

const ButtonArrowOne = ({ children, selectedPage, onClick, target, ref }) => {
  return (
    <Link to={selectedPage} onClick={onClick} target={target} ref={ref} className="group/b flex items-center justify-center bg-blue text-white rounded-full py-2 pl-3 pr-2 font-semibold gap-2.5 hover:bg-yellow hover:text-black transition-all duration-500 ease-in-out">
      {children}
      <div className="bg-white group-hover/b:bg-black rounded-full flex items-center justify-center w-[30px] h-[30px] transition-all duration-500 ease-in-out">
        <ArrowUpRightIcon className="w-5 h-5 font-semibold transition-all duration-500 ease-in-out text-blue group-hover/b:text-white" />
      </div>
    </Link>
  )
}

export default ButtonArrowOne
