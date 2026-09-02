# Tasks: Admin App FRONTEND

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

Replace the existed users data-table/data-table-infinite with PrimeNG Table and PrimeNG Scroller (allows to use both - virtual and infinite scroll features);

✓ Replace pagination-mode-toggle with PrimeNG switch-component
✓ Replace input-fields with PrimeNg input-fields
✓ Replace buttons with PrimeNg buttons


? Remove change detector ref detectChanges, make sure nothing breaks. Replace it with spread operator [...]

## Part 3

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






Add environments for: 
  - local
  - ✓ development
  - testing 
  - staging
  - ✓ production 


Fix design


Switch Unit-test library from Karma + Jasmine to Jest

Cover Users Table with unit-tests 