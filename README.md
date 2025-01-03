# vite-plugin-good-news [![npm](https://img.shields.io/npm/v/vite-plugin-good-news.svg)](https://www.npmjs.com/package/vite-plugin-good-news) [![Download](https://img.shields.io/npm/dm/vite-plugin-good-news)](https://www.npmjs.com/package/vite-plugin-good-news)

Good news!

Vite error messages will no longer be annoying!

## Install

Using npm:

```shell
npm install vite-plugin-good-news --save-dev
```

## Usage

Create a `vite.config.js` configuration file and import the plugin:

```js
import goodNews from 'vite-plugin-good-news'

export default {
  plugins: [
    goodNews()
    //...
  ]
  // ...
}
```

## Options

### `music`

```ts
type Music = boolean
```

Whether to play music

### `newsType`

```ts
type NewsType = 'good' | 'sad'
```

Use good news or sad news background

### Default

```js
{
  music: true,
  newsType: 'good'
}
```

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024-present, XunJiJiang
