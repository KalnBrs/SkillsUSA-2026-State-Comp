function genFib(n) {
  if (n <= 0) return [];
  if (n <= 1) return [1];
  
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib
}

// Get the CLI args
const args = process.argv.slice(2);

// Help argument
if (args.includes("--help")) {
  if (args.length == 1) {
    console.log(`
Help for Fibonacci Generator:

--help: prints help 

--count | -c: Calculate to this many place. IE: 0, 1, 1, 2, 3, 5 would be the result of -c 6

--one-line: Prints all the numbers on one line, seperated by commas. Without this option, each number in the sequence will be printed on a new line.

--numbering: Preface each number in this sequence with it's placement. IE: for "-c 6 --numbering --one-line" you will get this "1:0, 2:1, 3:1, 4:2, 5:3, 6:5" where the first number is the count and the second is the Fib sequence. Note: This should work with all other arguments.

--last-only: prints only the last number in the sequence 
      `);
  } else {
    console.error("You can only have one argument with --help")
  }

  process.exit(0);
}

let count = 0;
const indexes = [args.indexOf("-c"), args.indexOf("--count")]
if (indexes[0] != -1 || indexes[1] != -1) {
  if (indexes[0] != -1 && indexes[1] != -1) {
    console.error("The program only takes one count argument")
    process.exit(1);
  }

  if (indexes[0] != -1 && Number.isInteger(parseInt(args[indexes[0]+1]))) {
    countIdx = indexes[0] + 1;
    count = args[countIdx]
  } else if (indexes[1] != -1 && Number.isInteger(parseInt(args[indexes[1]+1]))) {
    countIdx = indexes[1] + 1;
    count = args[countIdx]
  } else {
    console.error("You must define a count after the -c or --count")
  }

  const fibArr = genFib(count)

  if (args.includes("--last-only")) {
    if (args.length == 3) {
      console.log(fibArr.at(-1))
    } else {
      console.error("You can only have -c and --count with --last-only")
    }
    process.exit(0)
  }

  let returnStr = ""
  for (let i = 1; i <= count; i++) {
    if (args.includes("--one-line")) {
      if (args.includes("--numbering")) {
        if (i == count) returnStr += `${i}:${fibArr[i-1]} `
        else returnStr += `${i}:${fibArr[i-1]}, `
      } else {
        if (i == count) returnStr += `${fibArr[i-1]} `
        else returnStr += `${fibArr[i-1]}, `
      }
    } else {
      if (args.includes("--numbering")) {
        if (i == count) console.log(`${i}:${fibArr[i-1]} `);
        else console.log(`${i}:${fibArr[i-1]} `);
      } else {
        console.log(`${fibArr[i-1]} `);
      }
    }
  }
  console.log(returnStr)
} else {
  console.error("The program requires that you specify a count ")
}


