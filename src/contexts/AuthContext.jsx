import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../configs/supabase';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 상태 Provider 컴포넌트
export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    // 로컬 스토리지에서 인증 상태 확인
    const checkAuthStatus = async () => {
      const authStatus = localStorage.getItem('auth_status');
      const isAuthenticated = authStatus === 'true';
      setAuthenticated(isAuthenticated);
      
      // 인증된 경우에만 사용자 정보 가져오기
      if (isAuthenticated) {
        await fetchUserData();
      }
      
      setLoading(false);
    };

    // 초기 세션 확인
    checkAuthStatus();
  }, []);
  
  // 사용자 정보 가져오기
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        return;
      }
      
      if (data) {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('사용자 정보 가져오기 실패:', err);
    }
  };

  // 비밀번호 인증 함수
  const login = async (password) => {
    try {
      // Supabase에서 사용자 데이터 가져오기
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('데이터 조회 오류:', error);
        return { success: false, error: '사용자 정보를 조회할 수 없습니다.' };
      }
      
      // 비밀번호 확인
      const isCorrect = data && data.password === password;
      
      if (isCorrect) {
        // 인증 성공 시 로컬 스토리지에 인증 상태 저장
        localStorage.setItem('auth_status', 'true');
        setAuthenticated(true);
        setCurrentUser(data); // 사용자 정보 설정
        return { success: true };
      } else {
        return { success: false, error: '잘못된 비밀번호입니다.' };
      }
    } catch (err) {
      console.error('로그인 실패:', err);
      return { success: false, error: '인증 처리 중 오류가 발생했습니다.' };
    }
  };

  // 비밀번호 변경 함수
  const changePassword = async (currentPassword, newPassword) => {
    try {
      // 현재 비밀번호 확인
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('데이터 조회 오류:', error);
        return { success: false, error: '사용자 정보를 조회할 수 없습니다.' };
      }
      
      if (!data || data.password !== currentPassword) {
        return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
      }
      
      // 비밀번호 업데이트
      const { error: updateError } = await supabase
        .from('user')
        .update({ password: newPassword })
        .eq('id', data.id);
        
      if (updateError) {
        console.error('업데이트 오류:', updateError);
        throw updateError;
      }
      
      return { success: true };
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃 함수
  const logout = () => {
    // 로컬 스토리지에서 인증 상태 제거
    localStorage.removeItem('auth_status');
    setAuthenticated(false);
    setCurrentUser(null);
  };

  // 컨텍스트 값
  const value = {
    authenticated,
    loading,
    currentUser,
    login,
    logout,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext); 