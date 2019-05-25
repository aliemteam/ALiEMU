import { memo, HTMLProps } from '@wordpress/element';

type Props = HTMLProps<HTMLAnchorElement>;

function Anchor({ children, ...props }: Props) {
    return <a {...props}>{children}</a>;
}
export default memo(Anchor);
