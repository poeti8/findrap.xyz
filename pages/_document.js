import Document, { Head, Main, NextScript } from 'next/document';

import stylesheet from '../styles/style.scss';

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		const { html, head, errorHtml, chunks } = renderPage();
		return { html, head, errorHtml, chunks };
	}

	render() {
		return (
			<html>
				<Head>
					<title>FindRap. Discover the Best Hip-Hop Songs and Albums</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link href="https://fonts.googleapis.com/css?family=Inconsolata:700%7CRaleway:400,800" rel="stylesheet" />
					<link rel="icon" href="/static/favicon.png" />
					<style dangerouslySetInnerHTML={{ __html: stylesheet }} />
				</Head>
				<body>
					<div className="bg"></div>
					<div className="black-gradient"></div>
					<section id="app">
						<Main />
					</section>
					<NextScript />
				</body>
			</html>
		);
	}
}
