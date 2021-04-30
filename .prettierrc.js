module.exports = {
    tabWidth: 4,
    singleQuote: true,
    printWidth: 140,
    quoteProps: 'consistent',
    overrides: [
        {
            files: ['package.json', 'package-lock.json'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
