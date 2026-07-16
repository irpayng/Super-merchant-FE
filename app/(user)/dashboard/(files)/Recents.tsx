'use client'

import { Card } from '@/components/ui/card'
import LinkBtn from '@/components/misc/LinkBtn'
import TerminalStatus from './terminal-status/TerminalStatus'
import TopPerformingMerchants from './top-merchants/TopPerformingMerchants'

export default function Recents() {

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">

      <Card className="p-4 sm:p-6 w-full lg:w-[49.5%]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-base sm:text-lg dark:text-white">
              Terminal Status
            </p>
            <LinkBtn route="/terminals" text="View all terminals" />
          </div>

          <TerminalStatus />
        </div>
      </Card>

      <Card className="p-4 sm:p-6 w-full lg:w-[49.5%]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-base sm:text-lg dark:text-white">
              Top Performing Merchants
            </p>
            {/* <LinkBtn route="/transactions" text="View all" /> */}
          </div>

          <TopPerformingMerchants />
        </div>
      </Card>
    </div>

  )
}
