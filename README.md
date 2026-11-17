# Helius Wallet Snapshot

A tiny Node script that prints a quick snapshot of any Solana wallet using two Helius APIs:

- `getTransactionsForAddress` for recent transaction activity
- `getAssetsByOwner` (DAS API) for SOL balance, tokens and NFTs

No dependencies. Under 100 lines.

## Run it

1. Get a free API key at [dashboard.helius.dev](https://dashboard.helius.dev)
2. Run:

```bash
HELIUS_API_KEY=your_key node demo.mjs <wallet_address>
```

Requires Node 18 or newer.

Or keep the key in a private `.env` file (copy `.env.example` to `.env` and add your key), then run:

```bash
node --env-file=.env demo.mjs <wallet_address>
```

This needs Node 20.6 or newer. The `.env` file is git-ignored, so your key never gets committed. Never put your key in `demo.mjs`.

## Example output

```
Snapshot for <wallet>

Activity (last 50 transactions)
  succeeded: 48  failed: 2
  4xKp9Qm2aB7c...  ok      3h ago

Holdings
  SOL balance: 1.2034
  fungible tokens: 6  NFTs and other assets: 12
```

(Replace this with your real output before publishing.)

## Why these two methods

Helius lists `getTransactionsForAddress` as the modern path for transaction history, with filtering and pagination built in. `getAssetsByOwner` returns tokens and NFTs in a single call, so you don't need to walk token accounts yourself.

## Ideas to extend

- Add `filters.status: "succeeded"` to hide failed transactions
- Paginate with the returned pagination token for full history
- Swap in `transactionDetails: "full"` to inspect instructions
- Stream the same wallet live with LaserStream

## Author

Shobit Garg - [X](https://x.com/shobit0019) | [GitHub](https://github.com/shobit000)
