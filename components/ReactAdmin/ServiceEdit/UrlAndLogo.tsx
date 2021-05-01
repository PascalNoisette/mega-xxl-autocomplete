import {
    TextInput,
    required,
    ImageInput,
    ImageField,
    FormDataConsumer
} from 'react-admin';
import { FunctionComponent } from 'react';
/**
 * Fieldset to upload logo
 */
export const UrlAndLogo: FunctionComponent<any> = () => {
    return (
        <>
            <ImageInput source="logo_upload" label="Related pictures" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <FormDataConsumer>
                {({ formData }) =>
                    formData.logo && (
                        <img
                            alt={formData.logo_alt}
                            src={'api/static/' + formData.logo}
                        />
                    )
                }
            </FormDataConsumer>
            <TextInput label="" source="logo" type="hidden" />
            <TextInput source="logo_alt" validate={[required()]} />
        </>
    );
};

UrlAndLogo.displayName = 'Url and logo  ';
