# volto-taxonomy

[![Releases](https://img.shields.io/github/v/release/eea/volto-taxonomy)](https://github.com/eea/volto-taxonomy/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-taxonomy%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-taxonomy/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-taxonomy%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-taxonomy/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy&branch=develop)

[Volto](https://github.com/plone/volto) add-on for [Taxonomy Vocabularies](https://github.com/collective/collective.taxonomy#taxonomy-vocabularies)

## Features

Edit [collective.taxonomy](https://github.com/collective/collective.taxonomy#taxonomy-vocabularies) entries via Volto **Site Setup > Taxonomies**

## Dependencies

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)
- [collective.taxonomy](https://pypi.org/project/collective.taxonomy/)

### Frontend

- [Volto](https://github.com/plone/volto)

## Getting started

### Try volto-taxonomy with Docker

      git clone https://github.com/eea/volto-taxonomy.git
      cd volto-taxonomy
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-taxonomy to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-taxonomy": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-taxonomy'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

   For a legacy Volto 17 project, install the package with `yarn` and restart the frontend as usual.

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-taxonomy/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-taxonomy/blob/master/DEVELOP.md).

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-taxonomy/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
