import restProvider from 'ra-data-simple-rest';
import { DataProvider, CreateParams, UpdateParams } from 'ra-core';
const dataProvider = restProvider(window.location.protocol);

/**
 * Custom dataprovider to handle upload properly
 * All blob are transformed into File ready to be POSTed
 */
const myDataProvider: DataProvider = {
    ...dataProvider,
    update: (resource, params) => {
        return handleUpload(params).then(() => dataProvider.update(resource, params));
    },
    create: (resource, params) => {
        return handleUpload(params).then(() => dataProvider.create(resource, params));
    }
};

const handleUpload: (params: CreateParams | UpdateParams) => Promise<any> = (params) => {
    const files: Promise<any>[] = [];
    Object.keys(params.data).forEach((key) => {
        if (params.data[key].rawFile && params.data[key].rawFile instanceof File) {
            files.push(
                convertFileToBase64(params.data[key]).then(
                    (value) => (params.data[key].base64 = value)
                )
            );
        }
    });

    return Promise.all(files);
};
/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(file.rawFile);
    });

export default myDataProvider;
