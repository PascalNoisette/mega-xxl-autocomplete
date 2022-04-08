import { TextInput, SelectInput } from 'react-admin';
import { FunctionComponent } from 'react';
/**
 * Fieldset to upload logo
 */
export const Widget: FunctionComponent<any> = () => {
    return (
        <>
            <TextInput source="refresh" />
            <TextInput source="columns" />
            <TextInput multiline source="css" />
            <SelectInput
                source="content"
                choices={[
                    { id: 'html', name: 'HTML' },
                    { id: 'json', name: 'Json' }
                ]}
            />
        </>
    );
};

Widget.displayName = 'Widget controls';
