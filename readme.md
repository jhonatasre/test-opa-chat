# Instruções de Instalação, Configuração e Execução

## Pré-requisitos
Certifique-se de ter os seguintes itens instalados em sua máquina:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Passos de Instalação

1. **Clone o repositório**:
   Se ainda não tiver o código localmente, clone o repositório:

   ```bash
   git clone git@github.com:jhonatasre/test-opa-chat.git
   cd test-opa-chat
   ```

2. **Configuração dos arquivos**:
   O `docker-compose.yml` já está preparado com as configurações necessárias. Não é preciso realizar alterações adicionais, a menos que você queira modificar portas ou credenciais.

3. **Subir os containers**:
   Para iniciar os serviços (MongoDB, Mongo Express, API e Frontend):

   ```bash
   docker-compose up
   ```

## Como Usar o Docker

### Acessar a Aplicação

- **Mongo Express** (interface gráfica para gerenciar o MongoDB):  
  Acesse: [http://localhost:8081](http://localhost:8081)

  Usuário: `admin`
  Senha: `pass`
  
- **API Backend**:  
  A API estará disponível em: `http://localhost:3001`

- **Frontend da Aplicação**:  
  Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

## Fontes de Referência

- **Next.js**: Para manipulação de parâmetros de busca no Next.js, veja [useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params).
- **React Bootstrap**: Para validação de formulários no React Bootstrap, consulte [Form Validation](https://react-bootstrap.netlify.app/docs/forms/validation/).
- **Mongoose**: Para aprender mais sobre consultas no MongoDB usando Mongoose, veja [Mongoose Queries](https://mongoosejs.com/docs/queries.html).
- **Passport.js**: Para autenticação em Node.js, consulte [Passport.js](https://www.passportjs.org/).