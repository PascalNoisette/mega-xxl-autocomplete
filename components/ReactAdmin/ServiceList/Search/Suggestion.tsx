import Loader from 'react-loader-spinner';
import { ReactNode } from 'react';
import Notifier from './Suggestion/Notifier';
/**
 * Show suggestion result in list if any
 */
export default function Suggestion(...args: any[]): ReactNode {
    const { loading, error, data, value, downshiftProps = {}, logo_alt } = args[0];
    const { isOpen, getItemProps } = downshiftProps;
    if (loading) {
        return (
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
        );
    }
    if (error) {
        //to do const notify = useNotify(); notify(error.message, 'error');
        return <Notifier text={logo_alt + ' : ' + error.statusText} />;
    }
    return isOpen && Boolean(value.length) && data.length > 0 ? (
        <ul className="suggest">
            {data.map((suggestion) => (
                <li
                    key={suggestion.value}
                    {...getItemProps({ item: suggestion })}
                    dangerouslySetInnerHTML={{ __html: suggestion.label }}
                ></li>
            ))}
        </ul>
    ) : null;
}

/**
 * 
                  render={Suggestion}
                  
 * Suggestion="suggestion => ({
                    label: `${suggestion._source[service.dataField].replace(/<[^>]*>?/gm, '')} - ${suggestion._source[service.categoryField]}`,
                    value: suggestion._source[service.dataField].replace(/<[^>]*>?/gm, ''),
                    source: suggestion._source  // for onValueSelected to work with renderSuggestion
                  })"
 */
