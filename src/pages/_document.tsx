import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Recursive:wght,CASL,MONO@300..700,1,1&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-white dark:bg-dark dark:text-gray-300">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
