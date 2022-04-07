import { TextInput } from 'react-admin';
import { FunctionComponent } from 'react';
/**
 * Fieldset to upload logo
 */
export const Meta: FunctionComponent<any> = () => {
    return (
        <>
            <TextInput source="keywords" />
        </>
    );
};

Meta.displayName = 'Meta';
