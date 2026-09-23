# Checkout /assinatura

Prévia com produtos fictícios, sem cobrança. A landing page `/online` renderiza `ClubeMusicalLP.jsx`. Os botões de assinatura levam a `/assinatura?plano=mensal` ou `/assinatura?plano=anual`, renderizada por `AssinaturaLP.jsx`.

## Configuração

1. Definir planos, preços, períodos e extras em `checkout/catalog.js`. Remover `preview: true` somente dos extras reais aprovados.
2. Configurar produtos/ofertas de assinatura na Cakto com preços e regras de renovação correspondentes. O preço exibido deve coincidir com a oferta. O servidor nunca aceita valores ou IDs de oferta enviados pelo navegador.
3. Preferir `CAKTO_ASSINATURA_CHECKOUTS`: mapa JSON de cada cesta para seu link hospedado. Exemplo de chave: `mensal+encontro+praticas` (extras em ordem alfabética). Configurar a cesta e verificar os itens no destino; não há parâmetros públicos documentados para pré-selecionar bumps. Nenhum dado pessoal é colocado no URL. O comprador confirma os dados, a forma de pagamento e os valores na Cakto.
4. Para Pix parcelado, habilitar Pagaleve na conta/oferta e verificar elegibilidade para o produto. Não confundir Pix parcelado com Pix Automático ou renovação mensal. Na API pública consultada, Pix parcelado não é método aceito.
5. A cobrança direta opcional usa `CAKTO_CLIENT_ID`, `CAKTO_CLIENT_SECRET`, `CAKTO_SDK_CLIENT_ID` e `CAKTO_ASSINATURA_OFFER_MENSAL/ANUAL`. Verificar escopos, Cakto Banking, preço, criação de assinatura e renovação em staging antes de habilitar. Pix transacional não autoriza débitos recorrentes futuros. A interface não promete renovação automática para esse método.
6. Só após homologar, definir `CAKTO_ASSINATURA_ENABLED=true`. Não colocar segredos em variáveis VITE. Configurar entrega e confirmações por e-mail na Cakto; esta implementação não libera acesso nem provisiona membros.

## Limites e comportamento

- API pública de pagamentos aceita exatamente um item `main`. Extras usam cestas hospedadas; nunca criamos cobranças separadas silenciosamente.
- Cartão direto usa SDK `createToken`, antifraude e somente token no servidor. Número e CVV não são armazenados.
- Retentativas no mesmo formulário preservam payload, token e chave de idempotência. Após uma tentativa ambígua, a edição é bloqueada. Não atualizar a página para repetir uma cobrança. Persistência/consulta de pedidos entre recargas ainda precisa de armazenamento durável antes de produção em escala.
- A resposta `paid` é a única tratada como pagamento aprovado. Pix mostra copia e cola e validade; confirmação ocorre por e-mail. Não há polling/webhook local nesta entrega.
- O Vite sozinho não executa funções de `api/`. Na prévia sem backend, as cobranças continuam bloqueadas. Usar ambiente Vercel com variáveis para homologar.
- Dados e ofertas fictícios nunca devem ser usados para uma cobrança real.

Documentação consultada: https://docs.cakto.com.br/api-reference/payments/create-card, https://docs.cakto.com.br/api-reference/payments/create-pix, https://docs.cakto.com.br/sdk/tokenizacao, https://docs.cakto.com.br/sdk/antifraude, https://www.cakto.com.br/pix-parcelado.

Validação local: `npm run build` e `node --test checkout/assinatura.test.js`. Testes de API usam fetch simulado e não criam cobranças.
