// TODO: remove all of the shitty comments, and move needed and actual information to specs
// BUT actual and in-use `@param` statements should stay here,
// you can dub them in specs

/** 
  @param keepOffset - means dont reset offset number to 0 and keep current offset number
  @param sumChunk - `sumChunk = true` means dont rewrite data-array with a new data chunk,
  but keep it and add the loaded data chunk to the existed data-array.
  Needed for Infinite Scroll.
  `sumChunk = false` - rewrite existed data-array with a new chunk.
  Needed for Classic Pagination.
  `keepOffset = true` + `sumChunk = true` guarantees proper data chunk will be loaded while Infinite Scroll.
  // @param keepRenderUntilChanged - dont hide current render while new data chunk is being loaded
*/
export interface LoadStrategyConfig {
  keepOffset?: boolean;
  sumChunk?: boolean;
  // keepRenderUntilChanged?: boolean; // removed from usage

  // `hideUntilChanged` - probably create this option, it might be helpfull in future,
  // to combine it with [hidden] directive,
  // so a data-table ui will be hidden, but not removed from DOM,
  // and we will avoid side-effects occured when data-table appears in DOM again and triggers `(onLazyLoad)` event again
}
