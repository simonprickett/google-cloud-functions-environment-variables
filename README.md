# Google Cloud Functions Environment Variables Test

Test Google Cloud Function that uses environment variables (recently added functionality on Google Cloud).

Also be sure to check out the [Google documentation for this](https://cloud.google.com/functions/docs/env-var).

## Setup

Ensure that you have Google's `gcloud` commands installed and updated to the latest, including the `beta` commands.  Also ensure that you have a Google Cloud project set up with Cloud Functions enabled.

In Terminal, clone this repo and `cd` to the folder containing it.

In `index.js`, we have a function `helloEnvVars`.  This expects to be able to access three environment variables named:

* `SUCH_SECRET`
* `MANY_ENCRYPTS`
* `SO_FINALLY_CAUGHT_UP_WITH_AWS`

and will display their names and values in a HTML table.  As you can see, the value for each environment variable is retrieved in the same was as any other Node.js code:

```
process.env.VAR_NAME
```

## Deployment

This is a HTTP function so deploy as follows:

```
gcloud functions deploy helloEnvVars --trigger-http --project <Your Google Cloud Project ID>
```

Then test by pointing the browser at the URL that `gcloud` output at the end of the deployment, which looks something like this:

```
https://<region>-<projectId>.cloudfunctions.net/helloEnvVars
```

Note that all three environment variables show `UNKNOWN` for their value.

## Setting Environment Variables

Google provides two ways to supply values for the environment variables.

### Individually from the Command Line

Supply name/value pairs when deploying the function e.g. (note we have to use `beta` for this):

```
gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars SUCH_SECRET=hello --project <Your Google Cloud Project ID>
```

### Multiple from the Command Line

Multiple values can be provided together, note also have to be careful about quoting and escaping values:

```
gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars SUCH_SECRET="Ssssh it's a secret",MANY_ENCRYPTS="rTgHi0444452\!",SO_FINALLY_CAUGHT_UP_WITH_AWS="Oh yes" --project <Your Google Cloud Project ID>
```

### From a YAML File

Environment variables can also be set via a YAML file (which will overwrite all existing variable values and unset any that aren't listed in the file).

Example `env.yaml`:

```
SUCH_SECRET: Ssssh it's a secret
MANY_ENCRYPTS: rTgHi0444452!
SO_FINALLY_CAUGHT_UP_WITH_AWS: Oh yes
```

Deploy as follows (note we have to use `beta` for this):

```
gcloud beta functions deploy helloEnvVars --trigger-http --env-vars-file env.yaml --project <Your Google Cloud Project ID>
```

Then refresh the browser to see the new values.

## Updating Environment Variables

To change the value of a deployed environment variable use `--update-env-vars`, which works like `--set-env-vars`:

```
gcloud beta functions deploy helloEnvVars --trigger-http --update-env-vars SUCH_SECRET="Updated",MANY_ENCRYPTS="Also updated",SO_FINALLY_CAUGHT_UP_WITH_AWS="Updated too" --project <Your Google Cloud Project ID>
```

(You can also use `--set-env-vars` to overwrite the values of existing environment variables and `--update-env-vars` to add set values for new environment values, so theese seem pretty interchangeable `¯\_(ツ)_/¯`).

## Deleting Environment Variables

Environment variables are deleted as follows:

### Selective Delete

(Again note we have to use `beta` for this):

```
gcloud beta functions deploy helloEnvVars --trigger-http --remove-env-vars SUCH_SECRET,MANY_ENCRYPTS --project <Your Google Cloud Project ID>
```

### Remove All

(Again note we have to use `beta` for this):

```
gcloud beta functions deploy helloEnvVars --trigger-http --clear-env-vars --project <Your Google Cloud Project ID>
```

## Notes

* Environment variables are scoped by function, so are not shared between functions - you need to add separate environment variables for each function even if they are deployed together and/or exist in the same source code file
* The maximum allowable size for environment variables is 32kb per function
* You should probably add any YAML files that you use to store environment variable values in to your project's `.gitignore` file as you likely don't want these adding to source control!
* A deployment failure will not update any environment variables, only a completely successful deployment updates environment variables

## Gotchas

Don't forget to quote and escape values when using `--set-env-vars` or `--update-env-vars`:

```
gcloud beta functions deploy helloEnvVars --trigger-http --set-env-vars SUCH_SECRET="Ssssh it's a secret",MANY_ENCRYPTS="rTgHi0444452\!",SO_FINALLY_CAUGHT_UP_WITH_AWS="Oh yes" --project <Your Google Cloud Project ID>
```

When deploying environment variables in a YAML file, be careful of values that can be coerced to `boolean` or `int` types by the YAML parser that Google uses, e.g.:

```
SO_FINALLY_CAUGHT_UP_WITH_AWS: true
```

These cause deployment errors:

```
ERROR: gcloud crashed (ValidationError): Expected type <type 'unicode'> for field value, found True (type <type 'bool'>)
```

Workaround is to make the value a string:

```
SO_FINALLY_CAUGHT_UP_WITH_AWS: "true"
```

The same applies for numeric values, for example:

```
MANY_ENCRYPTS: 12
```

will error on deploy, but:

```
MANY_ENCRYPTS: "12"
``` 

will not.