import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/usuarios/login' : '/usuarios/registrar';
      const res = await axios.post(`http://localhost:8080/api${endpoint}`, formData);
      
      setTimeout(() => {
        login(res.data);
      }, 800);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Error en la autenticación. Revisa tus datos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] p-6 overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-[460px] bg-[#111111] border border-white/5 p-10 sm:p-14 rounded-[56px] shadow-2xl relative z-10 backdrop-blur-3xl">
        
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center border border-white/10 mb-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Zap size={38} className="text-indigo-500 fill-indigo-500" />
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter text-center">
            {isLogin ? 'StudySync' : 'Únete a studysync'}
          </h2>
          <p className="text-gray-500 mt-3 text-xs font-black uppercase tracking-[0.2em] text-center">
            {isLogin ? 'Bienvenido a tu aplicacion de estudio' : 'Crea tu usuario'}
          </p>
          
          {error && (
            <div className="mt-8 w-full p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-5">Nombre de Usuario</label>
              <div className="relative group">
                <User className="absolute left-6 top-5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required 
                  type="text" 
                  placeholder="IDENTIDAD" 
                  className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 text-sm font-bold transition-all placeholder:text-gray-800"
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-5">Email</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                required 
                type="email" 
                placeholder="USER@DOMAIN.COM" 
                className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 text-sm font-bold transition-all placeholder:text-gray-800"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-5">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-6 top-5 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#161616] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 text-sm font-bold transition-all placeholder:text-gray-800"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 rounded-[24px] flex items-center justify-center gap-3 group transition-all shadow-2xl hover:bg-indigo-500 hover:text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? 'Acceder' : 'Crear cuenta'} 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* TOGGLE MODE */}
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError(''); 
          }} 
          className="w-full mt-10 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya eres miembro? Iniciar Sesión'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;