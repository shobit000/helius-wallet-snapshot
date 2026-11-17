# Helius Wallet Snapshot

A tiny Node script that prints a quick snapshot of any Solana wallet using two Helius APIs:

- `getTransactionsForAddress` for recent transaction activity
- `getAssetsByOwner` (DAS API) for SOL balance, tokens and NFTs

No dependencies. Around 100 lines.

## Run it

1. Get a free API key at [dashboard.helius.dev](https://dashboard.helius.dev)
2. Run on Mac or Linux:

```bash
HELIUS_API_KEY=your_key node demo.mjs <wallet_address>
```

Or on Windows PowerShell:

```powershell
$env:HELIUS_API_KEY="your_key"
node demo.mjs <wallet_address>
```

Requires Node 18 or newer. Never put your key in the code.

## Example output

```
Snapshot for 86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY

Activity (last 50 transactions)
  succeeded: 50  failed: 0
  2C5sjky3dqkZ...  ok      1h ago
  4hQ7pRMTfz5j...  ok      1h ago
  hcvKarG25wsK...  ok      2h ago
  5W1j6VJevwyf...  ok      5h ago
  4QT33Rv5GPcX...  ok      8h ago

Holdings (first 100 assets)
  SOL balance: 1348.2797
  fungible tokens: 40  NFTs and other assets: 60
  - WILLY
  - Toly The Dragon
  - $50 is all you need
  - Claim your 5000WIF
  - In Solana We Trust
```

## Why these two methods

Helius lists `getTransactionsForAddress` as the modern path for transaction history, with filtering and pagination built in. `getAssetsByOwner` returns tokens and NFTs in a single call, so you don't need to walk token accounts yourself.

## Ideas to extend

- Add `filters.status: "succeeded"` to hide failed transactions
- Paginate with the returned pagination token for full history
- Swap in `transactionDetails: "full"` to inspect instructions
- Stream the same wallet live with LaserStream

## Author

Shobit Garg - [GitHub](https://github.com/shobit000)
