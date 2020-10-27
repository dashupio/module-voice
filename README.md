Dashup Module URL
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-url.svg)](https://github.com/dashup/module-url/releases/latest)
=====

A module for url on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This url module adds urls functionality to Dashup pages:

```json
{
  "url" : "https://dashup.io", 
  "key" : "[dashup module key here]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-url .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-url`