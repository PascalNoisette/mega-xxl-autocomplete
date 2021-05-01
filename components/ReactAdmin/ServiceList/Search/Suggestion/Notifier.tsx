import { connect } from 'react-redux';
import { showNotification } from 'react-admin';
/**
 * Hook to show failure message
 */
export default connect(undefined, { showNotification })(
    (props: {
        text: string;
        showNotification: (message: string, type: string) => void;
    }) => {
        props.showNotification(props.text, 'warning');
        return <></>;
    }
);
