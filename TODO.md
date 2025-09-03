# TODOs in Codebase

#### [TODO-7bed3c]
Better handle static/dyamic rendering - look at the docs and see if we can use some partial rerendering<br/>
File: [src/app/(dashboard)/(home)/page.tsx:7](./src/app/(dashboard)/(home)/page.tsx#L7)

#### [TODO-b79335]
Add last update date / set cron for automatic update every day<br/>
File: [src/app/(dashboard)/(home)/page.tsx:10](./src/app/(dashboard)/(home)/page.tsx#L10)

#### [TODO-be3186]
Better handle static/dyamic rendering - look at the docs and see if we can use some partial rerendering<br/>
File: [src/app/(dashboard)/accounts/page.tsx:11](./src/app/(dashboard)/accounts/page.tsx#L11)

#### [TODO-6a744d]
Such complicated methods should be wrapped in transactions<br/>
File: [src/app/(dashboard)/institutions/_lib/actions.ts:12](./src/app/(dashboard)/institutions/_lib/actions.ts#L12)

#### [TODO-03677c]
Think about zod library for parsing and validate such input<br/>
File: [src/app/auth/_lib/actions.ts:9](./src/app/auth/_lib/actions.ts#L9)

#### [TODO-8b489b]
Think about better error handling from the Database<br/>
File: [src/db/client.ts:7](./src/db/client.ts#L7)

#### [TODO-34ce4f]
Not a fan of this solution when need to extract token and userId separately just for those methods - will need to rethink implementation of strict job methods<br/>
File: [src/jobs/getAccountBalances.job.ts:69](./src/jobs/getAccountBalances.job.ts#L69)

#### [TODO-5b8c4a]
Remember to improve Error handling - thanks to that we would know what happened in the background jobs<br/>
File: [src/jobs/getAccountTransactions.job.ts:34](./src/jobs/getAccountTransactions.job.ts#L34)

#### [TODO-76c4fc]
Create separate "Job Method wrapper" to identify why some requests needs to have tokens and current user passed as an argument, instead of getting parsed from the method itself<br/>
File: [src/jobs/jobs.config.ts:26](./src/jobs/jobs.config.ts#L26)

#### [TODO-8f92ea]
Add currency handling<br/>
File: [src/lib/balance/balance.service.ts:45](./src/lib/balance/balance.service.ts#L45)

#### [TODO-659083]
Empty states - for now, I've add PLN as default currency, but it needs to be fixed!<br/>
File: [src/lib/shared/helpers.ts:5](./src/lib/shared/helpers.ts#L5)

#### [TODO-8c8009]
Create normal, fully working AUTH mechanism<br/>
File: [src/middleware.ts:19](./src/middleware.ts#L19)
