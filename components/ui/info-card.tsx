import { ReactNode } from "react"

type InfoField = {
  label: string
  value: ReactNode
  colSpan?: 1 | 2
}

type InfoCardProps = {
  title: string
  fields: InfoField[]
}

export function InfoCard({ title, fields }: InfoCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div key={index} className={field.colSpan === 2 ? "col-span-2" : ""}>
              <p className="text-sm text-gray-600">{field.label}</p>
              {typeof field.value === "string" ? (
                <p className="font-medium">{field.value}</p>
              ) : (
                field.value
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
