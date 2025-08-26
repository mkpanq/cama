# TODOs in Codebase

#### [TODO-7bed3c]
Better handle static/dyamic rendering - look at the docs and see if we can use some partial rerendering<br/>
File: [src/app/(dashboard)/(home)/page.tsx:9](./src/app/(dashboard)/(home)/page.tsx#L9)

#### [TODO-b79335]
Add last update date / set cron for automatic update every day<br/>
File: [src/app/(dashboard)/(home)/page.tsx:12](./src/app/(dashboard)/(home)/page.tsx#L12)

#### [TODO-be3186]
Better handle static/dyamic rendering - look at the docs and see if we can use some partial rerendering<br/>
File: [src/app/(dashboard)/accounts/page.tsx:8](./src/app/(dashboard)/accounts/page.tsx#L8)

#### [TODO-03677c]
Think about zod library for parsing and validate such input<br/>
File: [src/app/auth/_lib/actions.ts:9](./src/app/auth/_lib/actions.ts#L9)

#### [TODO-34ce4f]
Not a fan of this solution when need to extract token and userId separately just for those methods - will need to rethink implementation of strict job methods<br/>
File: [src/jobs/getAccountBalances.job.ts:65](./src/jobs/getAccountBalances.job.ts#L65)

#### [TODO-5b8c4a]
Remember to improve Error handling - thanks to that we would know what happened in the background jobs<br/>
File: [src/jobs/getAccountTransactions.job.ts:34](./src/jobs/getAccountTransactions.job.ts#L34)

#### [TODO-76c4fc]
Create separate "Job Method wrapper" to identify why some requests needs to have tokens and current user passed as an argument, instead of getting parsed from the method itself<br/>
File: [src/jobs/jobs.config.ts:26](./src/jobs/jobs.config.ts#L26)

#### [TODO-e66542]
Needs refactor - rather save historical days together with the accounts table rather than making such joins<br/>
File: [src/lib/account/account.service.ts:93](./src/lib/account/account.service.ts#L93)

#### [TODO-8f92ea]
Add currency handling<br/>
File: [src/lib/balance/balance.service.ts:46](./src/lib/balance/balance.service.ts#L46)

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

#### [TODO-659083]
Empty states - for now, I've add PLN as default currency, but it needs to be fixed!<br/>
File: [src/lib/shared/helpers.ts:5](./src/lib/shared/helpers.ts#L5)

#### [TODO-8c8009]
Create normal, fully working AUTH mechanism<br/>
File: [src/middleware.ts:19](./src/middleware.ts#L19)
