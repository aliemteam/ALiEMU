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

export interface IconProps extends SharedProps {
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

export interface IntentIconProps extends SharedProps {
    /**
     * The icon's intended intent
     */
    intent: Intent;
}

const Icon = (props: IconProps): JSX.Element => {
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

export const IntentIcon = (props: IntentIconProps): JSX.Element => {
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
    return <Icon {...iconProps} color={color[intent]} icon={icon[intent]} />;
};
IntentIcon.defaultProps = { size: 16 };

export default Icon;
