import * as React from 'react';
import { cloneElement, FC } from 'react';
import { useListContext } from 'ra-core';
import PropTypes from 'prop-types';
import { useDatagridStyles, DatagridLoading, DatagridProps } from 'react-admin';

const InlineGrid: FC<DatagridProps & { filter?: (any) => any }> = React.forwardRef(
    (props) => {
        const classes = useDatagridStyles(props);
        const { children, filter } = props;

        const { data, ids, loaded, total } = useListContext(props);

        if (loaded === false) {
            return (
                <DatagridLoading
                    classes={classes}
                    nbChildren={React.Children.count(children)}
                />
            );
        }

        if (loaded && (ids.length === 0 || total === 0)) {
            return null;
        }
        return (
            <div className={props.className}>
                {ids.map(
                    (id, rowIndex) =>
                        (!filter || filter(data[id])) &&
                        React.isValidElement(children) &&
                        cloneElement(children, {
                            key: rowIndex,
                            record: data[id]
                        })
                )}
            </div>
        );
    }
);

InlineGrid.propTypes = {
    children: PropTypes.element,
    filter: PropTypes.func
};

InlineGrid.displayName = 'InlineGrid';

export default InlineGrid;