## Steps to setup

1. Using docker
```bash
cd side-project
docker-compose build
docker-compose up -d
```
2. The project should be started and listening to port 3000

## Project structure
Basic MVC structure
DTO store all the interfaces for create/update
DAO store all the interfaces for accessing data
Every controller and service follow a spec file for unit testing

Example
```bash
│   └── wallet
│       ├── dao
│       │   └── withdrawWallet.dao.ts
│       ├── dto
│       │   ├── createTransfer.dto.ts
│       │   └── createWallet.dto.ts
│       ├── wallet.controller.spec.ts
│       ├── wallet.controller.ts
│       ├── wallet.module.ts
│       ├── wallet.schema.ts
│       ├── wallet.service.spec.ts
│       └── wallet.service.ts
```

## To use the project
Here is the postman collection of postman api
https://drive.google.com/file/d/1VVAwFlOHqlYmI_fHt5RiVpalq7JYXgJr/view?usp=sharing

To interact with the wallet
1. Create user
2. Create wallet associated with user
3.
    a.(Transfer), calling /wallet/transfer with from & to wallet's id and with sufficient amount, they could transfer with each other
    b.(Deposit), calling /wallet/transfer with to wallet's id only with trigger deposit flow
    c.(Withdraw), calling /wallet/:id/withdraw with amount could withdraw money from wallet
4. Every transaction are recorded within transaction log with wallet ids, amount and action.
5. User can query transactions with wallet id and actions (transfer, deposit, withdraw)

## Decision making
1. Why using nestjs?
As nestjs is a well structured framework, having scaffolding functions and plugins, it is very suitable for
fast development. Also, with the help of decorators, i could do In Out system log for easy debugging.

2. Why using mongo?
It is because mongo is flexible and nestjs has a nice compatibility with it. Also, it is easy to set up with docker.
However, there is a major concern. If the requirement for transaction is revertable or need to rollback in the future,
a sql db might be a better choice.

3. DTO and DAO ?
It is true that I may group all interfaces together into a shared file but splitting them by their nature allows me to provide and
better project structure. This could reduce the learning curve of other developers to contribute.

4. Logging decorator ?
It is my personal preference to put in out log in controller level only. This is the result of concerning too much system log versus
easy debugging.

## Future Improvements
Business side
1. Currency
I have leave a space for wallet and transaction record to support currency if needed.

2. Delegate transfer
If user wants to delegate the ownership of his asset to other wallet and transfer, we could add a delegator field inside Wallet.
The delegator field could be an array of object which stores the delegator's wallet id and amount that delegator could control.

Technical side
1. Indexing
If transaction logs become more and more, we have to do indexing for rapid log searching.

2. Dto
If the DTO of a resources is very large, it would be better to add an index.ts for centralizing the place for file imports.

3. Test case
This project has a unit test coverage (>90%). However, integration test should also be implement for securing feature modifications.

# Time used
12 hours