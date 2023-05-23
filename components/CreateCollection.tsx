import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey, Connection, sendAndConfirmTransaction } from "@solana/web3.js";
import { FC, useCallback } from "react";
import { NFTStorage, Blob, File } from "nft.storage";
import {
    Metaplex,
    walletAdapterIdentity,
    TransactionBuilder,
    Nft,
    toMetaplexFileFromBrowser
} from "@metaplex-foundation/js";
import { ApproveCollectionAuthorityInstructionAccounts, createApproveCollectionAuthorityInstruction } from "@metaplex-foundation/mpl-token-metadata";
import { nftStorage } from "@metaplex-foundation/js-plugin-nft-storage";

let selectedImage:any = null

const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectedImage = event.target.files as FileList;
    // setCurrentImage(selectedFiles?.[0]);
    // setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
    // setProgress(0);
  };


export const CreateCollection: FC = () => {
    // const { connection } = useConnection();
    const connection = new Connection(process.env.RPC_ENDPOINT!);
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet();

    const NFTSTORAGE_API_KEY = process.env.NFTSTORAGE_API_KEY;

    const ticketData = {
        title: "Tuke",
        symbol: "LUK",
        description: "Lukey Momo",
        schedule: [
            { date: 24042023, time: 1900 },
            { date: 25042023, time: 1900 },
        ],
        pricing: [
            { category: "A", price: 300, quantity: 500 },
            { category: "B", price: 200, quantity: 1000 },
            { category: "C", price: 100, quantity: 1500 },
        ],
        royalties: [
            {
                address: "7WNRBicA8MmZ5U7gnKZ6FhgVwZrfa915zZ8QS8vYL2sj",
                share: 1000,
            },
            {
                address: "FkvNBs5TruvbAuUkrKdBXZW9zJSrRi6ZrV8n5Fjnad7F",
                share: 5000,
            },
        ],
    };

    const onClick = useCallback(async () => {
        if (!publicKey) {
            console.log("error", "Wallet not connected!");
            alert("Wallet not Connected!");
            return;
        }
        if(selectedImage == null){
            alert("Please upload an image!");
            return
        }

        const metaplex = Metaplex.make(connection)
            .use(walletAdapterIdentity(wallet))
            .use(nftStorage({ token: NFTSTORAGE_API_KEY! }));

        const temp_nft_img_ipfs =
            "ipfs://bafybeiflvon2jde7ww4rftt2wzdjqn2bek7ixeixbm6aib52fbluqqerem/1042.png";

        try {
            // const NFT_metadata = {
            //     name: ticketData.title,
            //     symbol: ticketData.symbol,
            //     description: ticketData.description,
            //     image: temp_nft_img_link,
            //     attributes: [
            //         { trait_type: "Category", value: "A" },
            //         { trait_type: "Date", value: "24/04/2023" },
            //         { trait_type: "Time", value: "7pm" },
            //     ],
            //     properties: {
            //         files: [
            //             {
            //                 uri: temp_nft_img_link,
            //                 type: "image/png",
            //                 cdn: true,
            //             },
            //             {
            //                 uri: temp_nft_img_ipfs,
            //                 type: "image/png",
            //                 cdn: false,
            //             },
            //         ],
            //         category: "image",
            //         creators: ticketData.royalties,
            //     },
            // };

            const collection_NFT_metadata = {
                name: ticketData.title,
                symbol: ticketData.symbol,
                description: ticketData.description,
                image: await toMetaplexFileFromBrowser(selectedImage[0]),
                properties: {
                    // files: [
                    //     {
                    //         uri: temp_nft_img_link,
                    //         type: "image/png",
                    //         cdn: true,
                    //     },
                    //     {
                    //         uri: temp_nft_img_ipfs,
                    //         type: "image/png",
                    //         cdn: false,
                    //     },
                    // ],
                    // category: "image",
                    creators: ticketData.royalties,
                },
            };
    
            const uri = await metaplex
                .nfts()
                .uploadMetadata(collection_NFT_metadata);
            console.log("===Metadata URI===");
            console.log(uri);

            alert("Metadata Upload Success!");

            const parent_nft: Nft = await metaplex
                .nfts()
                .create({
                    uri: uri.uri,
                    name: ticketData.title,
                    symbol: ticketData.symbol,
                    sellerFeeBasisPoints: 0
                }, {commitment: "finalized"}).then(async(parent_nft) => {
                    alert("Collection NFT Created!!")
                    console.log(parent_nft)
                    await metaplex.nfts().approveCollectionAuthority({
                        mintAddress: parent_nft.nft.mint.address,
                        collectionAuthority: new PublicKey("MiyuWHYQpMQmJZiUMzDrRXqFnZXcCvEsobUQ7XURnQC")
                    })
                    alert("lfg")
                })


            const parent_nft_data:any  = await metaplex.nfts().findByMint({mintAddress: parent_nft.address})
            
            const ix_accounts : ApproveCollectionAuthorityInstructionAccounts = {
                collectionAuthorityRecord:metaplex.nfts().pdas().collectionAuthorityRecord({
                    mint: parent_nft.address,
                    collectionAuthority: publicKey
                }),
                newCollectionAuthority: new PublicKey("MiyuWHYQpMQmJZiUMzDrRXqFnZXcCvEsobUQ7XURnQC"),
                updateAuthority: publicKey,
                payer: publicKey,
                metadata: parent_nft.metadataAddress,
                mint: parent_nft.address
            } 
            const ix = createApproveCollectionAuthorityInstruction(ix_accounts)
            const tx = new Transaction();
            tx.add(ix)
            const signature = await sendTransaction(tx, connection)
            await connection.confirmTransaction({
                blockhash: (
                    await connection.getLatestBlockhash("max")
                ).blockhash,
                lastValidBlockHeight: (
                    await connection.getLatestBlockhash("max")
                ).lastValidBlockHeight,
                signature: signature,
            });
            alert("lfg")

        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, [publicKey, connection]);

    return (
        <div style={{ height: "60px" }}>
            <input type="file" accept="image/*" onChange={selectImage} />
            <button
                onClick={onClick}
                style={{
                    height: "60px",
                    background: "slateblue",
                    borderRadius: "10%",
                }}
            >
                <span>Create Collection NFT</span>
            </button>
        </div>
    );
};
