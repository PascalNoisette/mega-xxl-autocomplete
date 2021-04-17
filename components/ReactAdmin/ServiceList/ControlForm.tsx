import { Component, ChangeEvent, ReactNode } from 'react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import Loader from 'react-loader-spinner';
class ControlForm extends Component<
    { inputsToControl: Component<DataSearchProps>[] },
    { value: string }
> {
    loader: NodeJS.Timeout = null;

    constructor(props: { inputsToControl: [] }) {
        super(props);
        this.state = { value: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: ChangeEvent<{ value: string }>): void {
        document.getElementsByClassName('MainLoader')[0].classList.add('active');
        if (this.loader) {
            clearTimeout(this.loader);
        }
        this.loader = setTimeout(
            () =>
                document
                    .getElementsByClassName('MainLoader')[0]
                    .classList.remove('active'),
            500
        );
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

    /**
     * State "isOpen" is lost on focus elsewhere
     */
    handleFocus(): void {
        setTimeout(() => {
            this.props.inputsToControl.forEach((e) => {
                if (e) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    e.setValue(this.state.value);
                    e.setState({
                        isOpen: true
                    });
                }
            });
        }, 100); // this resolve after the focus finishes to bubble on the wrong area
    }

    render(): ReactNode {
        return (
            <form className="ControlFormInput">
                <input
                    placeholder="Search..."
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus.bind(this)}
                />
                <div className="MainLoader">
                    <Loader type="Puff" color="#00BFFF" height={100} width={100} />
                </div>
            </form>
        );
    }
}

export default ControlForm;
