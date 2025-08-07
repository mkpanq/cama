## Issues:
There are a couple of things I've left off, mainly because I did not want to get stuck in small fixes, instead finishing the main functionality flow (even if it's full of bugs).

The most important things worth to watch:

**Database connections limit** - we need to handle the error that appeared during development:<br />
``[Error [PostgresError]: remaining connection slots are reserved for roles with the SUPERUSER attribute``

**Proper error handling** - for now, I've decided to just throw Errors and catch them in the most upper level of the app (controllers, server action, API routes). Perfect way would be installing some monitoring / error logging together with it, with some error notification toasts for user.
