
/**
 * Takes an Object and returns an array containing the object params that should
 *   be visible on the current page.
 *
 * @param  {Object} rows Any variable that has the Object prototype. The data
 *   for the 'rows' of interest should be contained within child objects of the
 *   'row' object
 * @param  {number} visibleRows Number of rows that should be visible.
 * @param  {number} currentPage Current selected page.
 * @return {string[]} The object keys of the the rows that should be visible.
 */
export default function paginate(rows: Array<any>, visibleRows: number, currentPage: number) {
    return rows.filter((uid, i: number) =>
        (visibleRows * currentPage) <= i && i < (visibleRows * currentPage + visibleRows)
    );
}
