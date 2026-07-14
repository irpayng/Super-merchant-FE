'use client'

import { Card } from '@/components/ui/card'
import LinkBtn from '@/components/misc/LinkBtn'
import TerminalStatus from './terminal-status/TerminalStatus'
import RecentTransactions from './recent-transactions/RecentTransactions'

export default function Recents() {

  return (
    <div className="p-0 sm:p-5 flex flex-col lg:flex-row gap-4 lg:gap-[1%]">

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
              Recent Transactions
            </p>
            <LinkBtn route="/transactions" text="View all" />
          </div>

          <RecentTransactions />
        </div>
      </Card>
    </div>

  )
}
