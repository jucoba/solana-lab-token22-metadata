import { clusterApiUrl, Connection } from '@solana/web3.js';
import { initializeKeypair } from '@solana-developers/helpers';
import { uploadOffChainMetadata } from "./helpers";
import createNFTWithEmbeddedMetadata from "./nft-with-embedded-metadata";
import dotenv from "dotenv";
dotenv.config();

const connection = new Connection(clusterApiUrl('devnet'), 'finalized');
//pubkey: 47jJLDWDuTorFjq7KabD35yYVavmHTj36CMBABYjsKCo
const payer = await initializeKeypair(connection, {keypairPath: './mydevwallet.json'});


const imagePath = "src/cat.png";
const metadataPath = "src/temp.json";
const tokenName = "Cow NFT";
const tokenDescription = "This is a cow";
const tokenSymbol = "COOT";
const tokenExternalUrl = "https://mootrack.com/";
const tokenAdditionalMetadata = {
  species: "Cow",
  breed: "Cool",
};

const tokenUri = await uploadOffChainMetadata(
    {
      tokenName,
      tokenDescription,
      tokenSymbol,
      imagePath,
      metadataPath,
      tokenExternalUrl,
      tokenAdditionalMetadata,
    },
    payer,
  );
   
  console.log("Token URI:", tokenUri);

  await createNFTWithEmbeddedMetadata({
    payer,
    connection,
    tokenName,
    tokenSymbol,
    tokenUri,
  });