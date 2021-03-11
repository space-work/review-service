const fs = require('fs');
const path = require('path');
const faker = require('faker');
const command = require('./command');
const uuid = require('uuid').v4;

const iterations = 39;

for (let k = 0; k <= iterations; k++) {
    let authorsQuery = '';
    let reviewsQuery = '';

    for (let i = 1 + k * 250000; i <= 250000 + k * 250000; i++) {
        let first = faker.name.firstName();
        let last = faker.name.lastName();
        const email = faker.internet.email();
        const hash = faker.internet.password();

        while (first.indexOf("'") === 1) {
            first = faker.name.firstName();
        }

        while (last.indexOf("'") === 1) {
            last = faker.name.lastName();
        }

        const authorId = uuid();

        if (i === 250000 + iterations * 250000) {
            authorsQuery += `
${authorId}	${first}	${last}	${email}	${hash}
\\.`;
        } else {
            authorsQuery += `
${authorId}	${first}	${last}	${email}	${hash}`;
        }

        const numberOfReviews = Math.floor(Math.random() * 12);
        for (let j = 1; j <= numberOfReviews; j++) {
            const reviewId = uuid();
            const rating = Math.floor(Math.random() * 5) + 1; // number between 1 and 5

            if (j === numberOfReviews && i === 250000 + iterations * 250000) {
                reviewsQuery += `
${reviewId}	${faker.date.between(new Date('2021-01-01'), new Date()).toISOString()}	${rating}	${faker.lorem.sentence()}	${
                    Math.floor(Math.random() * 10000000) + 1
                }	${authorId}
\\.
`;
            } else {
                reviewsQuery += `
${reviewId}	${faker.date.between(new Date('2021-04-01'), new Date()).toISOString()}	${rating}	${faker.lorem.sentence()}	${
                    Math.floor(Math.random() * 10000000) + 1
                }	${authorId}`;
            }
        }
    }

    fs.writeFile(path.join(__dirname, '..', 'dumps', `authorsBody${k}.sql`), authorsQuery, (err) => {
        if (err) throw err;
    });

    fs.writeFile(path.join(__dirname, '..', 'dumps', `reviewsBody${k}.sql`), reviewsQuery, (err) => {
        if (err) throw err;
    });
}

command(iterations);
