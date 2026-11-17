// Helius wallet snapshot
// One script, two Helius features:
//   1. getTransactionsForAddress (Helius-exclusive RPC method) for recent activity
//   2. getAssetsByOwner (DAS API) for tokens, NFTs and native SOL balance
//
// Usage: HELIUS_API_KEY=your_key node demo.mjs <wallet_address>
// Requires Node 18+ (built-in fetch). No dependencies.

const KEY = process.env.HELIUS_API_KEY;
const address = process.argv[2];

if (!KEY || !address) {
  console.error("Usage: HELIUS_API_KEY=your_key node demo.mjs <wallet_address>");
  process.exit(1);
}

const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${KEY}`;

async function rpc(method, params) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${method} returned HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  if (json.error) throw new Error(`${method} failed: ${json.error.message}`);
  return json.result;
}

function ago(unixSeconds) {
  if (!unixSeconds) return "unknown time";
  const mins = Math.floor((Date.now() / 1000 - unixSeconds) / 60);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 60 * 24) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / (60 * 24))}d ago`;
}

async function recentActivity() {
  const result = await rpc("getTransactionsForAddress", [
    address,
    {
      transactionDetails: "signatures",
      sortOrder: "desc",
      limit: 50,
    },
  ]);

  const txs = result.data ?? [];
  const failed = txs.filter((t) => t.err).length;

  console.log(`\nActivity (last ${txs.length} transactions)`);
  console.log(`  succeeded: ${txs.length - failed}  failed: ${failed}`);
  for (const t of txs.slice(0, 5)) {
    const status = t.err ? "failed" : "ok";
    console.log(`  ${t.signature.slice(0, 12)}...  ${status.padEnd(6)}  ${ago(t.blockTime)}`);
  }
}

async function holdings() {
  const result = await rpc("getAssetsByOwner", {
    ownerAddress: address,
    page: 1,
    limit: 100,
    displayOptions: { showFungible: true, showNativeBalance: true },
  });

  const items = result.items ?? [];
  const fungible = items.filter((i) => i.interface === "FungibleToken");
  const nfts = items.length - fungible.length;
  const sol = (result.nativeBalance?.lamports ?? 0) / 1e9;

  console.log(`\nHoldings`);
  console.log(`  SOL balance: ${sol.toFixed(4)}`);
  console.log(`  fungible tokens: ${fungible.length}  NFTs and other assets: ${nfts}`);
  for (const i of items.slice(0, 5)) {
    const name = i.content?.metadata?.name || i.token_info?.symbol || i.id;
    console.log(`  - ${name}`);
  }
}

console.log(`Snapshot for ${address}`);
try {
  await recentActivity();
  await holdings();
} catch (err) {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
}
