# @eeacms/volto-taxonomy

[![Releases](https://img.shields.io/github/v/release/eea/volto-taxonomy)](https://github.com/eea/volto-taxonomy/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-taxonomy%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-taxonomy/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-taxonomy&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-taxonomy)

[Volto](https://github.com/plone/volto) add-on for [Taxonomy Vocabularies](https://github.com/collective/collective.taxonomy#taxonomy-vocabularies)

## Features

Edit [collective.taxonomy](https://github.com/collective/collective.taxonomy#taxonomy-vocabularies) entries via Volto **Site Setup > Taxonomies**:

- add, rename and remove taxonomy entries
- nest entries into a tree, reorder them by drag and drop
- translate entries per language
- validate duplicated ids across collapsed branches before saving

## Compatibility

| Add-on | Volto  |
| ------ | ------ |
| 7.x    | 19.x   |
| 6.x    | 18.x   |

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)
- [collective.taxonomy](https://pypi.org/project/collective.taxonomy/)

### Frontend

- Volto 19

## Installation

Add the add-on to your project and register it:

```bash
pnpm add @eeacms/volto-taxonomy
```

```js
// volto.config.js
const addons = ['@eeacms/volto-taxonomy'];
```

Then install the backend dependencies (Plone 6 / `collective.taxonomy`) and restart the stack.

## Source code and development

The add-on is developed in [eea/volto-taxonomy](https://github.com/eea/volto-taxonomy),
where `DEVELOP.md` explains how to run it locally and `RELEASE.md` how it is released.
The package of a Volto 19 add-on lives in `packages/volto-taxonomy` of that repository.

## License

MIT, European Environment Agency.
