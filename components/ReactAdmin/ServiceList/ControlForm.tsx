import { Component, ChangeEvent, ReactNode } from 'react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
class ControlForm extends Component<
    { inputsToControl: Component<DataSearchProps>[] },
    { value: string }
> {
    constructor(props: { inputsToControl: [] }) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<{ value: string }>): void {
        this.setState({ value: event.target.value });
        this.props.inputsToControl.forEach((e) => {
            if (e) {
                e.setState({
                    isOpen: true
                });
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                e.setValue(event.target.value);
            }
        });
    }

    render(): ReactNode {
        return (
            <form className="ControlFormInput">
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
}

export default ControlForm;
