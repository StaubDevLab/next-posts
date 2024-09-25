/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.BUCKET_NAME,
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
