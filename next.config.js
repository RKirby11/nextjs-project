/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            process.env.S3_BUCKET_BASE_URL
        ]
    },
}

module.exports = nextConfig
