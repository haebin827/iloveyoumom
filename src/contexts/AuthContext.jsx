import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../configs/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = localStorage.getItem('auth_status');
      const isAuthenticated = authStatus === 'true';
      setAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        await fetchUserData();
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('사용자 정보 가져오기 실패');
        return;
      }
      
      if (data) {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('사용자 정보 가져오기 실패');
    }
  };

  const login = async (password) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('데이터 조회 오류');
        return { success: false, error: '사용자 정보를 조회할 수 없습니다.' };
      }

      const isCorrect = data && await bcrypt.compare(password, data.password);
      
      if (isCorrect) {
        localStorage.setItem('auth_status', 'true');
        setAuthenticated(true);
        setCurrentUser(data);
        return { success: true };
      } else {
        return { success: false, error: '잘못된 비밀번호입니다.' };
      }
    } catch (err) {
      console.error('로그인 실패');
      return { success: false, error: '인증 처리 중 오류가 발생했습니다.' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .limit(1)
        .single();
        
      if (error) {
        console.error('데이터 조회 오류');
        return { success: false, error: '사용자 정보를 조회할 수 없습니다.' };
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, data.password);
      
      if (!data || !isCurrentPasswordValid) {
        return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      const { error: updateError } = await supabase
        .from('user')
        .update({ password: hashedNewPassword })
        .eq('id', data.id);
        
      if (updateError) {
        console.error('업데이트 오류');
        throw updateError;
      }
      
      return { success: true };
    } catch (err) {
      console.error('비밀번호 변경 실패');
      return { success: false, error: '비밀번호 변경 중 오류가 발생했습니다.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_status');
    setAuthenticated(false);
    setCurrentUser(null);
  };

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

export const useAuth = () => useContext(AuthContext); 