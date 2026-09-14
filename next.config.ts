import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.EUROPE_STATIC === '1' ? { output: 'export' } : {};

export default nextConfig;
