import { Create } from 'react-admin';
import { FunctionComponent } from 'react';
import { Scenario } from './ServiceCreate/Scenario';
import { KindOfService } from './ServiceEdit/KindOfService';
import { UploadOpenSearch } from './ServiceEdit/UploadOpenSearch';
import { UrlAndLogo } from './ServiceEdit/UrlAndLogo';
import { Discover } from './ServiceEdit/Discover';
import { SearchField } from './ServiceEdit/SearchField';
/**
 * Show the fielsets within Tabs (Wizard like)
 */
export const ServiceCreate: FunctionComponent<any> = (props) => {
    const steps = [KindOfService, Discover, UrlAndLogo, SearchField, UploadOpenSearch];
    return (
        <Create title="Create a Service" {...props}>
            <Scenario steps={steps} {...props} />
        </Create>
    );
};
