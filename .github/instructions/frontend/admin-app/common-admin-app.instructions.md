# Common Instructions for Admin Web App

project name 'usr-manage'
────────────────────────────────────────

# Attention
Later 'usr-manage' will be ranamed and placed into sub-repo 'jobbify-io-admin'.
This section (Attention) will be removed after the whole structure will be implemented.
────────────────────────────────────────

## Users Page

The page displays and manages a list of users loaded from a local JSON file.

### INPUT DATA
 The file contains:
- users – a large list, 1000+ users
- dictionaries:
  - positions
  - levels
  - tech
  - employmentTypes
 Users reference dictionary items by ID (for example: positionId, levelId, primaryTechId).  

### FUNCTIONAL REQUIREMENTS

#### 1. APPLICATION SETUP
- Create a new Angular SPA (latest version).
- Use standalone components.
- Load data using HttpClient from /assets/mock_data.json.

────────────────────────────────────────
#### 2. DATA PREPARATION
- Build lookup maps for dictionaries to resolve readable values:
  - position name
  - level name
  - primary technology name
  - employment type name

────────────────────────────────────────
#### 3. USERS TABLE
Display a table with at least the following columns:
- Full name (user.firstName + ' ' + user.lastName)
- Email
- Position
- Level
- Primary technology
- Employment type
- Age
- Monthly salary (EUR)

────────────────────────────────────────
#### 4. FILTERS PANEL (ABOVE THE TABLE)
 
##### TEXT FILTERS 
- Name search (matches first name OR last name, single input)
- Email search
 
Note:
Even though data is local, filtering should be treated as an asynchronous request.


##### MULTI-SELECT FILTERS
Use dropdowns or multi-select controls for:
- Position
- Technology (now it works only for primary technology, but later it will be primary + secondary technologies)
  - A user matches if primary technology OR any secondary technology matches
- Level
- Employment type
 
Rules:
- Any filter dropdown (positions, levels, tech, employmentTypes) doesn't have preselected value by default.
- Every filter dropdown (positions, levels, tech, employmentTypes) has loading state while data is being loaded.
- When filter data options are being loaded, the filter dropdown shows placeholder 'Loading {data_options}...'. Where {data_options} can be: positions, levels, tech, employment types.
- When filter data options are loaded, the filter dropdown shows placeholder 'Select {data_option}...'. Where {data_option} can be: position, level, primary technology, employment type.
- Changing any filter resets pagination or infinite scroll state.

────────────────────────────────────────
#### 5. SORTING
- Sorting by one column at a time.
- Clicking a column header toggles ascending / descending order.
- Must include sorting for:
  - salary
  - age
  - firstName
  - email

────────────────────────────────────────
#### 6. RESULT DISPLAY MODES
Add a UI toggle to switch between two modes.
 
##### MODE A – CLASSIC PAGINATION
- Default page size: 20
- Show:
  - current page
  - total results count
- Previous / Next controls are sufficient.
  - Switching to the next/previous page should not reset filters or sorting.
  - Swithching to the next/previous page should not create data-table flickering or blinking:
    - loading state should be shown, but the current data-table render should remain visible until the new page data is loaded.
- Page size dropdown:
  - Options: 10, 20, 50, 100.
  - 20 is by default.
  - Changing page size resets pagination to the first page.
 
##### MODE B – INFINITE SCROLL
- Load initial 20 users.
- Load next chunk when scrolling near the bottom.
- Prevent duplicate loads while loading.
- Stop loading when no more data is available.
 
Preferred:
- IntersectionObserver sentinel
 
Acceptable:
- Scroll event with throttling


────────────────────────────────────────
#### 7. UX STATES
 - Loading state
 - Empty results state
 - Basic error handling for failed data load
 
Styling can be minimal OR just UI library default components.


────────────────────────────────────────
### TECHNICAL EXPECTATIONS

- State handling and management.
- Combine filters, sorting, and paging in a clean reactive pipeline.
- Avoid heavy logic in templates.
- Clean up subscriptions and observers properly.

────────────────────────────────────────
### DELIVERABLES
- Working Angular application.
- Readable, logically structured code.
- Short README explaining:
  - how to run the application
  - what was implemented

────────────────────────────────────────
### BONUS
- Persist filters and mode in URL query parameters
OR
+++  - Add a small unit test for filtering or sorting logic.










 
