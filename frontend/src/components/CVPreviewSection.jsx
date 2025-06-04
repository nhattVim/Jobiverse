import React from 'react'
import { formatDate } from '../utils/dateUtils'

export default function CVPreviewSection({ section, data }) {
  // if (!data || data.length === 0) {
  //   return null
  // }

  const hasStartEnd = section.fields.some(f => f.name === 'start') && section.fields.some(f => f.name === 'end')
  const firstField = section.fields[0]?.name || 'Tên'

  return (
    <div className="p-3 mb-4 bg-gray-200 rounded-sm shadow">
      <div className="flex items-center mb-1">
        <h3 className="overflow-hidden font-bold uppercase truncate whitespace-nowrap">{section.title}</h3>
        <span className="flex-grow ml-2 border-t border-gray-400"></span>
      </div>

      {data.map((item, i) => (
        <div key={i} className="mb-2">
          {hasStartEnd ? (
            <>
              <div className="flex justify-between py-2 text-sm italic text-gray-600">
                <span className="w-1/2 overflow-hidden truncate">{item[firstField] || section.fields[0]?.placeholder}</span>
                <span className="flex gap-3">
                  <span>{item.start ? formatDate(item.start) : 'Bắt đầu'}</span>
                  <span>-</span>
                  <span>{item.end ? formatDate(item.end) : 'Kết thúc'}</span>
                </span>
              </div>

              {section.fields
                .filter(f => !['start', 'end', firstField].includes(f.name))
                .map((f, j) => (
                  <p key={j} className="w-full py-2 text-sm italic text-gray-600 break-words">
                    {item[f.name] || f.placeholder}
                  </p>
                ))}
            </>
          ) : (
            section.fields.map((f, j) => (
              <p key={j} className="py-2 text-sm italic text-gray-600">{item[f.name] || f.placeholder}</p>
            ))
          )}

          {data.length > 1 && i < data.length - 1 && <hr className="my-2 border-t border-dashed" />}
        </div>
      ))}
    </div>
  )
}
