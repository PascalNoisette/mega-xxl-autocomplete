import * as React from 'react';
import { cloneElement, FC } from 'react';
import { useListContext } from 'ra-core';
import PropTypes from 'prop-types';
import { useDatagridStyles, DatagridLoading, DatagridProps } from 'react-admin';
/**
 * Trivial inline flex list of all endpoint that allow search
 */
const InlineGrid: FC<
    DatagridProps & { filter?: (any) => any; className?: string }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = React.forwardRef((props, _ref) => {
    const classes = useDatagridStyles(props);
    const { children, className } = props;
    const filter = (item) => {
        try {
            let filter = JSON.parse(
                '' +
                    new URLSearchParams(window.location.hash).get(
                        '#/api/swagger/services?filter'
                    )
            );
            if (typeof filter == 'undefined' || !filter) {
                filter = { hidden: '!true' };
            }
            for (const [key, value] of Object.entries<string>(filter)) {
                const contains =
                    ('' + item[key]).split(',').indexOf(value.replace('!', '')) != -1;
                const needed = !value.startsWith('!');
                if (needed ? !contains : contains) {
                    return false;
                }
            }
        } catch (e) {
            console.error(e);
        }
        return !props.filter || props.filter(item);
    };

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
        <div className={className}>
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
});

InlineGrid.propTypes = {
    children: PropTypes.element,
    filter: PropTypes.func,
    className: PropTypes.string
};

InlineGrid.displayName = 'InlineGrid';

export default InlineGrid;
