'use client'

import { useEffect, useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { Identity, Avatar, Name } from '@coinbase/onchainkit/identity'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  address: string
  content: string
  timestamp: number
}

export function Chat() {
  const { address } = useAccount()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3001', {
      auth: { address },
      path: '/socket.io/'
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('previousMessages', (msgs: Message[]) => {
      setMessages(msgs)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [address])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !socket || !address) return

    const message = {
      address,
      content: inputValue.trim(),
      timestamp: Date.now()
    }

    socket.emit('message', message)
    setInputValue('')
  }

  const handleTokenCommand = (content: string) => {
    const tokenMatch = content.match(/^\/token\s+(.+)$/i)
    if (tokenMatch) {
      const tokenAddress = tokenMatch[1]
      return (
        <div className="mt-2">
          <iframe
            src={`https://dexscreener.com/base/${tokenAddress}`}
            width="100%"
            height="300"
            className="rounded-lg"
            title="Token Chart"
          />
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Community Chat</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.address === address ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.address === address 
                ? 'bg-base-blue text-white' 
                : 'bg-gray-800 text-white'
            }`}>
              {message.address !== address && (
                <div className="flex items-center space-x-2 mb-1">
                  <Identity address={message.address as `0x${string}`}>
                    <Avatar className="w-4 h-4" />
                    <Name className="text-xs text-gray-300" />
                  </Identity>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              {handleTokenCommand(message.content)}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message... (try /token [address] for charts)"
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-base-blue"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !isConnected}
            className="bg-base-blue hover:bg-blue-600 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Commands: /token [address] - View token chart
        </p>
      </form>
    </div>
  )
}