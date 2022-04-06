import restProvider from 'ra-data-simple-rest';
import { DataProvider, GetListParams } from 'ra-core';
const dataProvider = restProvider(window.location.protocol);

/**
 * Custom dataprovider to make sure JSON has a data node
 */
const myDataProvider: DataProvider = {
    ...dataProvider,
    // @ts-ignore
    getList: (resource: string, params: GetListParams) => { 
        return dataProvider
            .getList(resource, params)
            .then((result) => {
                if (result.data.constructor.name !== 'Array') {
                    for (const j in result.data) {
                        if (result.data[j].constructor.name === 'Array') {
                            return { data: result.data[j], total: result.data[j].length };
                        }
                        for (const i in result.data[j]) {
                            if (result.data[j][i].constructor.name === 'Array') {
                                return {
                                    data: result.data[j][i],
                                    total: result.data[j][i].length
                                };
                            }
                        }
                    }
                }
                return result;
            })
            .then((result) => {
                result.data = result.data.map((item, id) => {
                    if (!('id' in item)) {
                        item.id = id;
                    }
                    return item;
                });

                return result;
            });
    }
};

export default myDataProvider;
