import { FileInput, FileField, TextInput } from 'react-admin';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import beautify from 'xml-beautifier';
/**
 * Fieldset to upload xml opensearch document
 */
export const UploadOpenSearch: FunctionComponent<any> = () => {
    const form = useForm();
    const { values } = useFormState({ subscription: { values: true } });
    const [lastRequest, setLastRequest] = useState('');
    const [xml, setPreview] = useState('');
    useEffect(() => {
        const request = form.getState().values.opensearch;
        const userInput = form.getState().values.opensearch_upload;
        if (userInput && userInput.src != lastRequest) {
            setLastRequest(userInput.src);
            const reader = new FileReader();
            reader.onload = () =>
                setPreview(beautify(atob(String(reader.result).split('base64,')[1])));
            reader.onerror = console.log.bind(console);
            reader.readAsDataURL(userInput.rawFile);
        } else if (request && request != lastRequest) {
            setLastRequest(request);
            fetch(window.location.protocol + 'api/static/' + request)
                .then((response) => response.text())
                .then((text) => setPreview(beautify(text)));
        } else if (!userInput && !request) {
            setPreview('');
            setLastRequest('');
        }
    }, [values]);
    return (
        <>
            <FileInput source="opensearch_upload" label="Opensearch xml descriptor">
                <FileField source="src" title="title" />
            </FileInput>
            {xml && <pre>{xml}</pre>}
            <TextInput label="" type="hidden" source="opensearch" value="" />
        </>
    );
};

UploadOpenSearch.displayName = 'Upload Open Search';
