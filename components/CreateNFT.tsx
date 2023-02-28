import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    PublicKey,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import { NFTStorage, Blob, File } from "nft.storage";
import {
    Metaplex,
    walletAdapterIdentity,
    TransactionBuilder,
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

export const CreateNFT: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet();

    const NFTSTORAGE_API_KEY = process.env.NFTSTORAGE_API_KEY;

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log("error", "Wallet not connected!");
            alert("Wallet not Connected!");
            return;
        }
        const metaplex = Metaplex.make(connection).use(
            walletAdapterIdentity(wallet)
        );
        
        try {
            
            const temp_metadata_uri =
                "https://bafkreicagv2rcxcgyn67ptn7iycyysm2tl4s4wnnrrb4j76lyztygqh2ey.ipfs.nftstorage.link/";

            const collection_nft : any = await metaplex
                .nfts()
                .findByMint({
                    mintAddress: new PublicKey(
                        "FQWLCYAzRtra9dQgGnjchGBbiFtuVwHozZEi1XwRoRnm"
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
                    collection: new PublicKey(
                        "FQWLCYAzRtra9dQgGnjchGBbiFtuVwHozZEi1XwRoRnm"
                    ),
                });

            // const nft = await metaplex.nfts().findByMint({mintAddress: new PublicKey("DrQeius4na8MDR6d9mtALgjEbVHb21xVkpjQ7noZuuhV")});
            
            const ix_accounts: VerifySizedCollectionItemInstructionAccounts = {
                metadata: nft.metadataAddress,
                collectionAuthority: metaplex.identity().publicKey,
                payer: metaplex.identity().publicKey,
                collectionMint: collection_nft.address,
                collection: collection_nft.metadataAddress,
                collectionMasterEditionAccount: collection_nft.edition.address,
            };

            const ix = createVerifySizedCollectionItemInstruction(ix_accounts);

            const tx = TransactionBuilder.make()
                .setFeePayer(metaplex.identity())
                .add({
                    instruction: ix,
                    signers: [metaplex.identity()],
                });

            await tx.sendAndConfirm(metaplex);
            alert("Transaction Confirmed!");

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
