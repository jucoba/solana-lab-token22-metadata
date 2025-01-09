import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import {
  findLeafAssetIdPda,
  LeafSchema,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintToCollectionV1Transaction,
  mintV1,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
  base58, // Add this import
  none
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";
 
const umi = createUmi(clusterApiUrl("devnet"));
const umitokenOwner = createUmi(clusterApiUrl("devnet"));
 
// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile("mydevwallet.json");

//token owner pk: CpGXWwfVCH382GEgf8gYsgZcQBC4rLRirNpRGNsX76Vn
const tokenOwner = await getKeypairFromFile("tokenOwner.json");
const umitokenOwner_keypair = umitokenOwner.eddsa.createKeypairFromSecretKey(tokenOwner.secretKey);
umitokenOwner.use(keypairIdentity(umitokenOwner_keypair)).use(mplBubblegum()).use(dasApi());
 
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
 
// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const merkleTree = UMIPublicKey("FCkUibVvcqKL3yMnSqP32hBzex4UcmNoEwv4hT4JMuYp");

console.log("Merkle Tree PublicKey:", merkleTree);
console.log("UMI Identity PublicKey:", umi.identity.publicKey);

const uintSig = await mintV1(umi, {
    leafOwner: umitokenOwner.identity.publicKey,
    merkleTree,
    metadata: {
      name: "My Compressed NFT 3",
      uri: "https://example.com/my-cnft3.json",
      sellerFeeBasisPoints: 1,
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: false, share: 100 },
      ],
    },
  }).sendAndConfirm(umi);

console.log("Signature (uint8 array):", uintSig);

// const b64Sig = base58.deserialize(uintSig);
// console.log(b64Sig);

// const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(
//     umi,
//     uintSig,
//   );
//   const assetId = findLeafAssetIdPda(umi, {
//     merkleTree,
//     leafIndex: 10,
//   })[0];

//   console.log("Asset ID:", assetId);

