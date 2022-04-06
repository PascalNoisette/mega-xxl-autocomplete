import Head from 'next/head';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReactAdmin = dynamic(() => import('../components/ReactAdmin'), {
    ssr: false
});
/**
 * This is a single page app, served by NextJs
 *
 * Rely on <ReactAdmin/> to list services
 */
export default function Home(): ReactNode {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <ReactAdmin />
            </main>
        </div>
    );
}
