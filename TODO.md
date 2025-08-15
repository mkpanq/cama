# TODOs in Codebase

#### [TODO-03677c]
Think about zod library for parsing and validate such input<br/>
File: [src/app/auth/_lib/actions.ts:9](./src/app/auth/_lib/actions.ts#L9)

#### [TODO-06c741]
Set default userId automatically - setup RLS<br/>
File: [src/db/client.ts:5](./src/db/client.ts#L5)

#### [TODO-cf30f0]
Not a fan of this solution when need to extract token and userId separately just for those methods<br/>
File: [src/jobs/getAccountBalances.job.ts:66](./src/jobs/getAccountBalances.job.ts#L66)

#### [TODO-a74078]
Remember to improve Error handling - thanks to that we would know what happened in the<br/>
File: [src/jobs/getAccountTransactions.job.ts:35](./src/jobs/getAccountTransactions.job.ts#L35)

#### [TODO-76c4fc]
Create separate "Job Method wrapper" to identify why some requests needs to have tokens and current user passed as an argument, instead of getting parsed from the method itself<br/>
File: [src/jobs/jobs.config.ts:26](./src/jobs/jobs.config.ts#L26)

#### [TODO-e66542]
Needs refactor - rather save historical days together with the accounts table rather than making such joins<br/>
File: [src/lib/account/account.service.ts:96](./src/lib/account/account.service.ts#L96)

#### [TODO-7cb099]
Institutions data should be saved to DB and it's most important details like name and logo should be joined to multiple records<br/>
File: [src/lib/institution/institution.service.ts:7](./src/lib/institution/institution.service.ts#L7)

#### [TODO-465426]
For testing and development let's add just test bank<br/>
File: [src/lib/institution/institution.service.ts:23](./src/lib/institution/institution.service.ts#L23)

#### [TODO-04f44b]
Just for testing<br/>
File: [src/lib/institution/institution.service.ts:29](./src/lib/institution/institution.service.ts#L29)

#### [TODO-16083b]
Add Tanstack Query for improving data caching and Errors and it's handling - decide where to return empty return and where to throw exception to catch it later.<br/>
File: [src/lib/shared/bankDataApi.request.ts:8](./src/lib/shared/bankDataApi.request.ts#L8)

#### [TODO-7c1d9c]
Right now I've decided to go with one middleware file due to need of creating separate parser for multiple middleware files - Will do it later, when more middlewares will be needed<br/>
File: [src/middleware.ts:15](./src/middleware.ts#L15)
