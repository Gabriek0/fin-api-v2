<p align="center">
  <img src="https://static.vecteezy.com/system/resources/previews/012/598/212/original/currency-coin-cartoon-png.png" width="200">
</p>

<h1 align="center">FinAPI V2</h1>

 <h2 align="center">🚧 Em desenvolvimento 🚧</h2>

FinAPI é uma API para controles financeiros. Dentro da trilha do Ignite, construímos a API sem aplicar estruturação de pastas, utilização de banco de dados, princípios SOLID, e Docker. Essa versão 2.0 trás todos esses detalhes, porém a aplicação já vem pré-elaborada.

A versão antiga você pode conferir aqui 👉 [FinAPI](https://github.com/Gabriek0/finAPI).

Assim, o principal desafio aqui é a construção de `Testes Unitários` e `Testes de Integração` utilizando o _Jest_.

## Testes Unitários

Os testes unitários são aplicados nos casos de uso da aplicação. Em ordem temos, dois módulos: **users** e **statements**

### Casos de uso

##### `createUser`

- [x] Deve ser possível criar um usuário.
- [x] Não deve ser possível criar um usuário com um email que já exista.

##### `authenticateUser`

- [x] Deve ser possível autenticar um usuário.
- [x] Não deve ser possível autenticar um usuário com email incorreto.
- [x] Não deve ser possível autenticar um usuário com senha incorreta.

##### `showUserProfile`

- [x] Deve ser possível exibir os dados do usuário.
- [x] Não deve ser possível exibir os dados de um usuário inexistente.

#### Statements

##### `createStatement`

- [x] Deve ser possível criar um extrato.
- [x] Não deve ser possível criar um extrato para um usuário inexistente.
- [x] Não deve ser possível criar um extrato de saque se o dinheiro na conta for inferior ao valor que o usuário deseja sacar da conta.

##### `getBalance`

- [x] Deve ser possível obter o saldo da conta.
- [x] Não deve ser possível obter o saldo para um usuário inexistente.

##### `getStatementOperation`

- [x] Deve ser possível obter o extrato de uma determinada operação.
- [x] Não deve ser possível obter o extrato de uma operação para um usuário inexistente.
- [x] Não deve ser possível obter o extrato de uma operação inexistente.
