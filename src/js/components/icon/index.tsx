import * as React from 'react';

interface Props {
    /**
     * Id of material icon to use.
     *
     * See output of following command for full list:
     *
     *     curl -s https://material.io/tools/icons/static/data.json |
     *          jq '.categories | map( .icons | map (.id)) | flatten | sort | .[]'
     *
     */
    icon: string;

    /**
     * Size of icon in px.
     *
     * @default 18
     */
    size?: number;

    /**
     * Icon fill color.
     */
    color?: string;

    /**
     * This component doesn't support children
     */
    children?: never;
}

export default class Icon extends React.PureComponent<Props> {
    static defaultProps = {
        size: 18,
    };

    render(): JSX.Element {
        const { color, icon, size } = this.props;
        const style = {
            color,
            fontSize: size,
        };
        return (
            <i className="material-icons" style={style}>
                {icon}
            </i>
        );
    }
}
