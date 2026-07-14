import { SafeImage } from "@/components/ui/safe-image"

interface ComparisonItem {
  field: string
  status: string
}

interface VerificationComparisonProps {
  agentTitle: string
  agentSubtitle: string
  authorityTitle: string
  authoritySubtitle: string
  agentImage: string
  authorityImage: string
  agentData: Record<string, string>
  authorityData: Record<string, string>
  comparison: ComparisonItem[]
}

export function VerificationComparison({
  agentTitle,
  agentSubtitle,
  authorityTitle,
  authoritySubtitle,
  agentImage,
  authorityImage,
  agentData,
  authorityData,
  comparison
}: VerificationComparisonProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
          <h3 className="text-base font-semibold p-6 pb-4 border-b dark:border-border">Profile Pictures</h3>
          <div className="p-6 pt-4">
            <SafeImage src={agentImage} alt="Agent" width={128} height={128} className="w-32 h-32 rounded-lg mb-2 mx-auto object-cover" />
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">Provided by Agent</p>
          </div>
        </div>
        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
          <h3 className="text-base font-semibold p-6 pb-4 border-b dark:border-border">Profile Pictures</h3>
          <div className="p-6 pt-4">
            <SafeImage src={authorityImage} alt="ID Authority" width={128} height={128} className="w-32 h-32 rounded-lg mb-2 mx-auto object-cover" />
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">Retrieved from ID Authority</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
          <div className="p-6 pb-4 border-b dark:border-border">
            <h3 className="text-base font-semibold">{agentTitle}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{agentSubtitle}</p>
          </div>
          <table className="w-full">
            <tbody>
              {Object.entries(agentData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{key}</td>
                  <td className="px-6 py-3 text-sm font-medium">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
          <div className="p-6 pb-4 border-b dark:border-border">
            <h3 className="text-base font-semibold">{authorityTitle}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{authoritySubtitle}</p>
          </div>
          <table className="w-full">
            <tbody>
              {Object.entries(authorityData).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{key}</td>
                  <td className="px-6 py-3 text-sm font-medium">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-lg overflow-hidden">
        <h3 className="text-base font-semibold p-6 pb-4 border-b dark:border-border">Comparison Result</h3>
        <div className="p-6 pt-4">
          {comparison.map((item, idx) => (
            <div key={idx} className="flex justify-between py-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.field}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                item.status === "Match" 
                  ? "bg-green-50 text-green-600" 
                  : "bg-red-50 text-red-600"
              }`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
