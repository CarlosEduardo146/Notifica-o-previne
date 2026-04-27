# 🔔 Sistema de Notificação PREVINE

> Sistema web para registro e acompanhamento de notificações de violência, desenvolvido para uso municipal em parceria com o Ministério Público do Estado do Ceará (MPCE).

---

## 📸 Visão Geral

O **Sistema PREVINE** oferece dois modos de acesso:

- **Registro Público** — qualquer cidadão pode registrar uma notificação sem precisar de login
- **Painel Administrativo** — acesso restrito para gestores, com dashboard, relatórios e gerenciamento de usuários

---

## 🖥️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML5 + CSS3 | Estrutura e estilo da aplicação |
| JavaScript (Vanilla) | Lógica e interatividade |
| [Chart.js](https://www.chartjs.org/) | Gráficos do dashboard |
| [jsPDF](https://github.com/parallax/jsPDF) | Geração de relatórios em PDF |
| localStorage | Armazenamento local dos dados |
| [Flaticon Uicons](https://www.flaticon.com/uicons) | Ícones da interface |

---

## ✅ Funcionalidades

- 📋 Registro de notificações em formulário multi-etapa (7 etapas)
- 📊 Dashboard com gráficos por mês, sexo, faixa etária e status dos casos
- 📄 Geração de relatório individual por protocolo em PDF
- 📑 Exportação de relatório geral em PDF
- 🔍 Consulta de registros por protocolo ou nome da vítima
- 👥 Gerenciamento de usuários com níveis de acesso (admin / usuário)
- 🔔 Sistema de notificações internas
- 📱 Interface responsiva para desktop e celular

---

## 🚀 Como Rodar o Projeto

Não requer instalação de dependências. Basta ter um navegador moderno.

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/notificacao-previne.git

# 2. Acesse a pasta do projeto
cd notificacao-previne

# 3. Abra o arquivo principal no navegador
# Clique duas vezes em index.html
# ou use uma extensão como Live Server no VS Code
```

> ⚠️ **Atenção:** os dados até então DATA 27/04/2026 são salvos apenas localmente via `localStorage`. Não há sincronização entre dispositivos ou usuários diferentes.

---

## 🔐 Acesso Inicial

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin` | `1234` |

> ⚠️ Recomenda-se alterar a senha padrão no primeiro acesso em **Perfil → Alterar Senha**.

---

## 📁 Estrutura de Arquivos

```
notificacao-previne/
├── index.html        # Aplicação principal (HTML + JS)
├── styles.css        # Estilos globais da interface
├── previne.png       # Logo do Sistema PREVINE
├── prefeitura.png    # Logo da Prefeitura Municipal
├── mpce.png          # Logo do MPCE
└── README.md         # Documentação do projeto
```

---

## 📋 Fluxo do Formulário de Registro

```
1. Ocorrência  →  2. Vítima  →  3. Responsável  →  4. Autor
      ↓
5. Tipificação  →  6. Resumo  →  7. Encaminhamento  →  ✅ Salvar
```

Cada registro recebe um **protocolo único** no formato `PREV-0001`.

---

## ⚠️ Limitações Conhecidas

- Os dados ficam armazenados apenas no navegador local (sem banco de dados)
- Não há recuperação de senha funcional
- O controle de acesso é feito no lado do cliente
- Recomendado para uso em ambiente controlado (intranet municipal)

---

## 🗺️ Melhorias Sugeridas

- [ ] Migrar para backend com banco de dados real (ex: Node.js + PostgreSQL)
- [ ] Implementar autenticação segura com hash de senha (bcrypt)
- [ ] Adicionar validação dos campos do formulário
- [ ] Implementar recuperação de senha por e-mail
- [ ] Adicionar exportação para Excel (XLSX)

---

## 👤 Autores   

Desenvolvido por **[]**
📧 ...
🔗 [...](...)

Desenvolvido por **[Denilton Silva Oliveira]**
📧 deniltonsilvarmk@gmail.com
🔗 [github.com/Notlined](http://github.com/Notlined)


---

## 🤝 Apoio Institucional

| | |
|---|---|
| Prefeitura Municipal | Desenvolvimento e implantação |
| MPCE — Ministério Público do Ceará | Apoio institucional |

---

## 📄 Licença

Este projeto é de uso institucional restrito.
Todos os direitos reservados © 2026 — Prefeitura Municipal / MPCE.
