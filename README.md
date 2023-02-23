# panic

[![Types included](https://img.shields.io/badge/Types-included-blue?logo=typescript&style=plastic)](https://www.typescriptlang.org)

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg?logo=law&style=plastic)](https://opensource.org/licenses/MIT)

[![Test](https://github.com/Frank-Mayer/panic/actions/workflows/test.yml/badge.svg)](https://github.com/Frank-Mayer/panic/actions/workflows/test.yml)

[![Lint](https://github.com/Frank-Mayer/panic/actions/workflows/lint.yml/badge.svg)](https://github.com/Frank-Mayer/panic/actions/workflows/lint.yml)

## What is this?

This is a blazingly fast reimplementation of the `Error` class in TypeScript. In most cases, you don't need the call stack of an `Error`. This implementation is a lot faster than the original `Error` class because the collection of the call stack is extremely expensive and `Panic` only collects the call stack when you access its `stack` property.

## Installation

```bash
npm install @frank-mayer/panic
```

## How to use

Use the `panic` function to throw an error.

```TypeScript
import { panic } from '@frank-mayer/panic';

if (someCondition) {
    panic('Some condition was not met');
}
```

Use the `throw` keyword to throw an instance of the `Panic` class.

```TypeScript
import { Panic } from '@frank-mayer/panic';

if (someCondition) {
    throw new Panic('Some condition was not met');
}
```

## Performance tests

### Constructor

| Name        | Ops/sec     | Relative margin of error |
| ----------- | ----------- | ------------------------ |
| new Error() | 231,460     | ±8.64%                   |
| new Panic() | 360,287,200 | ±0.92%                   |

You see, the `Panic` class is over **1500 times faster** than the `Error` class!

### Get call stack

| Name              | Ops/sec | Relative margin of error |
| ----------------- | ------- | ------------------------ |
| new Error().stack | 77,688  | ±0.46%                   |
| new Panic().stack | 71,171  | ±0.33%                   |

Getting the call stack of a `Panic` instance is only 9% slower than getting the call stack of an `Error` instance.
