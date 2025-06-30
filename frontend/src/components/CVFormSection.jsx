import { formatDate } from '../utils/dateUtils'

export default function CVFormSection({
  sectionKey, fields, items, onAdd, onRemove, onChange,
  focusedField, setFocusedField
}) {
  const renderField = (f, idx, item) => {
    const fieldKey = `${sectionKey}-${idx}-${f.name}`
    const isDate = f.type === 'date'
    const isFocused = focusedField === fieldKey

    const value = item[f.name]
    const inputType = isDate && !isFocused ? 'text' : f.type || 'text'

    const displayValue = isDate && value
      ? (isFocused
        ? new Date(value).toISOString().slice(0, 10)
        : formatDate(value))
      : value || ''

    const commonProps = {
      name: f.name,
      placeholder: f.placeholder,
      className: 'w-full p-1 mb-1 border rounded',
      value: displayValue,
      onChange: (e) => onChange(e, idx)
    }

    return f.textarea ? (
      <textarea key={f.name} {...commonProps} />
    ) : (
      <input
        key={f.name}
        {...commonProps}
        type={inputType}
        onFocus={() => isDate ? setFocusedField(fieldKey) : setFocusedField(null)}
        onBlur={() => setFocusedField(null)}
      />
    )
  }

  return (
    <div>
      <label className="block font-medium capitalize">{sectionKey}</label>

      {items.map((item, idx) => (
        <div key={idx} className="relative p-2 m-2 border rounded">
          <button
            type="button"
            className="absolute text-sm font-bold text-red-500 -right-4 top-1 hover:text-red-700"
            onClick={() => onRemove(idx)}
          >
            x
          </button>

          {fields.map((f) => renderField(f, idx, item))}
        </div>
      ))}

      <button
        type="button"
        className="text-sm text-blue-600 underline"
        onClick={onAdd}
      >
        + Thêm {sectionKey}
      </button>
    </div>
  )
}
