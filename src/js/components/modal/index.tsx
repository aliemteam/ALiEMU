import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';

import Card from 'components/card/';
import styles from './modal.scss';

interface Props {
    closeOnClickOutside?: boolean;
    onClose(): void;
}

export abstract class AbstractModal<P = {}, S = {}> extends PureComponent<
    P & Props,
    S
> {
    private static readonly FOCUSABLE_SELECTORS =
        '[href], input, select, textarea, button';
    private static BODY_OVERFLOW_CLASS = 'overflow-hidden';

    private rootNode: HTMLDivElement;

    private get firstFocusableElement(): HTMLElement | undefined {
        const elements = this.rootNode.querySelectorAll<HTMLElement>(
            AbstractModal.FOCUSABLE_SELECTORS,
        );
        return elements[0];
    }

    private get lastFocusableElement(): HTMLElement | undefined {
        const elements = this.rootNode.querySelectorAll<HTMLElement>(
            AbstractModal.FOCUSABLE_SELECTORS,
        );
        return elements[elements.length - 1];
    }

    constructor(props: P & Props) {
        super(props);
        this.rootNode = document.createElement('div');
    }

    componentDidMount(): void {
        document.body.appendChild(this.rootNode);
        document.body.classList.add(AbstractModal.BODY_OVERFLOW_CLASS);
        const firstElement = this.firstFocusableElement;
        if (firstElement) {
            firstElement.focus();
        }
    }

    componentWillUnmount(): void {
        document.body.removeChild(this.rootNode);
        document.body.classList.remove(AbstractModal.BODY_OVERFLOW_CLASS);
    }

    render(): React.ReactPortal {
        return createPortal(this.renderModal(), this.rootNode);
    }

    protected abstract renderContent(): JSX.Element;

    private renderModal = (): JSX.Element => (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={styles.modal}
            onClick={this.handleOutsideClick}
            onKeyDown={this.handleKeyDown}
        >
            {/* eslint-disable-next-line */}
            <div role="dialog" onClick={this.stopClickPropagation}>
                {this.renderContent()}
            </div>
        </div>
    );

    private handleOutsideClick = () => {
        const { closeOnClickOutside, onClose } = this.props;
        if (closeOnClickOutside) {
            onClose();
        }
    };

    private stopClickPropagation = (e: React.MouseEvent) => {
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

export default class Modal extends AbstractModal {
    protected renderContent = () => <Card>{this.props.children}</Card>;
}
