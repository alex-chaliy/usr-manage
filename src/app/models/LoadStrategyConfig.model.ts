/** 
  @param keepPage - means dont reset page number to 1 and keep current page number
  @param keepRenderUntilChanged - dont hide current render while new data chunk is being loaded
  @param sumChunk - `sumChunk = true` means dont rewrite data-array with a new data chunk,
  but keep it and add the loaded data chunk to the existed data-array.
  Needed for Infinite Scroll.
  `sumChunk = false` - rewrite existed data-array with a new chunk.
  Needed for Classic Pagination.
  `keepPage = true` + `sumChunk = true` guarantees proper data chunk will be loaded while Infinite Scroll.
*/
export interface LoadStrategyConfig {
  keepPage: boolean;
  keepRenderUntilChanged: boolean;
  sumChunk: boolean;
}
