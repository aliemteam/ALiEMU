import * as React from 'react';

interface HeaderProps extends React.HTMLProps<HTMLDivElement> {
    cells: {
        content: string
        centered: boolean
    }[];
}

interface PagerProps extends React.HTMLProps<HTMLDivElement> {
    totalRows: number;
    visibleRows: number;
    currentPage: number;
    onClick();
}

interface CellProps extends React.HTMLProps<HTMLDivElement> {
    align: 'left' | 'center';
}

interface FlexProps extends React.HTMLProps<HTMLDivElement> {
    amount: '1' | '2';
}

interface ButtonProps extends React.HTMLProps<HTMLAnchorElement> {

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
    headerCell: {
        left: {
            flex: 1,
            fontWeight: 'bold',
        },
        center: {
            flex: 1,
            textAlign: 'center',
            fontWeight: 'bold',
        },
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
        flex1: {
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 0',
        },
        flex2: {
            display: 'flex',
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 0',
        },
    },
    cell: {
        left: {
            flex: 1,
        },
        center: {
            textAlign: 'center',
            flex: 1,
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
    button: {
        color: 'white',
        padding: '5px 15px',
        maxWidth: '300px',
        background: '#34A0DC',
        height: '20px',
        cursor: 'pointer',
        border: 'none',
        marginLeft: '5px',
    },
};


export const Header = ( props: HeaderProps ) =>
    <div style={styles.headerRow}>
        {props.cells.map((cell, i) =>
            <div
                key={i}
                style={ cell.centered ? styles.headerCell.center : styles.headerCell.left }
                children={cell.content} /> )
        }
    </div>;


export const Pager = (props: PagerProps) =>
    <div style={styles.pagination.pager} {...props}>
        {
            Array
            .from({length: props.totalRows, }, (k, v) => v)
            .filter((el) => el % props.visibleRows === 0)
            .map((el, i) =>
                <div
                    key={i}
                    style={
                        props.currentPage !== i
                        ? styles.pagination.button
                        : Object.assign({}, styles.pagination.button, {
                            background: '#0092E0',
                            color: '#fff',
                        })
                    }
                    className={props.currentPage !== i ? 'page-button' : 'page-button active'}
                    children={i + 1}
                    onClick={props.onClick.bind(null, {type: 'PAGINATE', page: i})} />
            )
        }
    </div>;

export const Cell = ( props: CellProps ) =>
    <div
        style={props.align === 'left' ? styles.cell.left : styles.cell.center }
        {...props} />;


export const Flex = ( props: FlexProps ) =>
    <div style={
        props.amount === '1'
        ? styles.flex.flex1
        : styles.flex.flex2
    } {...props} />;

export const Row = (props) =>
    <div style={styles.row} {...props} />;

export const FilterRow = (props) =>
    <div style={styles.flex.container} {...props} />;

export const Button = (props) =>
    <a style={styles.button} {...props} />;
