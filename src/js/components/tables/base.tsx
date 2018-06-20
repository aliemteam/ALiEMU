import * as React from 'react';

export interface BodyCell {
    key: string | number;
    content: React.ReactNode;
    sortKey?: string | number;
    kind?: NumberConstructor | StringConstructor | DateConstructor;
    rowSpan?: number;
    colSpan?: number;
}

export interface HeaderCell extends BodyCell {
    scope: 'col' | 'row';
    width?: number;
    sortable?: boolean;
}

export type Cell = BodyCell | HeaderCell;

interface BaseRow<T extends BodyCell = Cell> {
    key: string | number;
    cells: T[];
    height?: number;
}

export type Row = BaseRow<Cell>;
export type HeaderRow = BaseRow<HeaderCell>;

export const enum SortOrder {
    ASC = 'ascending',
    DESC = 'descending',
}

// tslint:disable react-unused-props-and-state
interface Props {
    rows: Row[];
}

export default abstract class BaseTable<P = {}, S = {}> extends React.Component<
    Props & P,
    S
> {
    protected renderRow = ({ key, cells, height }: Row): JSX.Element => {
        return (
            <tr key={key} style={{ height }}>
                {cells.map(this.renderCell)}
            </tr>
        );
    };

    protected renderCell = (cell: Cell): JSX.Element => {
        const {
            kind,
            content,
            width,
            sortKey,
            ...props
        } = cell as HeaderCell;
        return this.isHeaderCell(cell) ? (
            <th style={{ width }} {...this.cellKind(kind)} {...props}>
                {cell.content}
            </th>
        ) : (
            <td {...this.cellKind(kind)} {...props}>
                {cell.content}
            </td>
        );
    };

    protected cellKind = (kind: BodyCell['kind']) => ({
        'data-kind':
            // prettier-ignore
            kind === Number ? 'numeric' :
            kind === Date ? 'date' :
            kind === String ? 'string' :
            undefined,
    });

    protected getSortKey = (cell: BodyCell): string | number | {} =>
        cell.sortKey !== undefined
            ? cell.sortKey
            : cell.content
                ? cell.content
                : '';

    private isHeaderCell(cell: Cell): cell is HeaderCell {
        return (cell as HeaderCell).scope !== undefined;
    }
}
