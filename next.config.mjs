/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "http://127.0.0.1:8000/admin/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
