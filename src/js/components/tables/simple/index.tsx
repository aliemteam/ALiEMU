import * as classNames from 'classnames';
import * as React from 'react';

import BaseTable, {
    HeaderCell,
    HeaderRow,
    Row,
    SortOrder,
} from 'components/tables/base';
import * as styles from './simple-table.scss';

import Card from 'components/card/';
import Pagination from 'components/pagination/';
import Spinner from 'components/spinner/';
import SortIcon from 'components/tables/sort-icon/';
import { SectionHeading } from 'components/typography/';

interface Props {
    /** Whether or not the table should be in a loading state. */
    isLoading?: boolean;
    /** A stateless component to render instead when table is empty. */
    emptyState?: React.SFC;
    /** Whether or not the proviced emptyState should be rendered. */
    isEmpty?: boolean;
    /** True if table should be rendered with `table-layout: fixed`. */
    fixed?: boolean;
    /** Explicit `<thead>` row with sortable headers. */
    header?: HeaderRow;
    /** Set to number `n` to make table paginated at `n` rows. */
    rowsPerPage?: number;
    /** Class name to be added to the container. */
    containerClassName?: string;
    /** Default sort key to sort for sortable tables. */
    defaultSortKey?: string;
    /** Default sort order to sort for sortable tables. */
    defaultSortOrder?: SortOrder;
    /** Caption for the table. */
    caption?: string | ((labelId: string) => JSX.Element);
}

interface State {
    page: number;
    sortOrder: SortOrder;
    sortKey: string;
}

export default class SimpleTable extends BaseTable<Props, State> {
    static defaultProps = {
        rowsPerPage: Infinity,
        defaultSortKey: '',
        defaultSortOrder: SortOrder.ASC,
    };

    state = {
        page: 1,
        sortOrder: this.props.defaultSortOrder!,
        sortKey: this.props.defaultSortKey!,
    };

    handleSortClick = (e: React.MouseEvent<HTMLElement>): void => {
        const { sortable, sortKey } = e.currentTarget.dataset;
        if (!sortable || !sortKey || sortable === 'false') {
            return;
        }
        this.setState(prev => ({
            ...prev,
            sortKey,
            sortOrder:
                sortKey === prev.sortKey
                    ? prev.sortOrder === SortOrder.ASC
                        ? SortOrder.DESC
                        : SortOrder.ASC
                    : SortOrder.ASC,
        }));
    };

    handlePageChange = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const { page } = e.currentTarget.dataset;
        if (!page) {
            return;
        }
        this.setState(prev => ({
            ...prev,
            page: parseInt(page, 10),
        }));
    };

    render(): JSX.Element {
        const {
            containerClassName,
            emptyState: EmptyState,
            fixed,
            isEmpty,
            isLoading,
        } = this.props;

        if (isEmpty && EmptyState && !isLoading) {
            return <EmptyState />;
        }

        const tableClass = classNames('no-inherit', styles.table, {
            [styles.fixed]: fixed,
        });
        const containerClass = classNames(containerClassName, styles.figure);
        const uid = Date.now().toString();

        return (
            <figure className={containerClass}>
                {this.maybeRenderCaption(uid)}
                <Card className={styles.container}>
                    {!isEmpty && (
                        <table className={tableClass} aria-labelledby={uid}>
                            {this.maybeRenderHeader()}
                            {this.renderBody()}
                        </table>
                    )}
                    {isLoading && (
                        <div className={styles.loadingState}>
                            <Spinner size={50} />
                        </div>
                    )}
                </Card>
                {this.maybeRenderPagination()}
            </figure>
        );
    }

    private maybeRenderCaption = (id: string): React.ReactNode => {
        const { caption, isLoading } = this.props;
        if (typeof caption === 'string' && !isLoading) {
            return (
                <figcaption>
                    <SectionHeading id={id}>{caption}</SectionHeading>
                </figcaption>
            );
        }
        if (typeof caption === 'function' && !isLoading) {
            return <figcaption>{caption(id)}</figcaption>;
        }
        return null;
    };

    private maybeRenderPagination = (): React.ReactNode => {
        const rowsPerPage = this.props.rowsPerPage!;
        const { page } = this.state;
        const numRows = this.props.rows.length;
        if (rowsPerPage > numRows) {
            return null;
        }
        return (
            <Pagination
                align="right"
                value={page}
                total={Math.ceil(numRows / rowsPerPage)}
                onChange={this.handlePageChange}
            />
        );
    };

    private maybeRenderHeader = (): React.ReactNode => {
        const { header } = this.props;
        if (!header) {
            return null;
        }
        const { height, cells } = header;
        return (
            <thead>
                <tr style={{ height }}>{cells.map(this.renderHeaderCell)}</tr>
            </thead>
        );
    };

    private maybeSortRows = (rows: Row[]): Row[] =>
        this.state.sortKey ? rows.sort(this.sortRows) : rows;

    private renderBody = (): JSX.Element => {
        const { header, rows } = this.props;
        const rowsPerPage = this.props.rowsPerPage!;
        if (header) {
            const { page } = this.state;
            const startIndex = (page - 1) * rowsPerPage || 0;
            return (
                <tbody>
                    {this.maybeSortRows([...rows])
                        .slice(startIndex, startIndex + rowsPerPage)
                        .map(this.renderRow)}
                </tbody>
            );
        }
        return <>{rows.map(this.renderRow)}</>;
    };

    private renderHeaderCell = (cell: HeaderCell): JSX.Element => {
        const { content, width, kind, sortable, ...props } = cell;
        const { sortKey, sortOrder } = this.state;
        const style = {
            width,
            cursor: sortable ? 'pointer' : 'default',
        };
        return (
            <th
                aria-sort={
                    sortable && sortKey === props.key ? sortOrder : undefined
                }
                style={style}
                data-sort-key={props.key}
                data-sortable={sortable}
                onClick={this.handleSortClick}
                {...this.cellKind(kind)}
                {...props}
            >
                <span>{content}</span>
                {sortable && (
                    <SortIcon
                        order={this.state.sortOrder}
                        active={this.state.sortKey === props.key}
                    />
                )}
            </th>
        );
    };

    private sortRows = (a: Row, b: Row): number => {
        const { sortKey, sortOrder } = this.state;
        const { cells } = this.props.header!;
        const sortIndex = cells.findIndex(
            cell => cell.key === sortKey && cell.sortable === true,
        );

        if (!a.cells[sortIndex] || a.cells.length !== b.cells.length) {
            return 0;
        }

        const left = this.getSortKey(a.cells[sortIndex]);
        const right = this.getSortKey(b.cells[sortIndex]);
        const order = sortOrder === SortOrder.ASC ? 1 : -1;

        // prettier-ignore
        return order * (
            left < right ? -1 :
            left > right ?  1 :
            0
        );
    };
}
