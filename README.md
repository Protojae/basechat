# BaseChat - Token Gated Community

A Base community website with token-gated live chat, featuring wallet authentication, basename integration, and embedded token tools.

## Features

- 🔐 **Token Gating**: Access requires holding 1M+ $BNKR or 5M+ $DRB tokens
- 💬 **Real-time Chat**: Live messaging with Socket.io
- 🏷️ **Basename Integration**: Display basenames instead of wallet addresses
- 📊 **Token Charts**: Embed DEXScreener charts with `/token [address]` command
- 🔄 **Quick Swap**: Integrated Uniswap widget for Base chain
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Web3**: Wagmi, OnchainKit, ethers.js
- **Backend**: Node.js, Express, Socket.io
- **Chain**: Base (Ethereum L2)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

3. Start the backend server:
```bash
npm run server
```

4. Start the frontend:
```bash
npm run dev
```

## Token Requirements

- **$BNKR**: 1,000,000 tokens minimum
  - Contract: `0x22af33fe49fd1fa80c7149773dde5890d3c76f3b`
- **$DRB**: 5,000,000 tokens minimum  
  - Contract: `0x3ec2156d4c0a9cbdab4a016633b7bcf6a8d68ea2`

## Chat Commands

- `/token [address]` - Display token chart from DEXScreener

## Development

The app runs on:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Deployment

- Frontend: Deploy to Vercel
- Backend: Deploy to Heroku/Railway/AWS
- Update CORS origins for production