import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

// Function to fetch and print a Merkle tree in a human-readable way
async function fetchAndPrintMerkleTree(connection: Connection, merkleTreePublicKey: PublicKey) {
  try {
    // Fetch the account data for the Merkle tree
    const accountInfo = await connection.getAccountInfo(merkleTreePublicKey);
    if (!accountInfo) {
      throw new Error('Merkle tree account not found');
    }

    // Get the Merkle tree data
    const merkleTreeData = accountInfo.data;
    console.log('Merkle Tree Data (Buffer):', merkleTreeData);

    // Print the buffer in a human-readable way
    printMerkleTreeAttributes(merkleTreeData);
  } catch (error) {
    console.error('Error fetching or printing Merkle tree:', error);
  }
}

// Function to print the Merkle tree attributes in a human-readable way
function printMerkleTreeAttributes(buffer: Buffer) {
  const authorityOffset = 0;
  const creationSlotOffset = 32;
  const maxDepthOffset = 40;
  const maxBufferSizeOffset = 44;
  const canopyDepthOffset = 48;
  const currentSequenceNumberOffset = 52;
  const currentRootOffset = 56;
  const currentNumberOfLeavesOffset = 88;

  const authority = new PublicKey(buffer.slice(authorityOffset, authorityOffset + 32)).toBase58();
  const creationSlot = buffer.readBigUInt64LE(creationSlotOffset);
  const maxDepth = buffer.readUInt32LE(maxDepthOffset);
  const maxBufferSize = buffer.readUInt32LE(maxBufferSizeOffset);
  const canopyDepth = buffer.readUInt32LE(canopyDepthOffset);
  const currentSequenceNumber = buffer.readBigUInt64LE(currentSequenceNumberOffset);
  const currentRoot = new PublicKey(buffer.slice(currentRootOffset, currentRootOffset + 32)).toBase58();
  const currentNumberOfLeaves = buffer.readUInt32LE(currentNumberOfLeavesOffset);

  console.log('Concurrent Merkle Tree');
  console.log('Authority:', authority);
  console.log('Creation Slot:', creationSlot.toString());
  console.log('Max Depth:', maxDepth);
  console.log('Max Buffer Size:', maxBufferSize);
  console.log('Canopy Depth:', canopyDepth);
  console.log('Current Sequence Number:', currentSequenceNumber.toString());
  console.log('Current Root:', currentRoot);
  console.log('Current Number of Leaves:', currentNumberOfLeaves);
}

// Example usage
const connection = new Connection('https://api.devnet.solana.com');
const merkleTreePublicKey = new PublicKey('FCkUibVvcqKL3yMnSqP32hBzex4UcmNoEwv4hT4JMuYp');
fetchAndPrintMerkleTree(connection, merkleTreePublicKey);