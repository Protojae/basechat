import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet, metaMask } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: 'BaseChat',
      }),
      metaMask(),
    ],
    transports: {
      [base.id]: http(),
    },
  })
}