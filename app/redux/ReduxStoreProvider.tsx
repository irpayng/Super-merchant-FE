'use client'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'


export default function ReduxStoreProvider({ children }: { children: React.ReactNode }) {
   const [isReady, setIsReady] = useState(false)

   useEffect(() => {
      // Fallback: if rehydration hasn't completed in 3s, render anyway
      const timeout = setTimeout(() => setIsReady(true), 3000)
      return () => clearTimeout(timeout)
   }, [])

   return (
      <Provider store={store}>
         <PersistGate
            loading={isReady ? null : <Preloader />}
            persistor={persistor}
            onBeforeLift={() => setIsReady(true)}
         >
            {children}
         </PersistGate>
      </Provider>
   )
}

const Preloader = () => {

   return (
      <div className="min-h-screen flexed flex-col">
         <Image
            alt="Logo"
            width={100}
            height={100}
            className="animate-bounce"
            src="/IrpayLogo.svg"
         />
      </div>
   )
}