# Painel do Vendedor - Instruções de Teste

Este diretório contém a estrutura do Painel do Vendedor.

## Como Acessar

1. Acesse `/vendedor/index.html` (ou clique em "Painel do Vendedor" no rodapé do site).
2. Na tela de login, digite qualquer CPF válido (ex: `123.456.789-01`).
   - O sistema está configurado modo de **Teste**, então qualquer CPF válido criará uma sessão temporária.
   - Para ver dados de exemplo preenchidos, use o CPF que está no mock (verifique `script.js`).

## Funcionalidades Disponíveis (Mock)

- **Login/Logout**: Simulado via localStorage.
- **Dashboard**: Exibe métricas fictícias (Comissão, Vendas, Metas).
- **Links Rápidos**: Link para página de vendas personalizada.
- **Página de Vendas (`venda.html`)**: Personalizada com o ID do vendedor na URL (ex: `?vendedor=vendedor40`).

## Estrutura de Arquivos

- `index.html`: Tela de Login.
- `dashboard.html`: Painel principal.
- `venda.html`: Página de vendas externa (Cópia da Landing Page com tracking).
- `script.js`: Lógica unificada do painel e animações.
- `style.css`: Estilos específicos do painel.

## Notas para Deploy (Vercel)

- O projeto é estático (HTML/CSS/JS).
- Os dados são resetados ao limpar o cache do navegador.
