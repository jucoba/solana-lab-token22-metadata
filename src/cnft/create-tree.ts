import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";
 
const umi = createUmi(clusterApiUrl("devnet"));
 
// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const merkleTreeOwner = await getKeypairFromFile("mydevwallet.json");
 
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(merkleTreeOwner.secretKey);
 
// load the MPL Bubblegum program, dasApi plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplBubblegum()).use(dasApi());

const merkleTree = generateSigner(umi);
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
  treeCreator: merkleTreeOwner.publicKey, //optional defauts to merkleTreeOwner
  public: false //optional defaults to false
});
await builder.sendAndConfirm(umi);
 
let explorerLink = getExplorerLink("address", merkleTree.publicKey, "devnet");
console.log(`Explorer link: ${explorerLink}`);
console.log("Merkle tree address is :", merkleTree.publicKey);
console.log("Merkle tree owner :", merkleTreeOwner.publicKey.toBase58());
console.log("✅ Finished successfully!");

