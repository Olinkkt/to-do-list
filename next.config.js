/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Varování nebudou blokovat build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 