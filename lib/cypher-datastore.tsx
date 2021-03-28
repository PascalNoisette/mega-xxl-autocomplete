import { FileDataStore, Resource } from '@apidevtools/swagger-express-middleware';
import { createDecipher, createCipher } from 'crypto';

interface ErrorFirstCallback<T> {
    (err: Error, result?: undefined | null): void;
    (err: undefined | null, result: T[]): void;
}

class CypherDataStore extends FileDataStore {
    password: string;

    algorithm: string = 'aes-256-ctr';

    constructor(path: string) {
        super(path);
    }

    getCollection(collection: string, callback: ErrorFirstCallback<Resource>): void {
        return super.getCollection(collection, callback);
    }

    setPassword(customerDefined: string): CypherDataStore {
        this.password = customerDefined;
        return this;
    }

    decypher(text: string): string {
        const decipher = createDecipher(this.algorithm, this.password);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    cypher(text: string): string {
        const cipher = createCipher(this.algorithm, this.password);
        let crypted = cipher.update(JSON.stringify({ credentials: text }), 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    __openDataStore(collection: string, callback: ErrorFirstCallback<Resource>): void {
        return super.__openDataStore(collection, (err: any, rsx?: Resource[]) => {
            rsx.map((element) => {
                if (element.data.encrypted) {
                    const dec = this.decypher(element.data.encrypted);
                    try {
                        delete element.data.encrypted;
                        Object.assign(element.data, JSON.parse(dec));
                    } catch (e) {
                        console.log('Cannot decrypt ' + element.data.app);
                    }
                }
            });
            callback(err, rsx);
        });
    }

    __saveDataStore(
        collection: string,
        resources: Resource[],
        callback: ErrorFirstCallback<Resource>
    ): void {
        resources.forEach((element: Resource) => {
            if (element.data.credentials) {
                const crypted = this.cypher(element.data.credentials);
                element.data.encrypted = crypted;
                delete element.data.credentials;
            }
        });
        super.__saveDataStore(collection, resources, callback);
    }
}

export default CypherDataStore;
