# Tasks: Admin App FRONTEND

## Bugs

[bug 1]: Infinite Scroll mode for users table breaks. Load Stops.
It loads only first 3 data chunks on large screens, than stops.
It works good on smaller screen sizes. Which actually very strange.

Probale Solution:
Remove custom classic pagination and raplace it with built in prime-ng table pagination;
Repace `page` machanism to `offset-limit` mechanism;
While Infinite Mode: bind `offset-limit` mechanism to the `(onLazyLoad)` output
( `first` and `rows` fields from onLazyLoad output mean `offset` and `pageSize`,
and to get `limit` u need to make `first + rows` )


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

... Replace the existed users data-table/data-table-infinite with PrimeNG Table and PrimeNG Scroller (allows to use both - virtual and infinite scroll features);

✓ Implement `getFilteredUsers()` parameter changes: <br/>
split `keepPage` parameter into `keepPage` and `keepRenderUntilChanged`. <br/>
`keepPage` - means dont reset page number <br/>
`keepRenderUntilChanged` - dont hide current render while new data chunk is being loaded <br/>
Combine them with `sumChunk` and create interface:

```typescript
export interface LoadStrategyConfig {
  keepPage?: boolean;
  keepRenderUntilChanged?: boolean;
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

Fix [bug 1] (search [bug 1] in this file)

Create components structure: page component > view component > feature component > component.

- **pages** consist from **views**.
- **views** consist from **features**.
- **features** consist from **components**.
- **component** is the basic small dummy ui element, e.g.
- in addition we have **layout** components, e.g. sidebar, app header, app footer.

Move filters-bar, data-table, data-table-infinite to separate components; no communications through Outputs;

Create NGRX Store and setup store interactions between filters-bar and data-table/data-table-infinite

Wrap table with ngx-scrollbar lib to add perfect scrollbar in ui;

Move from usual variables to signals

Add Reactive Forms to name and email inputs



## Part 3.1

Disable Reset filters button if no filters applied

Add tooltips to header cells and to content cells,
so a user can see the whole text,
when some text is minimized with `...` on smaller screen sizes

Separate clear input button (x) for every filter or input in filter bar

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
