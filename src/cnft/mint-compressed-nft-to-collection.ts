import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import {
  findLeafAssetIdPda,
  LeafSchema,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintToCollectionV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum';
import { keypairIdentity, publicKey as UMIPublicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { getKeypairFromFile } from '@solana-developers/helpers';
import { clusterApiUrl } from '@solana/web3.js';

const umi = createUmi(clusterApiUrl('devnet'));

// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile('mydevwallet.json');

// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);

// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const merkleTree = UMIPublicKey('FCkUibVvcqKL3yMnSqP32hBzex4UcmNoEwv4hT4JMuYp');

const collectionMint = UMIPublicKey('52LDuZ79NgsjK1xtXfbr68b2kuStXqy7NaZDewcgXH5b');

const uintSig = await (
  await mintToCollectionV1(umi, {
    leafOwner: umi.identity.publicKey,
    merkleTree,
    collectionMint,
    metadata: {
      name: 'My NFT',
      uri: 'https://chocolate-wet-narwhal-846.mypinata.cloud/ipfs/QmeBRVEmASS3pyK9YZDkRUtAham74JBUZQE3WD4u4Hibv9',
      sellerFeeBasisPoints: 0, // 0%
      collection: { key: collectionMint, verified: false },
      creators: [
        {
          address: umi.identity.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
  }).sendAndConfirm(umi)
).signature;

console.log('Signature:', uintSig);

// const b64Sig = base58.deserialize(uintSig);
// console.log(b64Sig);


const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, uintSig);
console.log('Leaf:', leaf);
const assetId = findLeafAssetIdPda(umi, {
  merkleTree,
  leafIndex: leaf.nonce,
})[0];

console.log('asset Id:', assetId);
