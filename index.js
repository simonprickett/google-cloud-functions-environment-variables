exports.helloEnvVars = (req, res) => {
    res.send(`<DOCTYPE html>
        <html>
            <head>
                <title>Google Cloud Functions Environment Variables Test</title>
            </head>
            <body>
                <h1>Google Cloud Functions Environment Variables Test</h1>
                <table>
                    <tr>
                        <th>NAME</th>
                        <th>VALUE</th>
                    </tr>
                    <tr>
                        <td>SUCH_SECRET</td>
                        <td>${process.env.SUCH_SECRET || 'UNKNOWN'}</td>
                    </tr>
                    <tr>
                        <td>MANY_ENCRYPTS</td>
                        <td>${process.env.MANY_ENCRYPTS || 'UNKNOWN'}</td>
                    </tr>
                    <tr>
                        <td>SO_FINALLY_CAUGHT_UP_WITH_AWS</td>
                        <td>${process.env.SO_FINALLY_CAUGHT_UP_WITH_AWS || 'UNKNOWN'}</td>
                    </tr>
                </table>
                <p><a href="https://github.com/simonprickett/google-cloud-functions-environment-variables" target="_blank">Source code / documentation</a>.</p>
            </body>
        </html>`
    )
}