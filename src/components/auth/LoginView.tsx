import React, { useState } from 'react';
import { Shield, Sparkles, Key, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types/project';
import { storageService, DEFAULT_USER } from '../../services/storageService';
import { triggerCelebration } from '../../common/ConfettiCelebration';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('tonileblan@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleInstantLogin = () => {
    const user = storageService.loginAsToni();
    triggerCelebration();
    onLoginSuccess(user);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleInstantLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #1E1B4B 0%, #0F172A 50%, #090D16 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'rgba(99, 102, 241, 0.15)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '20%',
        width: '450px',
        height: '450px',
        background: 'rgba(139, 92, 246, 0.15)',
        filter: 'blur(130px)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Main Glass Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(18, 26, 43, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Header / Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '28px' }}>⚡</span>
          </div>
          
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 800, 
            color: '#FFFFFF', 
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-display)'
          }}>
            ByToniProyect
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-indigo" style={{ fontSize: '10px', padding: '3px 8px' }}>
              Suite Toni · Acceso de Autor
            </span>
          </div>
        </div>

        {/* Quick 1-Click Login Card (Toni profile) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px',
              color: '#FFFFFF',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
            }}>
              TG
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                Toni García
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Lead System Architect
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleInstantLogin}
            className="btn btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '10px'
            }}
          >
            <span>Entrar</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '20px 0', 
          color: '#64748B', 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ padding: '0 12px' }}>o ingresa tus credenciales</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
              Correo Electrónico
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '42px'
            }}>
              <Mail size={16} color="#64748B" style={{ marginRight: '10px' }} />
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  width: '100%'
                }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
              Contraseña
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '0 12px',
              height: '42px'
            }}>
              <Lock size={16} color="#64748B" style={{ marginRight: '10px' }} />
              <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  width: '100%'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)}
                style={{ accentColor: '#6366F1' }}
              />
              Recordar en este equipo
            </label>
            <span style={{ color: '#818CF8', cursor: 'pointer' }}>Directrices Drive</span>
          </div>

          <button 
            type="submit"
            className="btn btn-primary"
            style={{
              height: '44px',
              fontSize: '14px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '10px',
              marginTop: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Footer badges */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '11px',
          color: '#64748B'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} color="#10B981" /> RLS Activo
          </span>
          <span>•</span>
          <span>Antonio Javier García García</span>
          <span>•</span>
          <span>By Toni © 2026</span>
        </div>

      </div>
    </div>
  );
};
