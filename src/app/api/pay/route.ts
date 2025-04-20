import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Keypair } from '@solana/web3.js';

const merchant_keypair = Keypair.fromSecretKey(Uint8Array.from([50, 8, 53, 167, 104, 35, 113, 205, 220, 107, 239, 2, 118, 168, 124, 48, 114, 180, 92, 111, 74, 248, 233, 106, 132, 132, 78, 214, 87, 72, 15, 15, 11, 70, 190, 20, 178, 231, 89, 58, 157, 213, 226, 47, 117, 25, 71, 254, 231, 254, 164, 130, 28, 87, 22, 114, 115, 54, 16, 248, 27, 31, 79, 109]));

export async function GET(request: Request) {
  const label = 'Exiled Apes Academy';
  const icon = 'https://exiledapes.academy/wp-content/uploads/2021/09/X_share.png';

  return Response.json({
    label,
    icon,
  });
}

export async function POST(request: Request) {
  console.log('POST request received', merchant_keypair.publicKey.toBase58());
  const body = await request.json();
  console.log('body: ', body);

  if (!body?.account) throw new Error('missing account');

  const sender = new PublicKey(body.account);
  const connection = new Connection('https://api.devnet.solana.com');

  const instruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: new PublicKey('m23tCqXQetc3T6xK49bPy27cDR8xoGT3HVmzcz2tNCL'),
    lamports: BigInt(0.1 * LAMPORTS_PER_SOL),
  });

  const transaction = new Transaction().add(instruction);
  const recentBlockhash = await connection.getLatestBlockhash();
  transaction.feePayer = sender;
  transaction.recentBlockhash = recentBlockhash.blockhash;

  const serializedTransaction = transaction.serialize({ requireAllSignatures: false, verifySignatures: false });
  const base64Tx = serializedTransaction.toString('base64');

  return Response.json({
    message: 'Thanks for your purchase!',
    base64Tx,
  });
}
