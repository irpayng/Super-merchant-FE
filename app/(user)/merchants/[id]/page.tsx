"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Dot, MoreHorizontal, Pen } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountInfo from './(files)/tabs/AccountInfo'
import AgentTerminals from './(files)/tabs/terminals/Terminals'
import TabbedTransactions from './(files)/tabs/transactions/TabbedTransactions'
import SettlementsTab from './(files)/tabs/settlements/SettlementsTab'
import { useSearchParams } from 'next/navigation'


const tabs = [
  { value: 'account', label: 'Merchant Information' },
  { value: 'terminals', label: 'Terminals' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'settlements', label: 'Settlements' },
];

const AgentDetailPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const searchParams = useSearchParams();
  const urlActiveTab = searchParams.get("active_tab");

  useEffect(() => {

    if (urlActiveTab?.length && urlActiveTab?.length > 0) {
      const tabNames = tabs?.map((t: any) => t.value)

      if (tabNames?.includes(urlActiveTab) && urlActiveTab !== activeTab)
        setActiveTab(urlActiveTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlActiveTab])

  return (
    <div className='bg-white p-6'>

      <Link href="/merchants" className="flex items-center space-x-2">
        <ArrowLeft />
        <p className="mb-0 font-medium">
          Merchant Information
        </p>
      </Link>

      <div className="mt-8 border rounded-md p-5 flex-btw">

        <div className="flex items-center space-x-4">
          <div className="size-12 flexed bg-orange-500 text-white text-lg font-semibold rounded-full">
            U
          </div>

          <div>
            <p className="font-semibold text-lg">IRPAY User</p>

            <p className="text-gray-500 flex items-center">
              user@irpay.dev

              <span>
                <Dot />
              </span>

              <span className="flexed bg-cms-green-10 text-cms-green-20 font-medium text-xs px-3 py-1 rounded-lg">
                Active
              </span>
            </p>
          </div>

        </div>

        <div className="flex-btw space-x-4">
          <Button
            variant='secondary'
            className='h-max !py-2.5 hidden'>
            <Pen className='h-4 w-4' />
            Edit Details
          </Button>

          <Button
            variant='secondary'
            className='h-max !py-2.5'>
            <MoreHorizontal className='h-4 w-4' />
            More
          </Button>
        </div>

      </div>

      <div className="mt-8">
        <Tabs defaultValue={activeTab} value={activeTab} className='w-full'>
          <TabsList className='bg-transparent font-medium text-sm flex gap-4'>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-1 py-1 cursor-pointer bg-transparent 
                  ${activeTab === tab.value
                    ? 'text-cms-orange-10 border-b-2 border-b-cms-orange-10 rounded-none'
                    : 'text-cms-gray-10'
                  }`}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className='pt-4'>

            <TabsContent value='account'>
              <AccountInfo />
            </TabsContent>

            <TabsContent value='terminals'>
              <AgentTerminals />
            </TabsContent>

            <TabsContent value='transactions'>
              <TabbedTransactions />
            </TabsContent>

            <TabsContent value='settlements'>
              <SettlementsTab />
            </TabsContent>

          </div>
        </Tabs>
      </div>

    </div>
  )
}

export default AgentDetailPage