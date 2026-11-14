# Radar do Hardware

Site de ofertas de hardware e tecnologia — https://radardohardware.com.br

## Como atualizar as ofertas

Tudo fica em `ofertas.json`:

- `atualizado`: data da última conferência de preços (AAAA-MM-DD)
- `links`: endereços do grupo do WhatsApp, Telegram e redes. Botão com link vazio aparece desativado.
- `ofertas`: cada oferta tem `titulo`, `categoria`, `preco`, `preco_antigo` (0 se não houver), `loja`, `obs` (aviso opcional), `imagem`, `link` (link de afiliado meli.la) e `destaque` (true/false).

As categorias dos filtros são criadas automaticamente a partir das ofertas.

## Publicação

GitHub Pages, branch `main`, pasta raiz. O arquivo `CNAME` aponta para radardohardware.com.br.
