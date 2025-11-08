import React, { useState, useEffect } from 'react';

interface WelcomeGatewayProps {}

const WelcomeGateway: React.FC<WelcomeGatewayProps> = () => {
  const [isVisible, setIsVisible] = useState(false);
  const KEY_SEEN = 'ba_gateway_seen_v2';
  const KEY_ROLE = 'ba_user_role';

  useEffect(() => {
    // Verifica parâmetros de URL para forçar exibição
    const urlParams = new URLSearchParams(window.location.search);
    const forceGW = urlParams.has('gw') || urlParams.has('gateway') || urlParams.get('showGateway') === '1';
    
    // Checa se o usuário já viu o overlay nesta sessão
    const seenInSession = sessionStorage.getItem(KEY_SEEN) === '1';
    
    // Checa se veio de outra página do mesmo site (navegação interna)
    const isInternalNavigation = () => {
      const referrer = document.referrer;
      if (!referrer) return false; // Sem referrer = acesso direto ou refresh
      
      // Se o referrer é do mesmo domínio, é navegação interna
      try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(window.location.href);
        return referrerUrl.hostname === currentUrl.hostname;
      } catch {
        return false;
      }
    };

    const isInternal = isInternalNavigation();
    
    console.log('WelcomeGateway: forceGW =', forceGW);
    console.log('WelcomeGateway: isInternalNavigation =', isInternal);
    console.log('WelcomeGateway: document.referrer =', document.referrer || 'none');
    console.log('WelcomeGateway: seenInSession =', seenInSession);

    // LÓGICA SIMPLES:
    // Mostra o overlay SEMPRE, EXCETO se:
    // 1. Já foi visto nesta sessão E
    // 2. É navegação interna (veio de outra página do site)
    const shouldShow = forceGW || !(seenInSession && isInternal);
    
    if (shouldShow) {
      console.log('WelcomeGateway: showing gateway');
      setIsVisible(true);
    } else {
      console.log('WelcomeGateway: not showing gateway (already seen + internal nav)');
    }

    // Adiciona função global para testar
    (window as any).showGateway = () => {
      console.log('Forcing gateway display');
      setIsVisible(true);
    };
    (window as any).hideGateway = () => {
      console.log('Hiding gateway');
      setIsVisible(false);
    };
    (window as any).clearGatewaySeen = () => {
      sessionStorage.removeItem(KEY_SEEN);
      localStorage.removeItem(KEY_SEEN);
      console.log('Gateway seen flags cleared (both session and local storage)');
    };
    (window as any).checkNavigationType = () => {
      const isInternal = isInternalNavigation();
      const referrer = document.referrer || 'none';
      console.log('Navigation type - isInternal:', isInternal, 'referrer:', referrer);
      return { isInternal, referrer };
    };
  }, []);

  const closeGateway = () => {
    setIsVisible(false);
    // Marca como visto apenas na sessão atual
    // Será limpo quando a aba/browser for fechado
    sessionStorage.setItem(KEY_SEEN, '1');
  };

  const handleAction = (action: string) => {
    if (action === 'continuar') {
      closeGateway();
    } else if (action === 'aluno-dashboard') {
      localStorage.setItem(KEY_ROLE, 'aluno');
      sessionStorage.setItem(KEY_SEEN, '1');
      setIsVisible(false);
      window.location.href = '/pages/aluno.html';
    } else if (action === 'func-area') {
      localStorage.setItem(KEY_ROLE, 'funcionario');
      sessionStorage.setItem(KEY_SEEN, '1');
      setIsVisible(false);
      window.location.href = '/pages/funcionario.html';
    }
  };

  const handleLinkClick = () => {
    sessionStorage.setItem(KEY_SEEN, '1');
  };

  console.log('WelcomeGateway: rendering gateway, isVisible =', isVisible);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Só fecha se clicou diretamente no backdrop (não nos elementos filhos)
    if (e.target === e.currentTarget) {
      console.log('WelcomeGateway: backdrop clicked, closing gateway');
      closeGateway();
    }
  };

  return (
    <div 
      className={`ba-gateway-overlay ${isVisible ? 'active' : ''}`}
      style={{ display: isVisible ? 'grid' : 'none' }}
      onClick={handleBackdropClick}
    >
      <div className="ba-gateway" role="dialog" aria-modal="true" aria-labelledby="gw-title">
        <div className="ba-gw-header">
          <img src="/assets/img/bodyaction_logo.png" alt="BodyAction"/>
          <div>
            <h2 id="gw-title" className="ba-gw-title">BEM-VINDO À BODY ACTION GYM</h2>
            <p className="ba-gw-sub">Escolha como deseja começar sua experiência.</p>
          </div>
        </div>
        <div className="ba-gw-body">
          <div className="ba-gw-grid">
            <div className="ba-gw-card" id="opt-aluno">
              <h3>Sou Aluno</h3>
              <p>Acompanhe aulas e cobranças. Se ainda não tem cadastro, crie agora.</p>
              <div className="ba-gw-actions">
                <a 
                  className="ba-btn primary" 
                  href="/pages/cadastro.html"
                  onClick={handleLinkClick}
                >
                  Cadastrar-se
                </a>
                <button 
                  className="ba-btn" 
                  type="button" 
                  onClick={() => handleAction('aluno-dashboard')}
                >
                  Ver minha área
                </button>
              </div>
            </div>
            <div className="ba-gw-card" id="opt-func">
              <h3>Sou Funcionário</h3>
              <p>Acesso administrativo básico para gestão (em breve recursos completos).</p>
              <div className="ba-gw-actions">
                <button 
                  className="ba-btn" 
                  type="button" 
                  onClick={() => handleAction('func-area')}
                >
                  Entrar
                </button>
                <a 
                  className="ba-btn" 
                  href="/pages/planos.html"
                  onClick={handleLinkClick}
                >
                  Ver planos
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="ba-gw-footer">
          <div className="ba-gw-mini">Você pode mudar sua escolha depois.</div>
          <a 
            className="ba-btn" 
            href="/pages/planos.html"
            onClick={handleLinkClick}
          >
            Adquirir um plano
          </a>
          <button 
            className="ba-btn ba-gw-close" 
            type="button" 
            onClick={() => handleAction('continuar')}
          >
            Continuar navegando
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGateway;