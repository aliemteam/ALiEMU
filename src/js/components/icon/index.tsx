import classNames from 'classnames';
import React from 'react';

import { Intent } from 'utils/constants';

import * as colors from 'css/_colors.scss';

type IntentMapper = { readonly [k in Intent]: string };

interface SharedProps {
    /**
     * Size of icon in px.
     *
     * @default 18
     */
    size?: number;

    /**
     * An optional class name for the icon
     */
    className?: string;

    /**
     * This component doesn't support children
     */
    children?: never;
}

interface IProps extends SharedProps {
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
     * Icon fill color.
     */
    color?: string;
}

interface IIProps extends SharedProps {
    /**
     * The icon's intended intent
     */
    intent: Intent;
}

const Icon = (props: IProps): JSX.Element => {
    const { className, color, icon, size } = props;
    const style = {
        color,
        fontSize: size,
    };
    const cls = classNames('material-icons', className);
    return (
        <i className={cls} style={style}>
            {icon}
        </i>
    );
};
Icon.defaultProps = { size: 16 };

const IntentIcon = (props: IIProps): JSX.Element => {
    const { intent, ...iconProps } = props;
    const icon: IntentMapper = {
        danger: 'error',
        primary: 'info',
        secondary: 'info',
        success: 'check_circle',
        warning: 'warning',
    };
    const color: IntentMapper = {
        danger: colors.intentDanger,
        primary: colors.intentPrimary,
        secondary: colors.intentSecondary,
        success: colors.intentSuccess,
        warning: colors.intentWarning,
    };
    return <Icon {...iconProps} icon={icon[intent]} color={color[intent]} />;
};
IntentIcon.defaultProps = { size: 16 };

export { IntentIcon, IProps as IconProps, IIProps as IntentIconProps };
export default Icon;
