import React, { useState, useEffect } from 'react';
import '../styles/pages/contato.css';

type AlertType = 'ok' | 'err';

const ContactForm: React.FC = () => {
  const [assunto, setAssunto] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [lgpd, setLgpd] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertType>('ok');

  useEffect(() => {
    if (!alert) return;
    const t = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(t);
  }, [alert]);

  // Simple input masks
  const onCpfChange = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    setCpf(digits);
  };

  const onTelefoneChange = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    // format (00) 00000-0000
    let formatted = digits;
    if (digits.length > 2) formatted = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length > 7) formatted = `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    setTelefone(formatted);
  };

  const validate = () => {
    const errors: string[] = [];
    if (!assunto) errors.push('Selecione um assunto.');
    if (!nome || nome.trim().length < 2) errors.push('Informe seu nome completo.');
    // telefone basic check
    if (!/\(\d{2}\) \d{4,5}-?\d{0,4}/.test(telefone)) errors.push('Telefone inválido.');
    if (!/\S+@\S+\.\S+/.test(email)) errors.push('E-mail inválido.');
    if (cpf && cpf.replace(/\D/g, '').length !== 11) errors.push('CPF deve conter 11 dígitos.');
    if (!mensagem || mensagem.trim().length < 10) errors.push('Escreva uma mensagem com pelo menos 10 caracteres.');
    if (!lgpd) errors.push('Autorize o uso dos dados para retorno do contato.');
    return errors;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length) {
      setAlert(errors.join(' '));
      setAlertType('err');
      return;
    }

    // Demo: show success and reset
    setAlert('Mensagem enviada com sucesso! Em breve retornaremos.');
    setAlertType('ok');
    setTimeout(() => {
      setAssunto(''); setNome(''); setTelefone(''); setEmail(''); setCpf(''); setMensagem(''); setLgpd(false);
    }, 4000);
  };

  return (
    <section className="contato-section">
      <form id="form-contato" onSubmit={onSubmit} className="contato-form">
        {alert && <div id="fc-alert" className={`fc-alert ${alertType}`}>{alert}</div>}

        <label>Assunto
          <select id="assunto" value={assunto} onChange={e => setAssunto(e.target.value)}>
            <option value="">-- selecione --</option>
            <option value="duvida">Dúvida</option>
            <option value="plano">Planos</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label>Nome
          <input id="nome" value={nome} onChange={e => setNome(e.target.value)} />
        </label>

        <label>Telefone
          <input id="telefone" value={telefone} onChange={e => onTelefoneChange(e.target.value)} />
        </label>

        <label>E-mail
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label>CPF (opcional)
          <input id="cpf" value={cpf} onChange={e => onCpfChange(e.target.value)} />
        </label>

        <label>Mensagem
          <textarea id="mensagem" value={mensagem} onChange={e => setMensagem(e.target.value)} />
        </label>

        <label>
          <input id="lgpd" type="checkbox" checked={lgpd} onChange={e => setLgpd(e.target.checked)} /> Concordo com o uso dos dados
        </label>

        <button type="submit">Enviar</button>
      </form>
    </section>
  );
};

export default ContactForm;
