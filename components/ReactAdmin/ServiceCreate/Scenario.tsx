import {
    FormWithRedirect,
    TabbedFormView,
    FormTab,
    Button,
    Toolbar,
    SaveButton
} from 'react-admin';
import { linkToRecord } from 'ra-core';
import { useHistory } from 'react-router-dom';
import { FunctionComponent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
/**
 * Generic Wizard Generator, equivalent of SimpleForm with tabs
 */
export const Scenario: FunctionComponent<any> = (props) => {
    const [openStates, setOpenStates] = useState([0]);
    const [maxStep, setMaxStep] = useState(0);
    useEffect(() => {
        setMaxStep(openStates.slice(-1)[0]);
    }, [openStates]);

    const findPrevious = (transition) => {
        const current = getTabStep();
        let previous = current;
        for (let i = 0; i < transition.length; i++) {
            if (transition[i] == current) {
                return previous;
            }
            previous = transition[i];
        }
    };
    const getNextTab = () => {
        const searchArray = openStates.slice();
        searchArray.sort().reverse();
        return findPrevious(searchArray);
    };

    const history = useHistory();
    const getTabStep = () => {
        let step = 0;
        if (history.location.pathname.match(/\d/)) {
            step = Number(history.location.pathname.match(/\d/)[0]);
        }
        return step;
    };
    const openTab = (tabId) => (e) => {
        if (e) e.stopPropagation();
        history.push(linkToRecord(props.basePath + '/create', tabId || ''));
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasList, hasEdit, hasShow, hasCreate, ...formViewProps } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { save, ...toolbarProps } = formViewProps;
    return (
        <FormWithRedirect
            {...formViewProps}
            render={(formProps) => <TabbedFormView {...formProps} />}
            toolbar={
                <Toolbar {...toolbarProps}>
                    {getTabStep() > 0 && (
                        <Button label="Previous" onClick={() => history.goBack()} />
                    )}
                    {getTabStep() < maxStep && (
                        <Button
                            label="Next"
                            onClick={() => openTab(getNextTab())(null)}
                        />
                    )}
                    {getTabStep() == maxStep && maxStep != 0 && <SaveButton />}
                </Toolbar>
            }
        >
            {props.steps.map((TagName, index) => {
                return (
                    <FormTab
                        key={index}
                        label={TagName.displayName}
                        className={openStates.indexOf(index) == -1 ? 'hidden-tab' : ''}
                    >
                        <TagName
                            setValidTransition={(valids) =>
                                setOpenStates(
                                    props.steps.reduce((newStates, step, index) => {
                                        if (valids.indexOf(step) != -1) {
                                            newStates.push(index);
                                        }
                                        return newStates;
                                    }, [])
                                )
                            }
                        />
                    </FormTab>
                );
            })}
        </FormWithRedirect>
    );
};

Scenario.propTypes = {
    steps: PropTypes.any,
    basePath: PropTypes.any,
    handleSubmitWithRedirect: PropTypes.any,
    handleSubmit: PropTypes.any,
    invalid: PropTypes.any,
    redirect: PropTypes.any,
    saving: PropTypes.any,
    submitOnEnter: PropTypes.any,
    hasList: PropTypes.any,
    hasEdit: PropTypes.any,
    hasShow: PropTypes.any,
    hasCreate: PropTypes.any
};
