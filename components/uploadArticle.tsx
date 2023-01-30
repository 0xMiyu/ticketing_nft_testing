import {
    AnchorWallet,
    useAnchorWallet,
    useConnection,
    useWallet,
    WalletNotSelectedError,
} from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import {
    BN,
    Idl,
    Program,
    AnchorProvider,
    toInstruction,
} from "@project-serum/anchor";
import { Journalist } from "../data/journalist";
import * as idl from "../data/journalist.json";
import { NodeWallet } from "@metaplex/js";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

export const UploadArticle: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet } = useWallet();
    const PROGRAM_ID = "CV1DphaGKtzK1mMskXjDhSGQAnaXEqtq2dqFYSnXMrJm";

    const onClick = useCallback(async () => {
        
        if (!publicKey) {
            console.log("error", "Wallet not connected!");
            alert("Wallet not Connected!");
            return;
        }
        const provider = new AnchorProvider(
            connection,
            wallet as any,
            AnchorProvider.defaultOptions()
        );
        const journalistProgram = new anchor.Program<Journalist>(
            idl as any,
            PROGRAM_ID,
            provider
        );
        try {
            let authorAccount: PublicKey;
            let author = "LFGGGGG";
            let mint_address = "GoMp6aZ3U7KxsxVCo3FmZ8gkEaxPhcE9aL82Z695zrss";
            let timestamp = new BN(Date.now());
            [authorAccount] = PublicKey.findProgramAddressSync(
                [publicKey.toBytes(), timestamp.toArrayLike(Buffer, "be", 8)],
                new PublicKey(PROGRAM_ID)
            );
            const transaction = new Transaction();
            const ix = await journalistProgram.methods
                .upload(author, mint_address, timestamp).accounts({initializer: publicKey, pdaAccount: authorAccount, systemProgram: SystemProgram.programId})
                .instruction();
            transaction.add(ix);
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction({
                blockhash: (
                    await connection.getLatestBlockhash("max")
                ).blockhash,
                lastValidBlockHeight: (
                    await connection.getLatestBlockhash("max")
                ).lastValidBlockHeight,
                signature: signature,
            });
            alert("Transaction Confirmed!");

            console.log("werk?");
        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, []);
    return (
        <div>
            <button onClick={onClick}>Upload Test!!</button>
        </div>
    );
};
