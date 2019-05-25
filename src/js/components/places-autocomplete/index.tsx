import { useEffect, useRef } from '@wordpress/element';

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

const VALIDATION_MESSAGE = 'Please choose an option from the completion list.';

export default function PlacesAutocomplete({
    options,
    onPlaceChange,
    ...props
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autocomplete = useRef<google.maps.places.Autocomplete>();

    useEffect(() => {
        (async () => {
            await inject(
                `https://maps.googleapis.com/maps/api/js?libraries=places&key=${
                    process.env.GOOGLE_PLACES_KEY
                }`,
            );
            const input = inputRef.current;
            if (input) {
                !props.defaultValue &&
                    input.setCustomValidity(VALIDATION_MESSAGE);
                // eslint-disable-next-line no-undef
                autocomplete.current = new google.maps.places.Autocomplete(
                    input,
                    options,
                );
                autocomplete.current.addListener('place_changed', () => {
                    if (autocomplete.current) {
                        const result = autocomplete.current.getPlace();
                        const isInvalid =
                            result &&
                            Object.keys(result).length === 1 &&
                            result.hasOwnProperty('name');
                        if (inputRef.current) {
                            inputRef.current.setCustomValidity(
                                isInvalid ? VALIDATION_MESSAGE : '',
                            );
                        }
                        onPlaceChange(isInvalid ? undefined : result);
                    }
                });
            }
        })();
        return () => {
            for (const el of document.querySelectorAll('.pac-container')) {
                el.parentElement && el.parentElement.removeChild(el);
            }
        };
    }, []);

    return (
        <Input
            {...props}
            ref={inputRef}
            onChange={e => {
                e.currentTarget.setCustomValidity(VALIDATION_MESSAGE);
                onPlaceChange();
            }}
        />
    );
}
