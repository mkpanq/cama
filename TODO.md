# TODOs in Codebase

#### [TODO-a7bea2]
Remove bank connenction on the separate page with bank connections - institutions are only for creating the new ones! */}<br/>
File: [src/app/(dashboard)/institutions/_components/institutionsList.tsx:80](./src/app/(dashboard)/institutions/_components/institutionsList.tsx#L80)

#### [TODO-4272c7]
Think about better erroring strategy<br/>
File: [src/app/api/requisition/confirm/route.ts:15](./src/app/api/requisition/confirm/route.ts#L15)

#### [TODO-03677c]
Think about zod library for parsing and validate such input<br/>
File: [src/app/auth/_lib/actions.ts:9](./src/app/auth/_lib/actions.ts#L9)

#### [TODO-edfdae]
Set default userId automatically, whenever user has active session?<br/>
File: [src/db/client.ts:5](./src/db/client.ts#L5)

#### [TODO-f759d0]
Database connections limit - we need to handle the error that appeared during development: - ``[Error [PostgresError]: remaining connection slots are reserved for roles with the SUPERUSER attribute``<br/>
File: [src/db/client.ts:6](./src/db/client.ts#L6)

#### [TODO-66dd18]
Remember to improve Error handling - thanks to that we would know what happened in the<br/>
File: [src/jobs/getAccountBalances.job.ts:34](./src/jobs/getAccountBalances.job.ts#L34)

#### [TODO-cf30f0]
Not a fan of this solution when need to extract token and userId separately just for those methods<br/>
File: [src/jobs/getAccountBalances.job.ts:69](./src/jobs/getAccountBalances.job.ts#L69)

#### [TODO-a74078]
Remember to improve Error handling - thanks to that we would know what happened in the<br/>
File: [src/jobs/getAccountTransactions.job.ts:35](./src/jobs/getAccountTransactions.job.ts#L35)

#### [TODO-d7950d]
Not a fan of this solution when need to extract token and userId separately just for those methods<br/>
File: [src/jobs/getAccountTransactions.job.ts:81](./src/jobs/getAccountTransactions.job.ts#L81)

#### [TODO-e66542]
Needs refactor - rather save historical days together with the accounts table rather than making such joins<br/>
File: [src/lib/account/account.service.ts:90](./src/lib/account/account.service.ts#L90)

#### [TODO-826156]
We should create separate "Job Method wrapper" to identify why some requests<br/>
File: [src/lib/balance/balance.service.ts:10](./src/lib/balance/balance.service.ts#L10)

#### [TODO-bc4b3e]
Just for remove any compilator issues with potential nulls<br/>
File: [src/lib/bankConnection/bankConnection.service.ts:91](./src/lib/bankConnection/bankConnection.service.ts#L91)

#### [TODO-465426]
For testing and development let's add just test bank<br/>
File: [src/lib/institution/institution.service.ts:21](./src/lib/institution/institution.service.ts#L21)

#### [TODO-04f44b]
Just for testing<br/>
File: [src/lib/institution/institution.service.ts:27](./src/lib/institution/institution.service.ts#L27)

#### [TODO-40b042]
We should create separate "Job Method wrapper" to identify why some requests<br/>
File: [src/lib/transaction/transaction.service.ts:1](./src/lib/transaction/transaction.service.ts#L1)

#### [TODO-7c1d9c]
Right now I've decided to go with one middleware file due to need of creating separate parser for multiple middleware files - Will do it later, when more middlewares will be needed<br/>
File: [src/middleware.ts:14](./src/middleware.ts#L14)

#### [TODO-415fee]
Redirect to login page, when browser token is expired - I've noticed that when token is expired, we get 500 error, instead of redirection to login page. Need to create mechanism to check expiration and proper redirect each time token is needed. Probably the issue is also with some errors related to the refreshing token - we'll focus on this later<br/>
File: [src/middleware.ts:15](./src/middleware.ts#L15)
