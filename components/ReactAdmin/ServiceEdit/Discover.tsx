import { TextInput, required, Button } from 'react-admin';
import { FunctionComponent } from 'react';
import { useForm } from 'react-final-form';
export const Discover: FunctionComponent<any> = () => {
    const form = useForm();
    return (
        <>
            <TextInput source="nice_url" validate={[required()]} />
            <Button
                label="Auto discover url"
                onClick={() => {
                    fetch(window.location.protocol + '/api/discover', {
                        method: 'POST',
                        body: JSON.stringify(form.getState().values)
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            Object.keys(data).forEach((key) =>
                                form.change(key, data[key])
                            );
                        });
                }}
            />
        </>
    );
};
Discover.displayName = 'Discover';
