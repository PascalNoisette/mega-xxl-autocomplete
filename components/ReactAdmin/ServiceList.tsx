import { CreateButton, Toolbar, List } from 'react-admin';
import CreateButtonIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import ControlForm from './ServiceList/ControlForm';
import Search from './ServiceList/Search';
import Dash from './ServiceList/Dash';
import InlineGrid from './ServiceList/InlineGrid';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import { Component, FunctionComponent, useState, useCallback } from 'react';
/**
 * Custom Element to make two Lists
 * Also show toolbar buttons that reveal advanced options
 */
export const ServiceList: FunctionComponent<any> = (props) => {
    const inputsToControl: Component<DataSearchProps>[] = [];
    const [editorMode, setEditorMode] = useState(false);
    const toggleEdit = useCallback(() => {
        setEditorMode((v) => !v);
    }, []);
    const [searchMode, setSearchMode] = useState(false);
    const toggleSearchMode = useCallback(() => {
        setSearchMode((v) => !v);
    }, []);

    return (
        <List
            {...props}
            title="List of posts"
            sort={{ field: 'published_at', order: 'asc' }}
            hasCreate={false}
            exporter={false}
            filter={null}
            actions={false}
        >
            <>
                <Toolbar>
                    {/* Create new service */}
                    <CreateButton className="floatingButton" basePath="services" />
                    {/* Toggle the hidden edit button(s) */}
                    <CreateButton
                        className="RaEditButton floatingButton"
                        label="edit"
                        icon={<CreateButtonIcon />}
                        color="secondary"
                        aria-label="list"
                        onClick={(e) => {
                            toggleEdit();
                            e.preventDefault();
                            return false;
                        }}
                    />
                    {/* Toggle the hidden search form(s) */}
                    <CreateButton
                        className="RaSearchButton floatingButton"
                        label="Advanced"
                        icon={<SearchIcon />}
                        color="default"
                        aria-label="list"
                        onClick={(e) => {
                            toggleSearchMode();
                            e.preventDefault();
                            return false;
                        }}
                    />
                    {/* First List : show all bookmarks */}
                    <InlineGrid>
                        <Dash editorMode={editorMode} record={null} />
                    </InlineGrid>
                </Toolbar>

                <div className={searchMode ? 'active ControlForm' : 'ControlForm'}>
                    {/* Element to control all the other search form siblings */}
                    <ControlForm inputsToControl={inputsToControl} />
                    {/* Second List : show only the service that have a search form */}
                    <InlineGrid
                        className="ControlableForm"
                        filter={(record) => record['kindOfService'] != 'bookmark'}
                    >
                        <Search inputsToControl={inputsToControl} />
                    </InlineGrid>
                </div>
            </>
        </List>
    );
};
