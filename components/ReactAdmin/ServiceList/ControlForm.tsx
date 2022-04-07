import { FunctionComponent, Component, ChangeEvent, useState, useEffect } from 'react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import Loader from 'react-loader-spinner';
import PropTypes from 'prop-types';
/**
 * Show a main input text field.
 * Keep an 'ref' towards all input siblings to perform the same search
 * accross everybody
 */
const ControlForm: FunctionComponent<{
    inputsToControl: Component<DataSearchProps>[];
    searchMode: boolean;
    hasChildren: boolean;
}> = (props) => {
    const [loading, isLoading] = useState(null);
    const [value, setValue] = useState('');

    useEffect(() => {
        updateChildren();
    }, [value]);

    const showLoader = () => {
        if (loading) {
            clearTimeout(loading);
        }
        isLoading(setTimeout(() => isLoading(null), 1500));
    };

    /**
     * State "isOpen" is lost on focus elsewhere
     */
    const updateChildren = () => {
        props.inputsToControl.forEach((e) => {
            if (e) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                e.setValue(value);
                e.setState({
                    isOpen: true
                });
            }
        });
    };

    return (
        !props.searchMode && props.hasChildren && (
            <form className="ControlFormInput">
                <input
                    placeholder="Search..."
                    type="text"
                    value={value}
                    onChange={(event: ChangeEvent<{ value: string }>) => {
                        setValue(event.target.value);
                        showLoader();
                    }}
                    onFocus={() => {
                        setTimeout(updateChildren, 100);
                    }}
                />
                {loading && (
                    <div className="MainLoader">
                        <Loader type="Puff" color="#00BFFF" height={100} width={100} />
                    </div>
                )}
            </form>
        )
    );
};

ControlForm.propTypes = {
    inputsToControl: PropTypes.any,
    searchMode: PropTypes.any
};

export default ControlForm;
