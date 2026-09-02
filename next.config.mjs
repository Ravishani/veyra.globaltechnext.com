/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "https://api.globaltechnext.com/admin/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
