import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import fs from 'fs';
import { Keypair } from '@solana/web3.js';

// const splToken = new PublicKey(process.env.USDC_MINT || '');
// const MERCHANT_WALLET = new PublicKey(process.env.MERCHANT_WALLET || '');
const ARRAY_IN_JSON_FILE = JSON.parse(fs.readFileSync('m23tCqXQetc3T6xK49bPy27cDR8xoGT3HVmzcz2tNCL.json', 'utf8'));
const merchant_keypair = Keypair.fromSecretKey(Uint8Array.from(ARRAY_IN_JSON_FILE));

export async function GET(request: Request) {
  console.log('POST request received', merchant_keypair.publicKey.toBase58());
  const label = 'Exiled Apes Academy';
  const icon = 'https://exiledapes.academy/wp-content/uploads/2021/09/X_share.png';

  return Response.json({
    label,
    icon,
  });
}

export async function POST(request: Request) {
  const accountField = (request.body as any)?.account;
  if (!accountField) throw new Error('missing account');

  const sender = new PublicKey(accountField);

  const instruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: merchant_keypair.publicKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  const transaction = new Transaction().add(instruction);

  const serializedTransaction = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
  const base64Tx = serializedTransaction.toString('base64');

  return Response.json({
    message: 'Thanks for your purchase!',
    base64Tx,
  });
}
