"use client"

import { useState } from "react"
import { TransactionStats } from "@/components/transactions/stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardTransactionsTable from "./(components)/card/CardTransactionsTable"
import TransferTransactionsTable from "./(components)/bank-transfer/TransferTransactionsTable"


export default function TabbedTransactions() {
  const [stats, setStats] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('card');

  const tabs = [
    { value: 'card', label: 'Card Transactions' },
    { value: 'transfer', label: 'Pay with Transfer' },
  ];

  return (
    <>
      {/* <TransactionStats stats={stats} /> */}

      <Tabs defaultValue={activeTab} className='w-full'>
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

        <div className='pt-2'>

          <TabsContent value='card'>
            <CardTransactionsTable />
          </TabsContent>

          <TabsContent value='transfer'>
            <TransferTransactionsTable />
          </TabsContent>

        </div>
      </Tabs>
    </>
  )
}
