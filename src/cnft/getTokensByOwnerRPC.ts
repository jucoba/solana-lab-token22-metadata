const response = await fetch('https://devnet.helius-rpc.com/?api-key=23ee2927-8e69-403d-b063-b2e6d7aedbd9', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'text',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: '6GSpmTaNDUaYEicRZhd3VfbobsDxxNxJX7pz4dryX78M',
      options: {
        showFungible: false,
      },
    },
  }),
});
const data = await response.json();
console.log(data.result.items);

