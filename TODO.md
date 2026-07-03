## short-term
- Code
    - [ ] rename: `record`, `record-genre`, `record-filter`; `timeline` = `record` grouped by `date`
    - [ ] replace `Raw` types with `zod` schemas for runtime validation
- UI
    - [ ] add hover texts to clickables
    - [ ] `h1` title of each page
    - [ ] Links: add svg icons based on the domain
- Filter
    - [ ] feat: advanced search with customize query language
    - [ ] add a search section above filter section
    - [ ] add a `searchterm" field to every timeline item to allow text-based searching
    - [ ] filter: item => streamterm.toWords.map(toLower).all(isSubstring of item.search_name)
- Content
    - [ ] Event Pages

## long-term
### UI
- Summary Mode: can show more items on the timeline
- Editor UI: on `/event/[slug]`: a button to open an event data editor, can output json to clipboard
- structured timeline: date -> genre -> (if genre == match) event -> item
- Chat spam generator
