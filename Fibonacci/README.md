# Fibonacci Generator

A CLI tool that generates Fibonacci sequences, written in Node.js.

## Prerequisites

- [Node.js](https://nodejs.org/) installed

## Running the Project

```bash
node index.js -c <count> [options]
```

## Arguments

| Argument      | Alias | Description                                                                  |
| ------------- | ----- | ---------------------------------------------------------------------------- |
| `--count`     | `-c`  | **Required.** Number of Fibonacci values to generate.                        |
| `--one-line`  |       | Print all numbers on one line, separated by commas.                          |
| `--numbering` |       | Prefix each number with its position in the sequence (e.g. `1:0, 2:1, 3:1`). |
| `--last-only` |       | Print only the last number in the sequence. Must be used with `-c` only.     |
| `--help`      |       | Display help information.                                                    |

## Examples

Print the first 6 Fibonacci numbers, each on a new line:

```bash
node index.js -c 6
```

Print the first 6 numbers on one line:

```bash
node index.js -c 6 --one-line
```

Print the first 6 numbers with position numbering on one line:

```bash
node index.js -c 6 --numbering --one-line
```

Print only the last number in a 10-number sequence:

```bash
node index.js -c 10 --last-only
```

Show help:

```bash
node index.js --help
```
