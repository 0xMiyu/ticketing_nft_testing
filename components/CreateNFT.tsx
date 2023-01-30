import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    LAMPORTS_PER_SOL,
    TransactionSignature,
    SystemProgram,
    PublicKey,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import { NFTStorage, Blob, File } from "nft.storage";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { createVerifyCollectionInstruction, createSetAndVerifyCollectionInstruction, SetAndVerifyCollectionInstructionAccounts } from "@metaplex-foundation/mpl-token-metadata";

export const CreateNFT: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet();
    const SOL_PRICE_OF_LIKE = 0.1;

    const NFTSTORAGE_API_KEY = process.env.NFTSTORAGE_API_KEY;
        

    //REMOVE HARDCODED AUTHORS & SHARES LATER
    const authors = [
        "7WNRBicA8MmZ5U7gnKZ6FhgVwZrfa915zZ8QS8vYL2sj",
        "FkvNBs5TruvbAuUkrKdBXZW9zJSrRi6ZrV8n5Fjnad7F",
        "5ZQcbNFk17uNfZEK1hVvs2NrMBRXLVGNsjK6iSewDbEH",
    ];
    const shares = [7000, 2000, 1000];

    const ticketData = {
        title: "Justin Bieber World Tour 2023",
        description: "Justin sings some songs and stuff idk",
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
        const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
        const nftstorage_client = new NFTStorage({ token: NFTSTORAGE_API_KEY! });

        // const img_data : any = readFileSync("/Users/martin/Stuff/Projects/journalist_next_testing/ticket_img.png");
        // const type : any = mime.getType("/Users/martin/Stuff/Projects/journalist_next_testing/ticket_img.png");
        // const nft_img = new File(img_data, "ticketimg", type)
        const temp_nft_img_link =
            "https://nftstorage.link/ipfs/bafybeiflvon2jde7ww4rftt2wzdjqn2bek7ixeixbm6aib52fbluqqerem/1042.png";
        const temp_nft_img_ipfs =
            "ipfs://bafybeiflvon2jde7ww4rftt2wzdjqn2bek7ixeixbm6aib52fbluqqerem/1042.png";

        const transaction = new Transaction();
        try {
            // const metadata = {
            //     name: ticketData.title,
            //     symbol: "TKT",
            //     description: ticketData.description,
            //     image: temp_nft_img_link,
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
            // const blob = new Blob([JSON.stringify(metadata, null, 2)], {
            //     type: "application/json",
            //   });
            // const cid = await nftstorage_client.storeBlob(blob);
            // console.log("====================")
            // console.log(cid);
            const temp_metadata_uri = "https://bafkreicagv2rcxcgyn67ptn7iycyysm2tl4s4wnnrrb4j76lyztygqh2ey.ipfs.nftstorage.link/"
            
            const nft = await metaplex.nfts().create({uri: temp_metadata_uri, name: "Justin Bieber 2023", symbol: "JB23",sellerFeeBasisPoints: 1000, isCollection: true, 
                                    collection: new PublicKey("FQWLCYAzRtra9dQgGnjchGBbiFtuVwHozZEi1XwRoRnm")});
            
            
            const lmao : SetAndVerifyCollectionInstructionAccounts = {metadata: nft.metadataAddress, 
                                                                        collectionAuthority: wallet.publicKey!,
                                                                        payer: wallet.publicKey!,
                                                                        updateAuthority: wallet.publicKey!,
                                                                        collectionMint: nft.mintAddress,
                                                                        collection: nft.metadataAddress,
                                                                        collectionMasterEditionAccount: nft.masterEditionAddress,
                                                                    }
            const ix = createSetAndVerifyCollectionInstruction(lmao)
            transaction.add(ix)
            sendTransaction(transaction, connection);


            // const tx = await sendTransaction(transaction, connection);
            // await connection.confirmTransaction({
            //     blockhash: (
            //         await connection.getLatestBlockhash("max")
            //     ).blockhash,
            //     lastValidBlockHeight: (
            //         await connection.getLatestBlockhash("max")
            //     ).lastValidBlockHeight,
            //     signature: tx,
            // });
            alert("Transaction Confirmed!");
        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, [publicKey, connection]);

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
};
