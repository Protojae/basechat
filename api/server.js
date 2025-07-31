const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { ethers } = require('ethers')

const app = express()
const server = createServer(app)

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://basechat.vercel.app', /\.vercel\.app$/]
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

const io = new Server(server, {
  cors: corsOptions,
  path: '/socket.io/'
})

// In-memory storage for messages
let messages = []

// Whitelist configuration
const WHITELISTED_TOKENS = [
  {
    address: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b',
    symbol: 'BNKR',
    minHolding: '1000000000000000000000000'
  },
  {
    address: '0x3ec2156d4c0a9cbdab4a016633b7bcf6a8d68ea2',
    symbol: 'DRB',
    minHolding: '5000000000000000000000000'
  },
  {
    address: '0x2d90785e30a9df6cce329c0171cb8ba0f4a5c17b',
    symbol: 'BYTE',
    minHolding: '25000000000000000000000'
  }
]

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]

// Verify token holdings
async function verifyTokenHoldings(address) {
  try {
    const provider = new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/l2jl2MEHI9vnRGro6T2-G')
    
    for (const token of WHITELISTED_TOKENS) {
      const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
      const balance = await contract.balanceOf(address)
      
      if (balance >= BigInt(token.minHolding)) {
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Error verifying token holdings:', error)
    return false
  }
}

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  const address = socket.handshake.auth.address
  
  if (!address) {
    return next(new Error('No address provided'))
  }

  const hasAccess = await verifyTokenHoldings(address)
  if (!hasAccess) {
    return next(new Error('Insufficient token holdings'))
  }

  socket.userAddress = address
  next()
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userAddress}`)

  socket.emit('previousMessages', messages.slice(-50))

  socket.on('message', (messageData) => {
    const message = {
      id: Date.now().toString(),
      address: socket.userAddress,
      content: messageData.content,
      timestamp: Date.now()
    }

    messages.push(message)
    
    if (messages.length > 100) {
      messages = messages.slice(-100)
    }

    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userAddress}`)
  })
})

// API endpoints
app.get('/api/whitelist', (req, res) => {
  res.json(WHITELISTED_TOKENS)
})

app.post('/api/verify-access', async (req, res) => {
  const { address } = req.body
  
  if (!address) {
    return res.status(400).json({ error: 'Address required' })
  }

  try {
    const hasAccess = await verifyTokenHoldings(address)
    res.json({ hasAccess })
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' })
  }
})

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app
} else {
  const PORT = process.env.PORT || 3001
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}