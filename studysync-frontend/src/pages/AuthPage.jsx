import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Ajusta estas URLs a tus controladores de Spring Boot
      const endpoint = isLogin ? '/usuarios/login' : '/usuarios/registrar';
      const res = await axios.post(`http://localhost:8080/api${endpoint}`, formData);
      
      // Si el backend devuelve el objeto usuario, lo guardamos en el contexto
      login(res.data);
    } catch (err) {
      setError(err.response?.data || 'Error en la autenticación. Revisa tus datos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A] p-6">
      {/* Fondo decorativo con blur tipo Linear/Apple */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[440px] bg-[#111111] border border-white/5 p-12 rounded-[48px] shadow-2xl relative overflow-hidden z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-inner">
            <Zap size={32} className="text-indigo-500 fill-indigo-500" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {isLogin ? 'Introduce tus credenciales para entrar' : 'Únete a la nueva era del estudio'}
          </p>
          
          {error && (
            <div className="mt-6 w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-4">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-5 top-4.5 text-gray-600" size={18} />
                <input 
                  required 
                  type="text" 
                  placeholder="Ej. Juan Pérez" 
                  className="w-full bg-[#171717] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 text-left">
            <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-4">Email Académico</label>
            <div className="relative">
              <Mail className="absolute left-5 top-4.5 text-gray-600" size={18} />
              <input 
                required 
                type="email" 
                placeholder="tu@email.com" 
                className="w-full bg-[#171717] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-all shadow-inner"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] ml-4">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-5 top-4.5 text-gray-600" size={18} />
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#171717] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-all shadow-inner"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black py-5 rounded-[22px] flex items-center justify-center gap-3 group transition-all shadow-lg shadow-indigo-500/20 mt-6 active:scale-95"
          >
            {isLogin ? 'Entrar ahora' : 'Registrarme'} 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-8 text-sm text-gray-500 font-bold hover:text-white transition-colors"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;