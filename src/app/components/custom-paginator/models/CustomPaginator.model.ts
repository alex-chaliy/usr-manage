export type PaginatorOutput = {
  offset: number; // `first` in prime-ng, that is actually start-index
  limit: number; // `rows` in prime-ng; that is actually page size, how many items per page
  total: number; // `totalRecords` in prime-ng; total number of instances that are in a table in db

  usePageSizes: boolean; // false by default; if true, page-size select is visible and ready to use
  pageSizes: number[]; // list of pahe sizes for page-size select, default value `[20, 50, 100]`

  page: number; // sequential number of current page

  pages: number; // total number of pages, dependently on `limit` and `total`
  hasPrevPage: boolean; // is there a page before current page
  hasNextPage: boolean; // is there a page after current page
};

export type PageChangeDirection = 'next' | 'prev';

export type PageChangedOutput = PaginatorOutput & {
  changeDirection: PageChangeDirection;
};

export type PageSizeChangedOutput = PaginatorOutput;