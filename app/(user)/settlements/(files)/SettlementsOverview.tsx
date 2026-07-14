import { SquarePen } from 'lucide-react'
import React from 'react'

const SettlementsOverview = () => {
  const breakdown = [
    {
      title: "Settlement Schedule",
      className: "w-full lg:w-[49.6%]",
      data: [
        {
          label: "Settlement Type",
          value: "T+1",
        },
        {
          label: "Settlement Time",
          value: "5:00PM Daily",
        },
        {
          label: "Settlement Days",
          value: "Monday - Friday",
        },
      ]
    },
    {
      title: "Settlement Account Details",
      className: "w-full lg:w-[49.6%]",
      data: [
        {
          label: "Account Name",
          value: "Shoprite Supermarket",
        },
        {
          label: "Bank Name",
          value: "Access Bank",
        },
        {
          label: "Account Number",
          value: "1234838383",
        },
        {
          label: "Account Type",
          value: "Current Account"
        },
      ]
    },
    {
      title: "MSC Breakdown",
      className: "w-full",
      data: [
        {
          label: "MSC (POS)",
          value: "0.50%",
        },
        {
          label: "Instant Transfer Fee",
          value: "5,000",
        },
        {
          label: "Monthly Terminal Fee",
          value: "50,000",
        },
      ]
    },
  ]


  return (
    <div>

      <div className="flex items-stretch justify-between flex-wrap">
        {breakdown.map(({ title, className, data }: any, idx: number) => {
          const isMsc = title?.includes("MSC")
          return (
            <div key={title} className={`${className} border border-gray-300 rounded-2xl p-8 mb-8`}>

              <div className="flect space-x-3 border-b pb-3">
                <p className="mb-0 lg:text-lg font-semibold">{title}</p>
                <button className='hidden'>
                  <SquarePen />
                </button>
              </div>

              <div className='py-6 space-y-5'>
                {data.map(({ label, value }: any) => {

                  return (
                    <div
                      key={value}
                      className={`flex items-center justify-start ${isMsc ? "w-[75%]" : "w-full"}`}>
                      <p className="w-1/4 text-gray-500">
                        {label}
                      </p>
                      <p className="w-2/5 text-gray-800 font-semibold">
                        {value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default SettlementsOverview