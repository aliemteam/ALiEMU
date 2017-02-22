// tslint:disable export-name
/**
 * Takes an array and returns an array containing the object params that should
 *   be visible on the current page.
 *
 * @param rows Any array of data to be paginated.
 * @param visibleRows Number of rows that should be visible.
 * @param currentPage Current selected page.
 * @return A filtered, paginated array.
 */
export function paginate<T>(rows: T[], visibleRows: number, currentPage: number): T[] {
    return rows.filter((_uid, i: number) => (
        (visibleRows * currentPage) <= i && i < (visibleRows * currentPage + visibleRows)
    ));
}
