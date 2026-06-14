## short-term
- `Omatch` can own `OmatchNewspiece[]`
- Code
    - [ ] rename: `record`, `record-genre`, `record-filter`; `timeline` = `record` grouped by `date`
    - [ ] replace `Raw` types with `zod` schemas for runtime validation
- UI
    - [ ] Everything clickable need to have hover color change
    - [ ] add hover texts to clickables
    - [ ] `h1` title of each page
    - [ ] Links: add svg icons based on the domain
- Data
    - [ ] Roster rework: all rosters of the same core should be in the same data file; change of player/team = new roster.
- Filter
    - [ ] UI: allow search in player filter sections | `searchterm.tolowercase`, show player name if slug.substring(searchterm) or player is in filter
    - [ ] UI: 1st click include (style: green), 2nd click exclude (style: red + strikethrough)
    - [ ] feat: player filter: can be ANY mode or ALL mode
    - [ ] feat: more filter dimensions: event
    - [ ] UI: each filter box is default collapsed. non-selected options are only shown when hovered
    - [ ] feat: add button on `from` and `to` in `Date` filter
    - [ ] feat: separate `from` and `to` logic
    - [ ] feat: advanced search with customize query language
- Search
    - [ ] add a search section above filter section
    - [ ] add a `search_name" field to every timeline item to allow text-based searching
    - [ ] filter: item => streamterm.toWords.map(toLower).all(isSubstring of item.search_name)
- Content
    - [ ] Event Pages

## long-term
### UI
- Summary Mode: can show more items on the timeline
- Editor UI: on `/event/[slug]`: a button to open an event data editor, can output json to clipboard
- structured timeline: date -> genre -> (if genre == match) event -> item
- Chat spam generator
