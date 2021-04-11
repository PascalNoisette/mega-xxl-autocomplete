import { CreateButton, Toolbar, List } from 'react-admin';
import CreateButtonIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import ControlForm from './ServiceList/ControlForm';
import Search from './ServiceList/Search';
import Dash from './ServiceList/Dash';
import InlineGrid from './ServiceList/InlineGrid';
import { FunctionComponent } from 'react';

export const ServiceList: FunctionComponent<any> = (props) => {
    const inputsToControl: [] = [];
    return (
        <>
            <Toolbar>
                <CreateButton basePath="services" />
                <CreateButton
                    className="RaEditButton"
                    label="edit"
                    icon={<CreateButtonIcon />}
                    color="secondary"
                    aria-label="list"
                    onClick={(e) => {
                        Array.from(
                            document.getElementsByClassName('toggleEdit')
                        ).forEach((element) => element.classList.toggle('active'));
                        e.preventDefault();
                        return false;
                    }}
                />
                <CreateButton
                    className="RaSearchButton"
                    label="Advanced"
                    icon={<SearchIcon />}
                    color="default"
                    aria-label="list"
                    onClick={(e) => {
                        document
                            .getElementsByClassName('ControlForm')[0]
                            .classList.toggle('active');
                        e.preventDefault();
                        return false;
                    }}
                />
            </Toolbar>
            <List
                {...props}
                title="List of posts"
                sort={{ field: 'published_at' }}
                hasCreate={false}
                exporter={false}
                filter={null}
                actions={false}
            >
                <>
                    <InlineGrid>
                        <Dash record={null} />
                    </InlineGrid>
                    <div className="ControlForm">
                        <ControlForm inputsToControl={inputsToControl} />
                        <InlineGrid
                            className="ControlableForm"
                            filter={(record) => record['has_search']}
                        >
                            <Search inputsToControl={inputsToControl} />
                        </InlineGrid>
                    </div>
                </>
            </List>
        </>
    );
};
