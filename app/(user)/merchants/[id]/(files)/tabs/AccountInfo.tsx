import { Badge } from '@/components/ui/badge';
import { Copiable } from '@/components/ui/copiable';
import React from 'react'

const AccountInfo = () => {
  const userDetails = [
    { label: "Merchant Name", value: "Olivia Rhye" },
    { label: "Email Address", value: "oliviarhye@example.com" },
    {
      label: "Merchant ID",
      value: <Copiable value={"283982883982"} truncate={false} />
    },
    { label: "Contact Details", value: "08098765432" },
    { label: "Location", value: "13 Peterson Street, Victoria Island, Eti-Osa, Lagos Nigeria" },
    {
      label: "Status",
      value: <Badge variant='success'>Active</Badge>
    },
    { label: "Registration Date", value: "Mar 6 2025, 01:30 PM" },
  ];


  return (
    <div>

      <p className="mb-8 font-semibold lg:text-lg">Merchant Information</p>

      <div className="space-y-7 lg:w-[50%]">
        {userDetails.map((detail: any) => {
          const isPill = detail?.type === 'pill';

          return (
            <div key={detail.label} className="flex-btw text-sm">
              <p className="text-gray-500 w-[30%]">{detail.label}</p>

              <p className={`mr-auto
                ${isPill ? 'w-max mr-auto flexed bg-cms-green-10 text-cms-green-20 font-medium text-xs px-3 py-1 rounded-lg' : 'font-medium text-black'}`}>
                {detail.value}
              </p>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default AccountInfo