# Tasks: Admin App FRONTEND

## Bugs

[bug 1]: Users table: Infinite Scroll mode for users table breaks. Load Stops.
It loads only first 3 data chunks on large screens, than stops.
It works good on smaller screen sizes. Which actually very strange.


## Part 1

✓ replace dropdowns with PrimeNG dropdowns (filter dropdowns and page-size-dropdowns)

✓ implement routing with lazy loading

✓ Fix mappings:
- in user-service
- in user table

✓ Add 'idle' to AsyncState
('idle' - before anything was requested from the api)

## Part 2

~~Fix infinite table width~~

✓ Replace the existed users data-table/data-table-infinite with PrimeNG Table and PrimeNG Scroller (allows to use both - virtual and infinite scroll features);

✓ Implement `getFilteredUsers()` parameter changes: <br/>
split `keepPage` parameter into `keepPage` and `keepRenderUntilChanged`. <br/>
`keepPage` - means dont reset page number <br/>
~~`keepRenderUntilChanged` - dont hide current render while new data chunk is being loaded <br/>~~
Combine them with `sumChunk` and create interface:

```typescript
export interface LoadStrategyConfig {
  keepPage?: boolean;
  // `keepRenderUntilChanged` is not needed anymore and it was removed,
  // since we don't need to remove data-table from DOM on condition like this:
  // `@if (usersAsyncState() === 'success' || keepRenderUntilChanged()) {...}`
  // keepRenderUntilChanged?: boolean;
  sumChunk?: boolean;
}
```

`sumChunk = true` - means dont rewrite data-array with a new data chunk,
but keep it and add the loaded data chunk to the existed data-array.
Needed for **Infinite Scroll**.
`sumChunk = false` - rewrite existed data-array with a new chunk.
Needed for Classic Pagination.
`keepPage = true` + `sumChunk = true` guarantees proper data chunk will be loaded while Infinite Scroll.

**Older implementation before split `keepPage` logic:**

```typescript
  /**
   * @param keepPage - if true, keeps current render of data-table and current page number.
   * current page number can be increased/decreased from outside, but it doesn't reset page number to 1.
   * to say shortly, do not reset page number to 1,
   * and keep current render of data-table until we recieve the next page data.
   * `keepPage = true` is used when sorting or navigating between pages,
   * that helps to avoid ui blink.
   * @param sumChunk - if true, don't wipe users-list with new chunk (next page data),
   * but add new chunk to existed users-list instead.
   * `sumChunk = true` needed for infinite scroll.
   * `sumChunk = false` works with classic pagination.
   */
  getFilteredUsers(keepPage = false, sumChunk = false): void {
    this.usersAsyncState = 'loading';
    this.keepCurrentRender = keepPage;
    this.page = keepPage ? this.page : 1;
    this.userService
      .getUsers(this.getFiltersObject())
      .pipe(
        takeUntilDestroyed(this.destroyRef), // Automatically cleans up on destroy
      )
      .subscribe({
        next: (res: ApiResponse<UserAggrageted[]>) => {
          if (!this.usersData) {
            this.usersData = [];
          }

          this.usersAsyncState = 'success';
          this.usersData = sumChunk ? [...this.usersData, ...res.data] : [...res.data];
          this.totalResults = res.total;
          this.cdr.detectChanges(); // Ensure the view updates after data changessort
        },
        error: (err) => {
          this.usersAsyncState = 'error';
          console.error('Error fetching filtered users:', err);
        },
      });
  }
```

Add "Implement getFilteredUsers()..." task-item description to Frontend Specs.
Some spec desription is already provided above `getFilteredUsers` method, change it and use it.

✓ Replace pagination-mode-toggle with PrimeNG switch-component
✓ Replace input-fields with PrimeNg input-fields
✓ Replace buttons with PrimeNg buttons



## Part 3

... Fix [bug 1] (**search for "[bug 1]" in this file**)

[bug 1] Solution:
- ~~Remove custom classic pagination and raplace it with built in prime-ng table pagination;~~
- ✓ Move custom classic pagination to separate componet
- ✓ Repace `page` machanism to `offset-limit` mechanism;
- ✓ While Infinite Mode: bind `offset-limit` mechanism to the `(onLazyLoad)` output 
(
  `first` and `rows` fields from onLazyLoad output mean `offset` and `pageSize`(that is actually `limit`)
)

- ~~Remove `sumChunk`, since it's not already needed,~~ <br/>
~~since we bound `offset-limit` mechanism to the `(onLazyLoad)` output~~ (NO, keep it, `sumChunk` is actually needed for infinite scroll)

- Check if there is no bugs
- Fix this: Infinite Scroll still not working, even after the changes

✓ rename `keepPage` on `keepOffset`

... Move from usual variables to Signals
  - ✓ users-table component
  - ✓ custom-paginator component
  - ✓ infinite-scroll-toggler

- Fix infinite-mode table glitches on scroll up and on filters-reset
  - ✓ fixed the bug with glitching, but only when scroll up, by adding `appendOnly: true` to `scrollOptions` config (options for prime-ng virtual-croller in prime-ng table)
  - still issuing the bug with glitching when scroll down to load a new data chunk

✓ [bug 2]: Fix infinite-mode data-doubling when scroll down:
  - load page, set sorting by full-name
  - switch to infinite-mode
  - search by email (209 total results will appear)
  - scroll down untill the next `loading` state (not when virtual-scroll triggers but actually when onLazyLoad triggers)
  - new data rows appeared (or you can call it as new data chunk) 
  - scroll up, than sroll down again
  - new data chunk loaded again
  - What we can see (the bug) after new data chunk rendered:
  - 1) The sorting is by full-name in ascending order (from A to Z)
  - 2) After the user-name that starts with "B" we can see the next row that starts with letter "A"
  - 3) that means we loaded the wrong data chunk, offset somehow was reset to 0
  - 4) it seems it started loading data chunks from start

Fixed by replacing
```
this.offset.set(loadEvent?.first ?? this.usersData().length);
```
to
```
this.offset.set(this.usersData().length);
```
that provides prover offset syncronization


- Make table header fixed on top when infinite-mode, (it already works well in usual classic pagination mode)
  now it has fixed to top position untill we scroll down untill next data chunk loaded


## Part 3.1

Create components structure: page component > view component > feature component > component.

- **pages** consist from **views**.
- **views** consist from **features**.
- **features** consist from **components**.
- **component** is the basic small dummy ui element, e.g.
- in addition we have **layout** components, e.g. sidebar, app header, app footer.

Move filters-bar, data-table, data-table-infinite to separate components; no communications through Outputs;

Create NGRX Store and setup store interactions between filters-bar and data-table/data-table-infinite

Wrap table with ngx-scrollbar lib to add perfect scrollbar in ui;

Add Reactive Forms to name and email inputs



## Part 3.2

Disable Reset filters button if no filters applied

Add tooltips to header cells and to content cells,
so a user can see the whole text,
when some text is minimized with `...` on smaller screen sizes


Add Reset button for every select-dropdown in filters bar  a separate clear input button (x) for every filter or input in filter bar


Replace sort by firstName on fullName
sorting must be working by firstName and lastName when pass fullName as sort field

## Next


? Remove change detector ref detectChanges, make sure nothing breaks. Replace it with spread operator [...]

Add persistant state for filters, page number, page size, Use Infinite Scroll toggle



Add environments for:

- local
- ✓ development
- testing
- staging
- ✓ production

Fix design

Switch Unit-test library from Karma + Jasmine to Jest

Cover Users Table with unit-tests

```

```
