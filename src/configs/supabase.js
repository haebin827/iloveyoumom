import { createClient } from '@supabase/supabase-js'

// Supabase URL과 anon key를 환경변수에서 가져오거나 직접 입력하세요.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성 (타임아웃 및 헤더 설정)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    fetch: (...args) => {
      // fetch 요청의 타임아웃 설정
      const [url, options] = args;
      const timeout = 60000; // 60초 타임아웃
      
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
      ]);
    }
  }
}) 