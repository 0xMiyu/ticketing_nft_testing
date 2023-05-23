import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    PublicKey,
    Keypair,
    Connection,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import { NFTStorage, Blob, File } from "nft.storage";
import {
    Metaplex,
    walletAdapterIdentity,
    TransactionBuilder,
    InstructionWithSigners,
    keypairIdentity
} from "@metaplex-foundation/js";
import {
    createVerifyCollectionInstruction,
    createSetAndVerifyCollectionInstruction,
    SetAndVerifyCollectionInstructionAccounts,
    VerifyInstructionAccounts,
    VerifyCollectionInstructionAccounts,
    VerifySizedCollectionItemInstructionAccounts,
    createVerifySizedCollectionItemInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";

export const CreateNFT: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet();

    const NFTSTORAGE_API_KEY = process.env.NFTSTORAGE_API_KEY;
    const temp_metadata_uri = "https://bafkreihznh7vviq6hge64gdy5n4bhn3ojqt2mqxy4nll4qxoilymv4qa3a.ipfs.nftstorage.link/"
    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log("error", "Wallet not connected!");
            alert("Wallet not Connected!");
            return;
        }
        const metaplex = Metaplex.make(connection)

        const arr = base58.decode("4KEmdRZu91f7c5rTgSPBFPFQaUrRgTrBxDds7rWLeQZJp11shTUQtueMvt9dgLu2w6eAHf2w5SyLJAdb6Ekbeo8p") //miyu
        
        const signer = Keypair.fromSecretKey(arr);
        metaplex.use(keypairIdentity(signer));
        
        try {
            
            const res = await fetch("http://localhost:4242/concert/5", {
                method: "GET",
                headers: {
                    "Accept" : "application/json"
                }
            })
            const concert = await(res.json())
            console.log(concert)

            const collection_nft : any = await metaplex
                .nfts()
                .findByMint({
                    mintAddress: new PublicKey(
                        concert.collectionNFT
                    ),
                });
            
            const nft = await metaplex
                .nfts()
                .create({
                    uri: temp_metadata_uri,
                    name: "Justin Bieber 2023",
                    symbol: "JB23",
                    sellerFeeBasisPoints: 1000,
                    isCollection: true,
                    tokenOwner: publicKey,
                    uses: {useMethod: 2, remaining: 1, total: 1},
                    collection: new PublicKey(
                        concert.collectionNFT
                    ),
                });

            // const nft = await metaplex.nfts().findByMint({mintAddress: new PublicKey("DrQeius4na8MDR6d9mtALgjEbVHb21xVkpjQ7noZuuhV")});
            

            // const ix_accounts: VerifySizedCollectionItemInstructionAccounts = {
            //     metadata: nft.metadataAddress,
            //     collectionAuthority: metaplex.identity().publicKey,
            //     payer: metaplex.identity().publicKey,
            //     collectionMint: collection_nft.address,
            //     collection: collection_nft.metadataAddress,
            //     collectionMasterEditionAccount: collection_nft.edition.address,
            // };
            // const ix = createVerifySizedCollectionItemInstruction(ix_accounts);

            // // const tx = TransactionBuilder.make()
            // //     .setFeePayer(signer)
            // //     .add({
            // //         instruction: ix,
            // //         signers: [signer],
            // //     });

            // const tx = new Transaction()
            // tx.add(ix);
            // let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
            // tx.recentBlockhash = blockhash;
            // tx.feePayer = signer.publicKey;
            // console.log(metaplex.identity().publicKey)

            // const signedtx = await metaplex.identity().signTransaction(tx)
            // console.log("SIGNED===")

            // const kek = signedtx.serialize({requireAllSignatures: false});  
            // const signature = await connection.sendRawTransaction(kek)

            // await connection.confirmTransaction({
            //     blockhash: (
            //         await connection.getLatestBlockhash("max")
            //     ).blockhash,
            //     lastValidBlockHeight: (
            //         await connection.getLatestBlockhash("max")
            //     ).lastValidBlockHeight,
            //     signature: signature,
            // });
            // // await tx.sendAndConfirm(metaplex);
            // alert("Transaction Confirmed!");

            await metaplex.nfts().verifyCollection({
                mintAddress:nft.mintAddress, 
                collectionMintAddress: new PublicKey(concert.collectionNFT),
                collectionAuthority: metaplex.identity(),
                isSizedCollection: false,
                isDelegated: true
            })
            alert("kill me lmao")
        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, [publicKey, connection]);

    return (
        <div style = {{height: "60px"}}>
            <button
                onClick={onClick}
                style = {{height: "60px", background: "slategrey" , borderRadius: "10%"}}
            >
                <span>Create Consumer NFT</span>
            </button>
        </div>
    );
};
