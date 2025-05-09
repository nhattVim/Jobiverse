export default function CVSectionForm({ sectionKey, fields, items, onAdd, onRemove, onChange }) {
  return (
    <div>
      <label className="block font-medium capitalize">{sectionKey}</label>
      {items.map((item, idx) => (
        <div key={idx} className="relative p-2 m-2 border rounded">

          <button
            type="button"
            className="absolute text-sm font-bold text-red-500 -right-4 top-1 hover:text-red-700"
            onClick={() => onRemove(idx)}
          >x</button>

          {fields.map((f) => (
            f.textarea ? (
              <textarea
                key={f.name}
                name={f.name}
                placeholder={f.placeholder}
                className="w-full p-1 mb-1 border rounded"
                value={item[f.name]}
                onChange={(e) => onChange(e, idx)}
              />
            ) : (
              <input
                key={f.name}
                type="text"
                name={f.name}
                placeholder={f.placeholder}
                className="w-full p-1 mb-1 border rounded"
                value={item[f.name]}
                onChange={(e) => onChange(e, idx)}
              />
            )
          ))}
        </div>
      ))}
      <button type="button" className="text-sm text-blue-600 underline" onClick={onAdd}>
        + Thêm {sectionKey}
      </button>
    </div>
  )
}