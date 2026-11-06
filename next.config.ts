import type {NextConfig} from 'next';
const config:NextConfig={
 reactStrictMode:true,poweredByHeader:false,
 // Publishable client configuration; journal and chart access is protected by RLS.
 env:{
  NEXT_PUBLIC_SUPABASE_URL:process.env.NEXT_PUBLIC_SUPABASE_URL||'https://qfaomqtbkxkkzdpeporw.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'sb_publishable_ZNO9g6f712wccMd7rSWRqw_XS4glD_d'
 }
};
export default config;
