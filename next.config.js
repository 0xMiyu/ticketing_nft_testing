/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
};

const env = {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
    NFTSTORAGE_API_KEY: process.env.NFTSTORAGE_API_KEY,
};

module.exports = nextConfig;
