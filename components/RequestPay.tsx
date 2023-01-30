import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, LAMPORTS_PER_SOL, TransactionSignature, SystemProgram, PublicKey } from '@solana/web3.js';
import { FC, useCallback } from 'react';

export const RequestPay: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction} = useWallet();
    const SOL_PRICE_OF_LIKE = 0.1;

    //REMOVE HARDCODED AUTHORS & SHARES LATER
    const authors = ["7WNRBicA8MmZ5U7gnKZ6FhgVwZrfa915zZ8QS8vYL2sj"
                    ,"FkvNBs5TruvbAuUkrKdBXZW9zJSrRi6ZrV8n5Fjnad7F"
                    ,"5ZQcbNFk17uNfZEK1hVvs2NrMBRXLVGNsjK6iSewDbEH"];
    const shares = [7000, 2000, 1000];

    const onClick = useCallback (async () => {
        if (!publicKey) {
            console.log('error', 'Wallet not connected!');
            alert('Wallet not Connected!');
            return;
        }

        const transaction = new Transaction();
        try {
            
            // const ix1 = SystemProgram.transfer({
            //     fromPubkey: publicKey,
            //     toPubkey: new PublicKey("FkvNBs5TruvbAuUkrKdBXZW9zJSrRi6ZrV8n5Fjnad7F"),
            //     lamports: LAMPORTS_PER_SOL * 0.01
            // });
            // const ix2 = SystemProgram.transfer({
            //     fromPubkey: publicKey,
            //     toPubkey: new PublicKey("7WNRBicA8MmZ5U7gnKZ6FhgVwZrfa915zZ8QS8vYL2sj"),
            //     lamports: LAMPORTS_PER_SOL * 0.02
            // });

            // transaction.add(ix1, ix2);
            for(let i = 0; i < authors.length; i++){
                const ix = SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey(authors[i]),
                        lamports: LAMPORTS_PER_SOL * SOL_PRICE_OF_LIKE * (shares[i]/10000)
                    });
                transaction.add(ix);
            }
            
            const tx = await sendTransaction(transaction, connection);
            await connection.confirmTransaction({
                blockhash: (await connection.getLatestBlockhash("max")).blockhash,
                lastValidBlockHeight: (await connection.getLatestBlockhash("max")).lastValidBlockHeight,
                signature: tx,
            });
            alert("Transaction Confirmed!");

        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, [publicKey, connection])
    
    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
            >
                <span>LESGOOOOOO</span>
            </button>
        </div>
    );
}