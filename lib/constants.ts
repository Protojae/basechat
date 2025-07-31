export const WHITELISTED_TOKENS = [
  {
    address: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', // $BNKR
    symbol: 'BNKR',
    minHolding: '1000000000000000000000000', // 1M tokens (18 decimals)
  },
  {
    address: '0x3ec2156d4c0a9cbdab4a016633b7bcf6a8d68ea2', // $DRB
    symbol: 'DRB', 
    minHolding: '5000000000000000000000000', // 5M tokens (18 decimals)
  },
  {
    address: '0x2d90785e30a9df6cce329c0171cb8ba0f4a5c17b', // $BYTE
    symbol: 'BYTE',
    minHolding: '25000000000000000000000', // 25K tokens (18 decimals)
  }
]

export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
]