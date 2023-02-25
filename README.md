# panic

[![Types included](https://img.shields.io/badge/Types-included-blue?logo=typescript&style=plastic)](https://www.typescriptlang.org)

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg?logo=law&style=plastic)](https://opensource.org/licenses/MIT)

[![Test](https://github.com/Frank-Mayer/panic/actions/workflows/test.yml/badge.svg)](https://github.com/Frank-Mayer/panic/actions/workflows/test.yml)

[![Lint](https://github.com/Frank-Mayer/panic/actions/workflows/lint.yml/badge.svg)](https://github.com/Frank-Mayer/panic/actions/workflows/lint.yml)

## What is this?

This is a blazingly fast reimplementation of the `Error` class in TypeScript. In most cases, you don't need the call stack of an `Error`. This implementation is a lot faster than the original `Error` class because the collection of the call stack is extremely expensive and `Panic` only collects the call stack when you need it.

It is not possible to get the call stack on demand (when you access the `stack` Property) because the used `Error.captureStackTrace` function captures the current call stack and there is no way to get the call stack of a previous function context. (If you know a way to do this, please let me know.)

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

### What if I need the call stack?

To get the call stack set the `Panic.captureStackTrace` Property to `true`. From now on every `Panic` instance will collect the call stack. This should only be done in development mode.

```TypeScript
import { Panic } from '@frank-mayer/panic';

Panic.captureStackTrace = true;

throw new Panic('Some condition was not met');
```

To get the call stack only for a single `Panic` instance, use the second parameter of the `panic` function.

```TypeScript
import { panic } from '@frank-mayer/panic';

panic('Some condition was not met', true);
```

## Performance tests

### Constructor

| Name        |    Ops/sec | Relative margin of error |
| :---------- | ---------: | -----------------------: |
| new Error() |    403,086 |                   ±5.93% |
| new Panic() | 71,113,873 |                   ±1.92% |

You see, the `Panic` class is over **175 times faster** than the `Error` class!

### throw

| Name              |   Ops/sec | Relative margin of error |
| :---------------- | --------: | -----------------------: |
| throw new Error() |   309,103 |                   ±1.38% |
| panic()           | 5,063,993 |                   ±0.86% |

### throw with captureStackTrace enabled

| Name              | Ops/sec | Relative margin of error |
| :---------------- | ------: | -----------------------: |
| throw new Error() | 232,223 |                   ±0.37% |
| panic()           | 248,450 |                   ±0.72% |
