import React, { createRef, PureComponent, RefObject } from 'react';

import inject from 'utils/inject-script';

import Input from 'components/forms/input';

import './places-autocomplete.scss';

export type Result = google.maps.places.PlaceResult;
type Options = google.maps.places.AutocompleteOptions & {
    fields: Array<keyof Result>;
};

interface Props extends Input.Props {
    options?: Options;
    onPlaceChange(result?: Partial<Result>): void;
}

export default class PlacesAutocomplete extends PureComponent<Props> {
    private static readonly VALIDATION_MESSAGE =
        'Please choose an option from the completion list.';

    private autocomplete!: google.maps.places.Autocomplete;
    private inputRef: RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);
        this.inputRef = createRef<HTMLInputElement>();
    }

    async componentDidMount() {
        await inject(
            `https://maps.googleapis.com/maps/api/js?libraries=places&key=${
                process.env.GOOGLE_PLACES_KEY
            }`,
        );
        if (this.inputRef.current) {
            // eslint-disable-next-line no-undef
            this.autocomplete = new google.maps.places.Autocomplete(
                this.inputRef.current,
                this.props.options,
            );
            this.autocomplete.addListener(
                'place_changed',
                this.handlePlaceChange,
            );
            if (!this.props.defaultValue) {
                this.handleChange();
            }
        }
    }

    componentWillUnmount() {
        for (const el of document.querySelectorAll('.pac-container')) {
            el.parentElement && el.parentElement.removeChild(el);
        }
    }

    render(): JSX.Element {
        const { options, onPlaceChange, ...props } = this.props;
        return (
            <Input
                inputRef={this.inputRef}
                onChange={this.handleChange}
                {...props}
            />
        );
    }

    private handleChange = () => {
        // Invalidates the component if user makes any changes to place selected.
        const { current: input } = this.inputRef;
        if (input && input.validity.valid) {
            input.setCustomValidity(PlacesAutocomplete.VALIDATION_MESSAGE);
        }
        this.props.onPlaceChange();
    };

    private handlePlaceChange = (): void => {
        const result = this.autocomplete.getPlace();
        const isInvalid =
            result &&
            Object.keys(result).length === 1 &&
            result.hasOwnProperty('name');
        if (this.inputRef.current) {
            this.inputRef.current.setCustomValidity(
                isInvalid ? PlacesAutocomplete.VALIDATION_MESSAGE : '',
            );
        }
        this.props.onPlaceChange(isInvalid ? undefined : result);
    };
}
