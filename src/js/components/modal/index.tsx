import { createPortal, useEffect, useRef } from '@wordpress/element';

import styles from './modal.scss';

const FOCUSABLE_ELEMENT_SELECTOR = [
    '[contenteditable]:not([contenteditable="false"])',
    '[href]',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls],video[controls]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
].join(',');

interface Props {
    closeOnClickOutside?: boolean;
    children: React.ReactNode;
    onClose(): void;
}

function Modal({ children, onClose, ...props }: Props) {
    const modalRoot = useRef(document.createElement('div'));

    useEffect(() => {
        document.body.appendChild(modalRoot.current);
        document.body.classList.add(styles.fixed);
        const focusable = modalRoot.current.querySelector<HTMLElement>(
            FOCUSABLE_ELEMENT_SELECTOR,
        );
        if (focusable) {
            focusable.focus();
        }

        return () => {
            document.body.removeChild(modalRoot.current);
            document.body.classList.remove(styles.fixed);
        };
    }, []);

    return createPortal(
        <div
            className={styles.modal}
            role="presentation"
            onClick={e => {
                e.stopPropagation();
                props.closeOnClickOutside && onClose();
            }}
        >
            <div role="dialog">
                <div
                    role="presentation"
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => {
                        switch (e.key) {
                            case 'Tab':
                                return shouldPreventTab(
                                    modalRoot.current,
                                    e.shiftKey,
                                )
                                    ? e.preventDefault()
                                    : void 0;
                            case 'Escape':
                                return onClose();
                        }
                    }}
                >
                    {children}
                </div>
            </div>
        </div>,
        modalRoot.current,
    );
}
export default Modal;

function shouldPreventTab(modalRoot: HTMLElement, isReverse: boolean): boolean {
    const { activeElement } = document;
    const focusable = modalRoot.querySelectorAll<HTMLElement>(
        FOCUSABLE_ELEMENT_SELECTOR,
    );
    if (focusable.length === 0) {
        return true;
    }
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    if (isReverse && activeElement === firstElement) {
        lastElement.focus();
        return true;
    }
    if (!isReverse && activeElement === lastElement) {
        firstElement.focus();
        return true;
    }
    return false;
}
