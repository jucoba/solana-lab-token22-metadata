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
      ownerAddress: '47jJLDWDuTorFjq7KabD35yYVavmHTj36CMBABYjsKCo',
      options: {
        showFungible: false,
      },
    },
  }),
});
const data = await response.json();
console.log(data.result.items);

