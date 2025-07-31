'use client'

import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { WHITELISTED_TOKENS, ERC20_ABI } from '../lib/constants'

interface TokenGateProps {
  children: React.ReactNode
  onAccessGranted: (token: string) => void
}

export function TokenGate({ children, onAccessGranted }: TokenGateProps) {
  const { address, isConnected } = useAccount()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isConnected && address) {
      checkTokenHoldings()
    }
  }, [isConnected, address])

  const checkTokenHoldings = async () => {
    if (!address) return
    
    setLoading(true)
    setError('')

    try {
      const provider = new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/l2jl2MEHI9vnRGro6T2-G')
      
      for (const token of WHITELISTED_TOKENS) {
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
          const balance = await contract.balanceOf(address)
          
          if (balance >= BigInt(token.minHolding)) {
            setHasAccess(true)
            onAccessGranted(token.symbol)
            setLoading(false)
            return
          }
        } catch (tokenError) {
          console.error(`Error checking ${token.symbol}:`, tokenError)
        }
      }
      

      setError('Insufficient token holdings. You need at least 1M $BNKR, 5M $DRB, or 25K $BYTE tokens.')
    } catch (err) {
      console.error('Token check error:', err)
      setError('Error checking token holdings')
    }
    
    setLoading(false)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to access the community chat</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-base-blue mx-auto"></div>
        <p className="mt-4">Checking token holdings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-red-400 font-semibold mb-2">Access Denied</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={checkTokenHoldings}
            className="mt-4 bg-base-blue hover:bg-blue-600 px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-yellow-400 font-semibold mb-2">Token Required</h3>
          <p className="text-sm">You need to hold at least 1M $BNKR, 5M $DRB, or 25K $BYTE tokens to access the chat.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}