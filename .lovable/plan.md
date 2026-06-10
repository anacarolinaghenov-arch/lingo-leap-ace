# Trocar avatares aleatórios por fotos reais

## Problema
Hoje em `src/routes/descobrir.tsx` usamos `https://i.pravatar.cc/160?u=...` (rostos aleatórios) e `dicebear` (formas abstratas). Por isso "Michelle Khare" aparece com foto de um homem — não tem nada a ver com a pessoa real, é só um hash do nome.

## Solução
Cada recomendação mockada passa a ter uma URL de imagem **fixa e curada**, apontando para a foto/capa real do criador, livro, filme, série, podcast ou álbum.

### Fontes de imagem (hotlink direto, sem chave)
- **Pessoas (YouTubers, influencers, podcasters, músicos)**: foto oficial via Wikipedia/Wikimedia Commons (`upload.wikimedia.org/.../thumb/...`).
- **Livros**: capa do Open Library Covers API (`covers.openlibrary.org/b/isbn/{isbn}-L.jpg`).
- **Filmes / Séries**: pôster da Wikipedia (mesma origem Wikimedia).
- **Álbuns de música**: capa do MusicBrainz / Cover Art Archive ou Wikimedia.

Todas as fontes permitem hotlink e já são usadas pela maioria dos apps. Se uma imagem falhar (404), o card cai no emoji atual via `onError`.

## Mudanças em `src/routes/descobrir.tsx`

1. **Remover** os helpers `photo()` e `cover()` (geradores aleatórios).
2. **Substituir** o `image:` de cada item mockado por uma URL real curada, por exemplo:
   - Michelle Khare → foto oficial dela na Wikipedia
   - Emma Chamberlain → foto Wikipedia
   - Olivia Rodrigo / Sabrina Carpenter / Mitski → capa do álbum citado
   - *Educated* (Tara Westover) → capa Open Library pelo ISBN
   - *Past Lives*, *Lady Bird*, *Fleabag*, *Insecure* → pôster Wikipedia
3. **Card de recomendação**: adicionar `onError` no `<img>` para esconder a imagem e mostrar só o emoji caso a URL quebre, garantindo que nunca apareça "foto errada".
4. **Texto do card**: a descrição hoje é gerada a partir dos filtros ("morena, 40 anos…"). Como a foto agora é da pessoa real, a descrição **não deve mais afirmar** etnia/idade/gênero do criador real — vou reescrever para falar da *vibe do conteúdo* + "combina com o que você pediu", evitando descrever erradamente uma pessoa real.

## Fora de escopo
- Não vou conectar a APIs dinâmicas (YouTube Data, TMDB, Spotify). Fica como próximo passo se você quiser recomendações realmente geradas por IA com fotos ao vivo.
- Sem mudanças em outras rotas, no tema ou no profile store.
