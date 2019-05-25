import { memo, useMemo, useRef, useState } from '@wordpress/element';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

import Card from 'components/card';
import Pagination from 'components/pagination';
import Spinner from 'components/spinner';
import { SectionHeading } from 'components/typography/headings';

import SortIcon from './sort-icon';
import styles from './table.scss';

namespace Table {
    interface Cell {
        content: React.ReactNode;
        key: string;
        colSpan?: number;
        kind?: NumberConstructor | StringConstructor | DateConstructor;
        rowSpan?: number;
    }

    export interface BodyCell extends Cell {
        sortKey?: string | number;
    }

    export interface HeaderCell extends Cell {
        scope: 'col' | 'row';
        sortKey?: never;
        sortable?: boolean;
        width?: number;
    }

    interface BaseRow<T> {
        key: string | number;
        cells: T[];
        height?: number;
    }
    export type BodyRow = BaseRow<BodyCell>;
    export type HeaderRow = BaseRow<HeaderCell>;

    export interface Props {
        /** Caption for the table. */
        caption?: string | ((labelId: string) => JSX.Element);
        /** Class name to be added to the container. */
        containerClassName?: string;
        /** Default sort key to sort for sortable tables. */
        defaultSortKey?: string;
        /** Default sort order to sort for sortable tables. */
        defaultSortOrder?: 'ascending' | 'descending';
        /** A stateless component to render instead when table is empty. */
        emptyState?: React.SFC;
        /** Explicit `<thead>` row with sortable headers. */
        header?: HeaderRow;
        /** Whether or not the proviced emptyState should be rendered. */
        isEmpty?: boolean;
        /** True if table should be rendered with `table-layout: fixed`. */
        isFixed?: boolean;
        /** Whether or not the table should be in a loading state. */
        isLoading?: boolean;
        /** Set to number `n` to make table paginated at `n` rows. */
        rowsPerPage?: number;
        rows: BodyRow[];
    }
}
const Table = memo(function({
    caption,
    containerClassName,
    defaultSortKey = '',
    defaultSortOrder = 'ascending',
    emptyState: EmptyState,
    isFixed,
    header,
    isEmpty,
    isLoading,
    rowsPerPage = Infinity,
    rows,
}: Table.Props) {
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    const [sortKey, setSortKey] = useState(defaultSortKey);
    const id = useRef(uniqueId('table-'));

    const sortedRows = useMemo(() => {
        if (!header) {
            return [...rows];
        }
        const sortIndex = header.cells.findIndex(cell => cell.key === sortKey);
        if (sortIndex === -1) {
            return [...rows];
        }
        return [...rows].sort((a, b) => {
            const leftCell = a.cells[sortIndex] || {};
            const rightCell = b.cells[sortIndex] || {};
            const left = leftCell.sortKey || leftCell.content || '';
            const right = rightCell.sortKey || rightCell.content || '';
            const order = sortOrder === 'ascending' ? 1 : -1;
            // prettier-ignore
            return order * (
                left < right ? -1 :
                left > right ?  1 :
                0
            );
        });
    }, [header, rows, sortOrder, sortKey]);

    if (isEmpty && EmptyState && !isLoading) {
        return <EmptyState />;
    }

    return (
        <figure className={classNames(containerClassName, styles.figure)}>
            {typeof caption === 'function' && (
                <figcaption>{caption(id.current)}</figcaption>
            )}
            {typeof caption === 'string' && (
                <figcaption>
                    <SectionHeading id={id.current}>{caption}</SectionHeading>
                </figcaption>
            )}
            <Card className={styles.container}>
                {!isEmpty && (
                    <table
                        aria-labelledby={id.current}
                        className={classNames('no-inherit', styles.table, {
                            [styles.fixed]: isFixed,
                        })}
                    >
                        {header && (
                            <thead>
                                <tr style={{ height: header.height }}>
                                    {header.cells.map(({ key, ...cell }) => (
                                        <TH
                                            {...cell}
                                            key={key}
                                            isActive={sortKey === key}
                                            sortKey={key}
                                            sortOrder={sortOrder}
                                            onClick={() => {
                                                if (sortKey === key) {
                                                    return setSortOrder(
                                                        sortOrder ===
                                                            'ascending'
                                                            ? 'descending'
                                                            : 'ascending',
                                                    );
                                                }
                                                setSortKey(key);
                                                setSortOrder(defaultSortOrder);
                                            }}
                                        />
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <TBody
                            currentPage={page}
                            rows={sortedRows}
                            rowsPerPage={rowsPerPage}
                        />
                    </table>
                )}
                {isLoading && (
                    <div className={styles.loadingState}>
                        <Spinner size={50} />
                    </div>
                )}
            </Card>
            {rowsPerPage < rows.length && (
                <Pagination
                    align="right"
                    total={Math.ceil(rows.length / rowsPerPage)}
                    value={page}
                    onChange={p => setPage(p)}
                />
            )}
        </figure>
    );
});
Table.displayName = 'Table';
export default Table;

interface THProps extends Omit<Table.HeaderCell, 'key' | 'sortKey'> {
    isActive: boolean;
    sortKey: string;
    sortOrder: 'ascending' | 'descending';
    onClick(key: string): void;
}
const TH = memo(
    ({
        content,
        isActive,
        sortKey,
        kind,
        sortOrder,
        sortable,
        width,
        onClick,
        ...props
    }: THProps) => {
        if (typeof content === 'string') {
            content = <span>{content}</span>;
        }
        if (sortable) {
            return (
                <th
                    aria-sort={isActive ? sortOrder : undefined}
                    data-kind={kind ? kind.name : undefined}
                    style={{ width, cursor: 'pointer' }}
                    onClick={() => onClick(sortKey)}
                    {...props}
                >
                    {content}
                    <SortIcon active={isActive} order={sortOrder} />
                </th>
            );
        }
        return (
            <th
                data-kind={kind ? kind.name : undefined}
                style={{ width }}
                {...props}
            >
                {content}
            </th>
        );
    },
);
TH.displayName = 'TH';

interface TBodyProps {
    currentPage: number;
    rows: Table.BodyRow[];
    rowsPerPage: number;
}
const TBody = memo(({ currentPage, rows, rowsPerPage }: TBodyProps) => {
    const startIndex = (currentPage - 1) * rowsPerPage || 0;
    return (
        <tbody>
            {rows
                .slice(startIndex, startIndex + rowsPerPage)
                .map(({ cells, height, key }) => (
                    <tr key={key} style={{ height }}>
                        {cells.map(
                            ({ content, key, kind, sortKey, ...cell }) => (
                                <td
                                    key={key}
                                    data-kind={kind ? kind.name : undefined}
                                    {...cell}
                                >
                                    {content}
                                </td>
                            ),
                        )}
                    </tr>
                ))}
        </tbody>
    );
});
TBody.displayName = 'TBody';
