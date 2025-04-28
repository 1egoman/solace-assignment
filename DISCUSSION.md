When I started the assignment, I made a list of everything that I wanted to implement and started
working through it. I wasn't able to get everything done, but tried to strike a good balance between
frontend and backend features to give a sense of how I tend to work. I'd love to go into more detail
on why I did what I did, so feel free to reach out with any questions.

For context, I spent a little over 2 hours on the actual code-writing part of this assignment, and
probably spent another half hour writing up this file and creating the two pull requests.

There are three new branches in this repo:
- `backend` contains all of my backend changes - https://github.com/1egoman/solace-assignment/pull/2
- `frontend` contains all of my frontend changes - https://github.com/1egoman/solace-assignment/pull/1 (relies on the backend changes)
- `all-changes-integrated` contains all of my changed (frontend and backend) merged together for
  testing

Below, I'll go into some of the things I wanted to do, but didn't get a chance to within the time
limit:


## Frontend

### Finish up the interface
I wasn't able to style all the interface controls as thoroughly as I would have liked. Given more
time, I would have migrated the search input to a pre-established input component like [this
one](https://ui.shadcn.com/docs/components/input), and would have put a bit more time into making
the app responsive across screen sizes.

Depending on the use case, adding more explicit filters (ie, maybe for `Specialties`?) could be a
good idea. Or maybe even a way to sort the data in the table.

There's a long list of lower priority things like light/dark mode support, social meta meta tags,
etc that for a real application is probably pretty important which I'd implement as well given the
time.

### Table formatting
Data tables are quite complex from a ux perspective, and I left this one relatively stock. I think
pinning the table headers with `position: sticky;` or similar tends to make a big difference for
large data tables. I also started formatting some of the cells (ie, `Specialties`) in the table, but
in particular formatting the phone number in a nicer way I think would have a large impact and be
pretty trivial.

### Pagination
On the backend, I implemented pagination for the API endpoint. I didn't get a chance to implement
this client side, but there's a few different ways I could have gone about this. The easiest would
have just been some "next" / "previous" buttons, but when it makes sense I tend to think an infinite
scroll type experience is superior, and is probably what I would do here.

### Virtualization
Depending on the data scale and the exact interface choices made, it could be possible to end up in
a situation where thousands of advocate rows are being rendered on screen. If this were to happen,
the dom could start to become a bottleneck and degrade the user's experience. Virtualization could
be worth exploring this this case - effectively only rendering the table rows that are on screen
rather than the whole list.


## Backend

### `created_at` column is nullable
I happened to notice that the `created_at` column on the `advocates` table is nullable, and I'm not
sure off the top of my head why that is. There may very well be a good reason but if not, make it
non-nullable for the sake of clarity.

### Better database seeding
Currently, the README outlines how one would seed the database, via `curl -X POST
http://localhost:3000/api/seed`. This works perfectly fine, but I tend to find that either a
dedicated task runner / npm command to seed the database is clearer, or potentially even just having
a migration file that does a large bulk insert could be good enough. Without knowing the exact usage
patterns it is hard to say which would be the best option, and given what's there works, I left it
as it for now.

### More robust searching
Currently, the search logic in the backend api endpoint only searches `first_name` and `last_name`.
This is technically a downgrade from the previous functionality, but implementing a more robust
search query that would properly search into nested fields like `specialties` would take a bit more
thought.

Also, my search implementation is reliant on `ILIKE` right now. In a real application, I'd probably
opt to use some sort of full text search implementation like `tsvector`, since it's more robust and
would be much more tolerant to fuzzy searching.

### Filtering / sorting
I brought this up in the `Frontend` section but wanted to mention it here too - if I were to
implement filtering and sorting of the table, that would require some backend additions, especially
if the app were operating with a non trivial amount of data.

### Database optimization
Right now, the database queries being issued by the next.js api endpoint are pretty simple. However,
as these get more complex or as the size of the underlying data were to grow, there's a lot that
could be done to speed up the read path. First, after fully implementing the filtering / sorting
logic above, a few strategic database indexes would probably have a large impact on performance.
Depending on the exact queries at play, precaching their results ahead of time (either via some sort
of memoization type scheme, or moving the computations from the read path to write path) could be
impactful. And also, depending on the exact query patterns at play, some sort of other datastore
other than postgres could be a better choice - maybe something column oriented for time series data
for example.


## General Cleanup

### Some sort of code formating, like `prettier`
Relatively self explanatory - on a team, these tools can be helpful to normalize everyone's code
into a unified format for the sake of consistency. I care very little what set of rules are used but
on a team above a certain size, it is pretty important tool.

### Some sort of linting, like `eslint`
Again, a similar rationale - on a team, these tools can be helpful to make sure everyone is
doing things that are consistent and easy to understand for the next person.

### Continuous integration / deployment
Something like github actions running when every commit is pushed and running the above linting and
formatting check steps can be nice to have, and IMO on a team above a certain size, is essential. In
addition, running some sort of type checking step would be a really good idea to do in here.

### General refactoring
I spent most of my ~2 hours fixing actual functionality, but there's a lot that could be done to
actually break down the code into smaller chunks and set the project up for success to scale
effectively as new business requirements come down the line. Mostly what I'm referring to here are
breaking up large components into smaller more self contained ones, figuring out where certain bits
of functionality can be reused, etc. This is ongoing and should always happen in the background.
