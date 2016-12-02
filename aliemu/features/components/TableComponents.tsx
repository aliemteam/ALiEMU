import * as React from 'react';

interface HeaderProps extends React.HTMLProps<HTMLDivElement> {
    cells: {
        content: string
        align: 'left'|'center'|'right';
    }[];
}

interface PagerProps extends React.HTMLProps<HTMLDivElement> {
    totalRows: number;
    visibleRows: number;
    currentPage: number;
    onClick(e: React.MouseEvent<HTMLElement>): void;
}

interface CellProps extends React.HTMLProps<HTMLDivElement> {
    align: 'left'|'center'|'right';
}

interface FlexProps extends React.HTMLProps<HTMLDivElement> {
    amount: 'auto'|number;
}

// Local stylesheets
const styles = {
    flex: {
        container: {
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 10px',
        },
    },
    headerRow: {
        borderBottom: 'solid 1px rgb(238, 238, 238)',
        borderTop: 'solid 1px rgb(238, 238, 238)',
        color: '#555',
        display: 'flex',
        padding: '9px 24px',
    },
    pagination: {
        button: {
            background: '#fff',
            border: '1px solid rgb(0, 146, 224)',
            borderRadius: '2px',
            color: '#0092E0',
            cursor: 'pointer',
            height: '1.5em',
            lineHeight: '1.5em',
            margin: '5px 2.5px',
            textAlign: 'center',
            width: '1.5em',
        },
        pager: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            padding: '2.5px',
        },
    },
    row: {
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        display: 'flex',
        padding: '6px 24px',
    },
};

export const Header = ( props: HeaderProps ) =>
    <div style={styles.headerRow}>
        {props.cells.map((cell, i) => (
            <div
                key={i}
                style={{
                    flex: 1,
                    fontWeight: 'bold',
                    textAlign: cell.align,
                }}
                children={cell.content}
            />
        ))}
    </div>;

export const Pager = (props: PagerProps) =>
    <div className="au-edudash-pager" style={props.style}>
        {
            Array
            .from({length: props.totalRows }, (_k, v) => v)
            .filter((el) => el % props.visibleRows === 0)
            .map((_el, i) => (
                <div
                    key={i}
                    role="button"
                    className={props.currentPage !== i ? 'au-edudash-pager-btn' : 'au-edudash-pager-btn-active'}
                    children={i + 1}
                    data-page={i}
                    onClick={props.onClick}
                />
            ))
        }
    </div>;

export const Cell = ( props: CellProps ) =>
    <div
        style={{
            flex: 1,
            textAlign: props.align,
        }}
        children={props.children}
    />;

export const Flex = ( props: FlexProps ) =>
    <div
        style={{
            alignItems: 'center',
            display: 'flex',
            flex: props.amount,
            justifyContent: 'center',
            padding: '5px 0',
        }}
        children={props.children}
    />;

export const Row = (props) =>
    <div style={styles.row} {...props} />;

export const FilterRow = (props) =>
    <div style={styles.flex.container} {...props} />;
