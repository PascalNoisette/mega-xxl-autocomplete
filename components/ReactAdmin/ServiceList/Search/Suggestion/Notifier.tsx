import { connect } from 'react-redux';
import { showNotification } from 'react-admin';

export default connect(undefined, { showNotification })(
    (props: {
        text: string;
        showNotification: (message: string, type: string) => void;
    }) => {
        props.showNotification(props.text, 'warning');
        return <></>;
    }
);
