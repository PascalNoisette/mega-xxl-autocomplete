import { TextInput, BooleanInput } from 'react-admin';
import { FunctionComponent } from 'react';
/**
 * Fieldset to upload logo
 */
export const Meta: FunctionComponent<any> = () => {
    return (
        <>
            <TextInput source="keywords" />
            <BooleanInput source="hidden" />
        </>
    );
};

Meta.displayName = 'Meta';
