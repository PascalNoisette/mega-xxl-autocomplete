import {
    Edit,
    SimpleForm,
    TextInput,
    Toolbar,
    ListButton,
    SaveButton,
    DeleteButton
} from 'react-admin';
import { FunctionComponent, Fragment } from 'react';
import { KindOfService } from './ServiceEdit/KindOfService';
import { UploadOpenSearch } from './ServiceEdit/UploadOpenSearch';
import { UrlAndLogo } from './ServiceEdit/UrlAndLogo';
import { Discover } from './ServiceEdit/Discover';
import { SearchField } from './ServiceEdit/SearchField';
import PropTypes from 'prop-types';

const ServiceTitle = (record) => {
    return <span>Service {record ? `"${record.title}"` : ''}</span>;
};

const EditToolbar = (toolbarProps) => (
    <Toolbar {...toolbarProps}>
        <ListButton label="Return to list" {...toolbarProps} />
        <SaveButton />
        <DeleteButton />
    </Toolbar>
);
/**
 * Show all the fielsets in the same edit page in a very SimpleForm
 */
export const ServiceEdit: FunctionComponent<any> = (props) => {
    const steps = [KindOfService, Discover, UrlAndLogo, SearchField, UploadOpenSearch];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasList, hasEdit, hasShow, hasCreate, ...formViewProps } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { save, mutationMode, ...toolbarProps } = formViewProps;
    return (
        <>
            <EditToolbar toolbarProps={toolbarProps} />
            <Edit title={<ServiceTitle />} {...props}>
                <SimpleForm toolbar={<EditToolbar toolbarProps={toolbarProps} />}>
                    <TextInput disabled source="id" />
                    {steps.map((TagName, index) => (
                        <Fragment key={index}>
                            <h2>{TagName.displayName}</h2>
                            <TagName setValidTransition={() => 0} />
                        </Fragment>
                    ))}
                </SimpleForm>
            </Edit>
        </>
    );
};

ServiceEdit.propTypes = {
    hasList: PropTypes.any,
    hasEdit: PropTypes.any,
    hasShow: PropTypes.any,
    hasCreate: PropTypes.any
};
