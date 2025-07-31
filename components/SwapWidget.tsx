'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'

export function SwapModal() {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)

  if (!address) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Quick Swap
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Quick Swap</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-300 mb-4">Swap tokens on Base</p>
              <a
                href="https://app.uniswap.org/#/swap?chain=base"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                Open Uniswap
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}