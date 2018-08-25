import React from 'react';
import { createPortal } from 'react-dom';

import Card from 'components/card/';
import styles from './modal.scss';

interface Props {
    closeOnClickOutside?: boolean;
    onClose(): void;
}

export default class Modal extends React.PureComponent<Props> {
    private static readonly FOCUSABLE_SELECTORS =
        '[href], input, select, textarea, button';
    private rootNode: HTMLDivElement;

    private get firstFocusableElement(): HTMLElement | undefined {
        const elements = this.rootNode.querySelectorAll<HTMLElement>(
            Modal.FOCUSABLE_SELECTORS,
        );
        return elements[0];
    }

    private get lastFocusableElement(): HTMLElement | undefined {
        const elements = this.rootNode.querySelectorAll<HTMLElement>(
            Modal.FOCUSABLE_SELECTORS,
        );
        return elements[elements.length - 1];
    }

    constructor(props: Props) {
        super(props);
        this.rootNode = document.createElement('div');
    }

    componentDidMount(): void {
        document.body.appendChild(this.rootNode);
        const firstElement = this.firstFocusableElement;
        if (firstElement) {
            firstElement.focus();
        }
    }

    componentWillUnmount(): void {
        document.body.removeChild(this.rootNode);
    }

    render(): React.ReactPortal {
        return createPortal(this.modal(), this.rootNode);
    }

    private modal = (): JSX.Element => (
        <div
            role="dialog"
            className={styles.modal}
            onClick={this.handleOutsideClick}
            onKeyDown={this.handleKeyDown}
        >
            <Card onClick={this.stopClickPropagation}>
                {this.props.children}
            </Card>
        </div>
    );

    private handleOutsideClick = () => {
        const { closeOnClickOutside, onClose } = this.props;
        if (closeOnClickOutside) {
            onClose();
        }
    };

    private stopClickPropagation = (e: React.MouseEvent<any>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    };

    private handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Tab':
                if (this.handleTab(e.shiftKey)) {
                    e.preventDefault();
                }
                return;
            case 'Escape':
                return this.props.onClose();
            default:
                return;
        }
    };

    private handleTab = (reverseOrder: boolean): boolean => {
        const firstElement = this.firstFocusableElement;
        const lastElement = this.lastFocusableElement;
        const { activeElement } = document;
        if (!firstElement || !lastElement) {
            return true;
        }
        if (reverseOrder && activeElement === firstElement) {
            lastElement.focus();
            return true;
        } else if (!reverseOrder && activeElement === lastElement) {
            firstElement.focus();
            return true;
        }
        return false;
    };
}
