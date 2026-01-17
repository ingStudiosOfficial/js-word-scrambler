import clipboard from 'clipboardy';

const [ ,, ...args ] = process.argv;

const wordFromArg = parseSentence(args);
const options = args;

const scrambledWord = scramble(wordFromArg.split(''));

console.log('Word scrambled:', scrambledWord);

if (options.length === 0) process.exit(0);

if (options.includes('-c')) {
    await copyToClipboard(scrambledWord);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function scramble(wordToScramble) {
    if (!wordToScramble || wordToScramble.length === 0) {
        process.exit(1);
    }

    for (let i = 0; i < wordToScramble.length; i++) {
        const randomIndex = getRandomInt(0, wordToScramble.length);
        const wordAtIndex = wordToScramble[randomIndex];
        wordToScramble[randomIndex] = wordToScramble[i];
        wordToScramble[i] = wordAtIndex;
    }

    return wordToScramble.join('');
}

async function copyToClipboard(word) {
    try {
        await clipboard.write(word);
        console.log(`Successfully copied '${word}' to clipboard.`);
    } catch (error) {
        process.exit(1);
    }
}

function replaceLastOccurrence(originalString, find, replace) {
    const lastIndex = originalString.lastIndexOf(find);

    if (lastIndex === -1) {
        return originalString;
    }

    const partBefore = originalString.slice(0, lastIndex);
    const partAfter = originalString.slice(lastIndex + find.length);

    return partBefore + replace + partAfter;
}

function parseSentence(allArgs) {
    const sentence = [];

    if (!allArgs[0]) return '';

    if (allArgs[0].includes('\'')) {
        sentence.push(allArgs[0].replace('\'', ''));
    } else {
        return allArgs[0];
    }

    let index = 1;

    while (index < allArgs.length) {
        if (allArgs[index].includes('\'')) {
            sentence.push(replaceLastOccurrence(allArgs[index], '\'', ''));
            return sentence.join(' ');
        } else {
            sentence.push(allArgs[index]);
        }

        index++;
    }

    return sentence.join(' ');
}