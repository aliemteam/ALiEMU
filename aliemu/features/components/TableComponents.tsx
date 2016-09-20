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
    onClick();
}

interface CellProps extends React.HTMLProps<HTMLDivElement> {
    align: 'left'|'center'|'right';
}

interface FlexProps extends React.HTMLProps<HTMLDivElement> {
    amount: 'auto'|number;
}


// Local stylesheets
const styles = {
    headerRow: {
        display: 'flex',
        padding: '9px 24px',
        color: '#555',
        borderTop: 'solid 1px rgb(238, 238, 238)',
        borderBottom: 'solid 1px rgb(238, 238, 238)',
    },
    row: {
        display: 'flex',
        padding: '6px 24px',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
    },
    flex: {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: '0 10px',
            alignItems: 'center',
        },
    },
    pagination: {
        pager: {
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            padding: '2.5px',
        },
        button: {
            width: '1.5em',
            height: '1.5em',
            lineHeight: '1.5em',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid rgb(0, 146, 224)',
            borderRadius: '2px',
            color: '#0092E0',
            background: '#fff',
            margin: '5px 2.5px',
        },
    },
};


export const Header = ( props: HeaderProps ) =>
    <div style={styles.headerRow}>
        {props.cells.map((cell, i) =>
            <div
                key={i}
                style={{
                    flex: 1,
                    textAlign: cell.align,
                    fontWeight: 'bold',
                }}
                children={cell.content} />
            )
        }
    </div>;


export const Pager = (props: PagerProps) =>
    <div className='au-edudash-pager' {...props}>
        {
            Array
            .from({length: props.totalRows, }, (_k, v) => v)
            .filter((el) => el % props.visibleRows === 0)
            .map((_el, i) =>
                <div
                    key={i}
                    className={props.currentPage !== i ? 'au-edudash-pager-btn' : 'au-edudash-pager-btn-active'}
                    children={i + 1}
                    onClick={props.onClick.bind(null, {type: 'PAGINATE', page: i})} />
            )
        }
    </div>;

export const Cell = ( props: CellProps ) =>
    <div style={{
            textAlign: props.align,
            flex: 1,
        }}
        {...props} />;


export const Flex = ( props: FlexProps ) =>
    <div style={{
            display: 'flex',
            flex: props.amount,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 0',
        }}
        {...props} />;

export const Row = (props) =>
    <div style={styles.row} {...props} />;

export const FilterRow = (props) =>
    <div style={styles.flex.container} {...props} />;
