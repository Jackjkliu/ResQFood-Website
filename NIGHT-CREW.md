# Night crew: standing orders

Three Claude Code routines read this file every night and do one job each. They run on their own,
with nobody watching, so this file is the whole briefing. Edit it any time: the next run reads the
new version from the default branch.

Set up with the night-crew skill: https://github.com/alexyc9381/night-crew-skill

## The app

ResQFood's website (resqfood.com): a student-led food rescue program in North Jersey. The site connects restaurant food donors, student volunteers, and people looking for a nearby food pantry.

**Work branch, not the default branch.** `main` is served live at resqfood.com by GitHub Pages, and the owner wants nothing live until they review it. All crew work starts from `claude/resqfood-homepage-revamp`. Wherever these orders say "the default branch", read it as `claude/resqfood-homepage-revamp`: check it out first, branch from it, and open draft pull requests **into it**. Never open a pull request into `main` and never push to `main`.

Stack: plain static HTML/CSS/JavaScript, one file per page at the repo root, no build step, hosted on GitHub Pages. `index.html` (homepage) holds the current design system: CSS custom properties on `:root` (tomato `#C8352B`, produce green `#17432C`, butter `#FFF1CE`), Bricolage Grotesque headings, Poppins body, and the sticky header, mobile menu, and footer. Other pages still use the older design and inline CSS. `server.js` and `admin-server.js` are old Express files that GitHub Pages does not run.

## Backlog (the builder takes the first unchecked item)

- [ ] Restyle `how.html` with the homepage design system: copy the tokens, header, mobile menu, and footer from `index.html`; keep all existing text and the steps.
- [ ] Make every "Home" link and back button across the site point to `index.html` instead of `home.html` (do not delete `home.html`).
- [ ] On `donations.html`, when the Google Sheet fails to load, show a visible "Couldn't load donations right now" message instead of the built-in sample rows.
- [ ] Give the gallery's pop-up image (`#modalImage` in `gallery.html`) a meaningful alt text that updates with the photo being shown.
- [ ] Restyle `partners.html` with the homepage design system (same approach as how.html).
- [ ] Restyle `news.html` with the homepage design system.
- [ ] Restyle `about.html` with the homepage design system.
- [ ] Restyle `gallery.html` with the homepage design system, keeping the filters and pop-up working.
- [ ] Restyle `page5.html` (Find Nearest Pantry) with the homepage design system, keeping the location lookup and results working.

## Customers

Who pays: ResQFood is a nonprofit, so there are no paying customers. The people it needs are (1) student volunteers, often high schoolers earning PVSA hours, (2) restaurants, bakeries, and stores with surplus food, and (3) donors and families looking for food pantries.

Where they talk online: ResQFood's Instagram is @resqfood1. Otherwise unknown; scout should find out (for example North Jersey / Essex County community forums, food-rescue and food-waste communities, student volunteering and PVSA communities). Public pages only.

## Marketing to draft

A week of Instagram post drafts (7 posts) for @resqfood1: mostly volunteer recruiting and inviting restaurants to become food partners. Use only facts already on the website (for example 20,040 lbs rescued, 383 rescues, the partner list); never invent numbers, quotes, or partners.

## How to check your work

- Install: nothing to install.
- Test: `python tools/check-site.py`. There are no unit tests; this checks local links, image alt
  text, and broken scripts. Known baseline on `claude/resqfood-homepage-revamp`: 2 problems (gallery
  `#modalImage` without alt, and the `import` error in `home.html`). Don't add new ones.
- Build: no build step. To look at pages, run `python -m http.server 8000` and open
  http://localhost:8000/.
- Lint (optional design check): `npx -y impeccable detect <file>.html`. Needs Node 22+; skip it if
  npm is unreachable.

## House rules (every crew member, every night, no exceptions)

1. **Pull requests only.** Work on a new branch whose name starts with `claude/night-crew-`, and open
   a **draft** pull request into the default branch. Never merge anything. Never push to the default
   branch or to anyone else's branch.
2. **Never touch the live app.** No deploys, no releases, no publishing packages. No changes to
   production configuration, environment files, secrets, CI deploy steps or infrastructure. Never
   connect to or run migrations against a real database.
3. **Never spend money.** No purchases, no paid sign-ups, no upgrading any plan, no calls to paid
   APIs, no ads.
4. **Never delete anything you didn't create tonight.** No deleting files, branches, issues, data
   or accounts. Changing existing code to build a backlog item is fine; removing a feature is not.
5. **Never post or send anything.** No social posts, emails, messages, comments on other sites or
   replies to customers. Write drafts into the report; the owner posts them.
6. **Never put secrets in anything you write.** No keys, tokens or passwords in code, reports or
   pull request descriptions.
7. **When a job needs any of the above, don't do it.** Write `NEEDS YOUR OK:` and what you would
   do and why at the top of your report, then carry on with the rest of your job.
8. **Stay small.** One backlog item a night is a good night. If something is bigger than one night,
   split it and say so.

### Owner's never-touch list

- `main`, and `CNAME`: they control the live site and the resqfood.com domain.
- `.env`, `firebase-service-account.json`, and any API keys or config objects in the pages (Google Sheets config in `donations.html`, Firebase config in `login.html`/`verify.html`, the distance API key in `page5.html`). Do not change, move, rotate, or print them.
- `PICKUP_ENDPOINT` and `PICKUP_EMAIL` in `page7.html`, and `pickup-requests.gs`: the owner sets these up.
- `delete-all-users.js`, `admin-server.js`, `server.js`: never run them.
- Volunteer names and photos in `gallery.html`, press articles, impact figures, and partner lists: keep them exactly as they are; do not add or invent any.
- Don't add frameworks, build tools, or npm dependencies; the site must stay plain static HTML.

## The Builder's job

1. Take the **first unchecked** item in the Backlog. If it's already done in the code, or an open
   `claude/night-crew-` pull request already covers it, take the next one.
2. Build it, following the code's existing style. Add or update tests for it.
3. Run every command in "How to check your work" and fix what fails because of your change.
4. In the same branch, tick that item in this file's Backlog (`- [x]`), so merging the pull request
   records it as done.
5. Write `night-crew/reports/<date>-builder.md`: what you built, how to try it, what you tested,
   anything left over, and any `NEEDS YOUR OK:` items.
6. Open a **draft** pull request titled `Night crew (builder): <the backlog item>`, with the report
   as its description.

## The Scout's job

1. Read "The app" and "Customers". Search the places listed (and find better ones if they're thin)
   for real people asking for what this app does, complaining about the problem it solves, or
   comparing tools for it. Only use public pages. Never sign up for or log in to anything.
2. Write `night-crew/reports/<date>-scout.md`:
   - **The 10 best leads**: who, where, a link, what they said, and why they fit.
   - **Draft replies** for the best 3 (helpful first, the app mentioned only where it fits). Drafts
     only: never post them.
   - **What people keep asking for** that isn't in the Backlog yet.
3. Write the marketing listed in "Marketing to draft" into `night-crew/marketing/<date>/` (for
   example `posts.md` with one post per day, or `launch-video-script.md` with a shot list).
4. Open a **draft** pull request titled `Night crew (scout): leads and drafts for <date>`, with the
   top 3 leads in its description.

## The Tracker's job

1. Check out the default branch and run every command in "How to check your work". Record what
   passes and what fails, with the errors.
2. Look at every open `claude/night-crew-` pull request from tonight: check out each branch, run the
   same commands, and say whether it's safe to review.
3. Read the code for what's working and what isn't: broken links and pages, TODOs and FIXMEs,
   missing tests, errors in recent commits, slow or risky spots. Be specific, with file paths.
4. Write `night-crew/reports/<date>-tracker.md`:
   - **Works**: what passes and looks healthy.
   - **Doesn't work**: what's broken or failing, most serious first, with where and why.
   - **Tonight's pull requests**: for each one, safe to review or not, and why.
   - **Build next**: the 3 things you'd add to the Backlog, most valuable first.
5. Open a **draft** pull request titled `Night crew (tracker): report for <date>` containing only
   the report file.

`<date>` means the date the run started, as `YYYY-MM-DD`.
