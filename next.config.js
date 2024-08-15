


/** @type {import('next').NextConfig} */


console.log('Environment Variables:', process.env.NEXT_PUBLIC_SUPABASE_URL);
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
``