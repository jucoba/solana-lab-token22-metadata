import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { mplBubblegum, findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum';
import { keypairIdentity, publicKey as UMIPublicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { getKeypairFromFile } from '@solana-developers/helpers';

const umi = createUmi('https://devnet.helius-rpc.com/?api-key=23ee2927-8e69-403d-b063-b2e6d7aedbd9');

// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile('mydevwallet.json');

// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
const merkleTree = UMIPublicKey('7e65pLwGJSCv9z9NDTzDQdnMxWh5cMx1Jkdbhq5iNWU2');

// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

// const assetId = findLeafAssetIdPda(umi, {
//   merkleTree,
//   leafIndex: 17,
// })[0];

//console.log('Asset ID:', assetId);
const assetId = '7kqe8Ynxe46KfApV8bRYyKkLoKMjZMwdhhat6iPtVVjh';

const umi_assetId = UMIPublicKey(assetId);

const rpcAsset = await umi.rpc.getAsset(umi_assetId);
console.log(rpcAsset);

const assetObject = {
  interface: rpcAsset.interface,
  id: rpcAsset.id,
  content: {
    schema: rpcAsset.content['$schema'],
    jsonUri: rpcAsset.content.json_uri,
    files: rpcAsset.content.files,
    metadata: {
      attributes: rpcAsset.content.metadata.attributes,
      description: rpcAsset.content.metadata.description,
      name: rpcAsset.content.metadata.name,
      symbol: rpcAsset.content.metadata.symbol,
      tokenStandard: rpcAsset.content.metadata.token_standard,
    },
    links: {
      image: rpcAsset.content.links.image,
    },
  },
  authorities: rpcAsset.authorities.map((authority: any) => ({
    address: authority.address,
    scopes: authority.scopes,
  })),
  compression: {
    eligible: rpcAsset.compression.eligible,
    compressed: rpcAsset.compression.compressed,
    dataHash: rpcAsset.compression.data_hash,
    creatorHash: rpcAsset.compression.creator_hash,
    assetHash: rpcAsset.compression.asset_hash,
    tree: rpcAsset.compression.tree,
    seq: rpcAsset.compression.seq,
    leafId: rpcAsset.compression.leaf_id,
  },
  grouping: rpcAsset.grouping.map((group: any) => ({
    groupKey: group.group_key,
    groupValue: group.group_value,
  })),
  royalty: {
    royaltyModel: rpcAsset.royalty.royalty_model,
    target: rpcAsset.royalty.target,
    percent: rpcAsset.royalty.percent,
    basisPoints: rpcAsset.royalty.basis_points,
    primarySaleHappened: rpcAsset.royalty.primary_sale_happened,
    locked: rpcAsset.royalty.locked,
  },
  creators: rpcAsset.creators.map((creator: any) => ({
    address: creator.address,
    share: creator.share,
    verified: creator.verified,
  })),
  ownership: {
    frozen: rpcAsset.ownership.frozen,
    delegated: rpcAsset.ownership.delegated,
    delegate: rpcAsset.ownership.delegate,
    ownershipModel: rpcAsset.ownership.ownership_model,
    owner: rpcAsset.ownership.owner,
  },
  supply: {
    printMaxSupply: rpcAsset.supply.print_max_supply,
    printCurrentSupply: rpcAsset.supply.print_current_supply,
    editionNonce: rpcAsset.supply.edition_nonce,
  },
  mutable: rpcAsset.mutable,
  burnt: rpcAsset.burnt,
};

// Print the serialized object
console.log('Serialized Asset Object:', JSON.stringify(assetObject, null, 2));

// Access specific fields
console.log('Asset ID:', assetObject.id);
console.log('Asset Name:', assetObject.content.metadata.name);
console.log('Asset Description:', assetObject.content.metadata.description);
console.log('Asset Owner:', assetObject.ownership.owner);
