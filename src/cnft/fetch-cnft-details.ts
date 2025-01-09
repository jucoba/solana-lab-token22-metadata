import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { mplBubblegum, findLeafAssetIdPda } from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromFile } from "@solana-developers/helpers";
 
const umi = createUmi( 

  "https://devnet.helius-rpc.com/?api-key=23ee2927-8e69-403d-b063-b2e6d7aedbd9",
);
 
// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = await getKeypairFromFile("mydevwallet.json");
 
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
const merkleTree = UMIPublicKey("FCkUibVvcqKL3yMnSqP32hBzex4UcmNoEwv4hT4JMuYp");
 
// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const assetId = findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex: 17, 
  })[0];

  console.log("Asset ID:", assetId);

const umi_assetId = UMIPublicKey(assetId);
 
// @ts-ignore
const rpcAsset = await umi.rpc.getAsset(umi_assetId);
console.log(rpcAsset);