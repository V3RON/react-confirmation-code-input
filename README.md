<h1 align="center">
    🔐 react-confirmation-code-input
</h1>
<h3 align="center">
    One input for every code
</h3>
<p align="center">
    <a href="https://github.com/gatsbyjs/gatsby/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="react-confirmation-code-input is released under the MIT license." />
    </a>
  <a href="https://circleci.com/gh/V3RON/react-confirmation-code-input">
    <img src="https://circleci.com/gh/V3RON/react-confirmation-code-input.svg?style=shield" alt="CircleCI build status." />
  </a>
  <a href="https://www.npmjs.com/package/react-confirmation-code-input">
    <img src="https://img.shields.io/npm/v/react-confirmation-code-input.svg" alt="NPM package version." />
  </a>
  <a href="https://codecov.io/gh/V3RON/react-confirmation-code-input">
    <img src="https://codecov.io/gh/V3RON/react-confirmation-code-input/branch/master/graph/badge.svg?token=2ED9YLSKUD" />
  </a>
</p>

# 📦 How to use?

1. **Install package using your favourite tool.**

```shell
yarn i react-confirmation-code-input
npm i react-confirmation-code-input --save
```

2. **Import ConfirmationCodeInput from this package**

```js
import { ConfirmationCodeInput } from 'react-confirmation-code-input';
```

# 🔧 Props

| Property               | Type   | Description                                                 |
| :--------------------- | :----- | :-----------------------------------------------------------|
| fields                 | number | The number of chars in the  code.                           |
| value                  | string | Sets the value of the input.                                |
| onChange               | func   | Called when user changes value of the input.                |
| className              | string | Sets CSS class of root element.                             |
| disabled               | bool   | Makes all children disabled.                                |
| regex                  | string | Makes sure all chars typed are creating matching string     |

# 📝 License

Licensed under the MIT License.
