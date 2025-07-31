'use client'

import { useState } from 'react'
import { ConnectWallet } from '../components/ConnectWallet'
import { TokenGate } from '../components/TokenGate'
import { Chat } from '../components/Chat'
import { SwapModal } from '../components/SwapWidget'

export default function Home() {
  const [accessToken, setAccessToken] = useState<string>('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-dark to-gray-900">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">BaseChat</h1>
              <span className="text-sm text-gray-400">Token Gated Community</span>
            </div>
            <div className="flex items-center space-x-4">
              <SwapModal />
              <ConnectWallet />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-base-blue to-purple-500 bg-clip-text text-transparent">
            Welcome to BaseChat
          </h2>
          <p className="text-gray-400 text-lg">
            Exclusive community chat for $BNKR and $DRB token holders
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <TokenGate onAccessGranted={setAccessToken}>
            <Chat />
          </TokenGate>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Base • Token gated with on-chain verification</p>
        </div>
      </main>
    </div>
  )
}