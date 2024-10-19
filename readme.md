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

- **Frontend da Aplicação**:  
  Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

- **API Backend**:  
  A API estará disponível em: [http://localhost:3001](http://localhost:3001)

- **MongoDB**:  
  O MongoDB estará acessível na porta `27017`. Para conectar-se ao MongoDB a partir de um cliente, utilize as seguintes credenciais:
  - **Usuário**: `root`
  - **Senha**: `passwordroot`

- **Mongo Express** (interface gráfica para gerenciar o MongoDB):  
  Acesse: [http://localhost:8081](http://localhost:8081)
  - **Usuário**: `admin`
  - **Senha**: `pass`
