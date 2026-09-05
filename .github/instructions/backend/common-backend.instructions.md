# Backend Instractions

# Limiting page size

For any GET request for any entity we MUST limit results size by 100 results for 1 request.
If requested results size more than 100, cap it to 100.

```
const MAXIMUM_PAGE_SIZE = 100;
let offset = req.params.offset;
const isSizeValid: boolean = (req.params.limit - offset) <= MAXIMUM_PAGE_SIZE;

if (!isSizeValid) {
  offset = req.params.limit + MAXIMUM_PAGE_SIZE;
}

// ...here it is your next steps
```
