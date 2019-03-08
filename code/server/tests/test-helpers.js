const pgp = require('openpgp');
const pub_key = require('../conf/keys').pub_key;

module.exports.testUser = {"_id":"5c71402a9f80364f33546c95",
                            "userid":"106488054651498694925",
                            "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVsZWN0cHJvamVjdHVzZXJAZ21haWwuY29tIiwidXNlcmlkIjoiMTA2NDg4MDU0NjUxNDk4Njk0OTI1IiwiaWF0IjoxNTUwOTI5NjE4LCJleHAiOjE1NTA5MzMyMTh9.WHfnFTKDFYPPQaAzONkXt7tBu6fbykcA_t63kNdhb6I",
                            "email":"electprojectuser@gmail.com",
                            "photo":"https://lh4.googleusercontent.com/-AOME1-FM4Ik/AAAAAAAAAAI/AAAAAAAAAAA/ACevoQNSLw-ybK3kjvnDWmw7XG9xN-awPg/s96-c/photo.jpg",
                            "fullname":"elect test"}

module.exports.testPollId = "Z7pnj8e";
module.exports.testOption = "Test Option 1";


// module.exports.testPrivKey = ["-----BEGIN PGP PRIVATE KEY BLOCK-----",
// "Version: OpenPGP.js v4.4.7",
// 'Comment: https://openpgpjs.org',
// '',
// 'xcFGBFxzwkYBBACoRgwTbttMFFUIsaMiMoiGx4VXCAS3IAogGsOOEkknSVom',
// 'VrtptQImkUWHrKFiaF7xMNC3aucrXuiQcBJS5AHLueicSLvt4QJYdefkQIXe',
// 'vIm0FpxT/KnnQOyH8E5X2eR2KoSCU0JvGNTbpq+2Z58rjPgDEZPHivYLC34O',
// 'W5jjXwARAQAB/gkDCO9QVFQAzLR24OnQkHEh/B8HhU6IfRlQ31NERgs33Yq/',
// 'Q2V/KPVxcxOoaAVZlnSedrY2loXoauX4X7bq8LK8v/9f8FWkLrJpOLQ7EEJj',
// 'Ow7qYPKJxYHN0+PwZNumNBiN+eDjvVIWuY++gqlzgijYO7Xv1/SlARohw/Y8',
// '1TIC0n0wa1qNEhTprrppiescz9s/73LAg7QJ755b5CuiWu+clpVq59E6CQIi',
// 'MI3pLEEeiHg79qmwfl7tkIJaazl+7U3xaxV5iztMMuYssdSV/bUxkxr6s/Ul',
// 'ekZBq2GKqRhuiK/dmaavLkF+tgbgwQcHltQGCxsnUGTwv2et6nvwQZjWJnjV',
// 'W129QkdxAPgypMDaSSEXDPiRfL6k3UkYijDAXu3rQRtBaEJmrsgWvSJxzPwB',
// 'W3HszFGDUSRIhWdTBXPuo6chBF1rVni/3gogKw1RwNCpenJBh69Zy3yNxKqp',
// '8Illd8FLTqIHXUStmxDjd2cnv+Fivo9nICbNAMK1BBABCAAfBQJcc8JGBgsJ',
// 'BwgDAgQVCAoCAxYCAQIZAQIbAwIeAQAKCRBsYyoqKI4Pn6GKA/4g9LTiSSJi',
// 'vssFxiODVwdPwq2dpPjVQ9tIPTT+hb/AJRMVY2cf1VNN3klGoRXdAf8R3KH5',
// 'K738+ifLsAQzD4nOANxT4NHyCSUbZX37EHvZi4nM5Kfi6TSyWEgb+pIebYvc',
// 'iArnboqlGX6m0Tw8F6nDjbZe1nifofiG6I5azkfzFsfBRgRcc8JGAQQAiLLt',
// 'JcYeW8Y+YkInGWtpAJreWnNLHs/bqFUUO8Ik7wpJoaWbEKX9ezhw7x5v4ZyT',
// 'vFZBja8dddzU6mFXTTafz2NYwNo55jVNw8IZYSz01mMT6uLCeFPhgzQPos5Q',
// 'hE6OUEuKk8XHWSSGyf/U4dYcQh6J6TJFv7xvBCbNBO8gAIEAEQEAAf4JAwjt',
// 'X54goJqOGuD0jKxoQzZs+igghCuIJItBUv4ZbZg1eeiCBvfjFZ/rXFiGlfw2',
// 'mQqF0CAJAdRmWvJi2akB7P9MBOFqR355U7WsOSxSiXdeAXJEQUSNdSPVb6sh',
// 'qKUintiRDe4kBDtgiOrN5FTsqkc3d6wpqko9YGQUNid+zVYAZl6URF1XGfKV',
// 'M9JUvpqYSt/mMpzUJmELc/Fbb9p/t9SIVTVXnQniM34brZCtFVfnS7WfdLOv',
// 'p0ZIEm6ssuAirXuFVvuykV4ZOexszO9yRkfeiXu09SWJ4C8mnaEowAAAgXj1',
// 'bzloLqDNlldAfG96YM13Fz3IDg1pGZ6jATk5AUuhkX99HMqVCKrk6Mr35R68',
// 'VhNBRqYjH90CIlMGuN2vW2tG6YURIJlf+ZX6sKO9LOHpt0P9YoEEprjDbcr3',
// 'wXSxjiZ+DlLBKZmnFo5hzTe5Y8vB6w6VYfWsp/4aXtpiLy20mL9wxSSLNNGV',
// 'vrhEWUk3h7QavyxQwp8EGAEIAAkFAlxzwkYCGwwACgkQbGMqKiiOD58ygAP5',
// 'APU4I9gslBvJfPb0Tn9X8c3mB4L9WnIwtKV+k9UuX0ZBe7fbFjqv6hsjjd/0',
// 'zqdmR1FGMBdCAJ57hYm87j11Y34RZ54Y+YOnVGrPAAlBqcHuhe0Ps398DQF+',
// 'NwowR/XJOHmHc4JU7R6e0NBwNPX4ixzvVwFXkeKvdDnR1z8dMfE=',
// '=Eh3t',
// '-----END PGP PRIVATE KEY BLOCK-----'].join('\r\n');

// module.exports.testPubKey = ['-----BEGIN PGP PUBLIC KEY BLOCK-----', 
// 'Version: OpenPGP.js v4.4.7', 
// 'Comment: https://openpgpjs.org', 
// '',
// 'xo0EXHPCRgEEAKhGDBNu20wUVQixoyIyiIbHhVcIBLcgCiAaw44SSSdJWiZW',
// 'u2m1AiaRRYesoWJoXvEw0Ldq5yte6JBwElLkAcu56JxIu+3hAlh15+RAhd68',
// 'ibQWnFP8qedA7IfwTlfZ5HYqhIJTQm8Y1Numr7ZnnyuM+AMRk8eK9gsLfg5b',
// 'mONfABEBAAHNAMK1BBABCAAfBQJcc8JGBgsJBwgDAgQVCAoCAxYCAQIZAQIb',
// 'AwIeAQAKCRBsYyoqKI4Pn6GKA/4g9LTiSSJivssFxiODVwdPwq2dpPjVQ9tI',
// 'PTT+hb/AJRMVY2cf1VNN3klGoRXdAf8R3KH5K738+ifLsAQzD4nOANxT4NHy',
// 'CSUbZX37EHvZi4nM5Kfi6TSyWEgb+pIebYvciArnboqlGX6m0Tw8F6nDjbZe',
// '1nifofiG6I5azkfzFs6NBFxzwkYBBACIsu0lxh5bxj5iQicZa2kAmt5ac0se',
// 'z9uoVRQ7wiTvCkmhpZsQpf17OHDvHm/hnJO8VkGNrx113NTqYVdNNp/PY1jA',
// '2jnmNU3DwhlhLPTWYxPq4sJ4U+GDNA+izlCETo5QS4qTxcdZJIbJ/9Th1hxC',
// 'HonpMkW/vG8EJs0E7yAAgQARAQABwp8EGAEIAAkFAlxzwkYCGwwACgkQbGMq',
// 'KiiOD58ygAP5APU4I9gslBvJfPb0Tn9X8c3mB4L9WnIwtKV+k9UuX0ZBe7fb',
// 'Fjqv6hsjjd/0zqdmR1FGMBdCAJ57hYm87j11Y34RZ54Y+YOnVGrPAAlBqcHu',
// 'he0Ps398DQF+NwowR/XJOHmHc4JU7R6e0NBwNPX4ixzvVwFXkeKvdDnR1z8d',
// 'MfE=',
// '=QCuH',
// '-----END PGP PUBLIC KEY BLOCK-----'].join('\r\n');

// const testSecureOption = "secureOption1"

// module.exports.encryptTestVote = (option, privKey, pubKey) => {
//     let prKey = privKey;
//     let puKey = pubKey;
//     const sign = async(option, prKey, puKey) => {
//         const privKeyObj = (await pgp.key.readArmored(privKey));
//         await privKeyObj.keys[0].decrypt('oiwerl43ksmpoq5wieurxmzcvnb9843lj3459ks');

//         const options = {
//             message: pgp.message.fromText(option),          // input as Message object
//             privateKeys: privKeyObj.keys[0],  // for signing
//         };
//         const signed = await pgp.sign(options).then((signed) => {
//             return signed;

//         });
//         return signed;
//     }

//     const es = sign().then((signed) => {
//         const signedVote = signed;
//         console.log(signedVote);
//         const encrypt = async(signedVote, pkey, prKey) => {
//             console.log(puKey);
//             const privKeyObj = (await pgp.key.readArmored(privKey));
//             await privKeyObj.keys[0].decrypt('oiwerl43ksmpoq5wieurxmzcvnb9843lj3459ks');
//             const eoptions = {
//                 message: await pgp.message.readArmored(signedVote.data),
//                 publicKeys: (await pgp.key.readArmored(pkey)).keys,
//             };
    
//             const encryptedVote = pgp.encrypt(eoptions).then((ciphertext) => {
//                 console.log(ciphertext);
//                 return ciphertext;
//             });
//             return encryptedVote;
//         }
//         const pub_key = require('../conf/keys').pub_key;
//         console.log(pub_key);
//         const final = encrypt(signedVote, pub_key, prKey).then(res => {
//             console.log("THIS IS THE FINAL MESSAGE", res.data);
//             return res;
//         });
//         return final.data;
//     });
//     console.log("HERE");
//     setTimeout(() => {
//         return es;
//     }, 5000);
    
    
// }

// module.exports.testEncryptedVote = '-----BEGIN PGP MESSAGE-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nwYwDKJOMjhFK7WkBA/0TodxsExbOUN30qM73rNbsfTgmCJmwSg1seWwiLig6\r\nHvVsyeUIEhHjK8/WaexjRYtBVEeGMJrX9Ov80k4k/OnyKCf68U2r+FUf+ypb\r\n/pAT9RhLnDk32j5tSqZ2J816whKAIW2keOFG1ruX4zq2lGrwI/v3tMQNv6xD\r\nDNHP1IUKLtJQATvuTpbsljg8jL7IhHuFo1qiW6I+PXRuSLI87Rk6iGJ5j7pf\r\n2W2k3qYhQtvG/QDrqfs4Yi9uTqVEnbq5o4/Kb34nu5XbYR1NE7t4DKR3ycE=\r\n=dMXM\r\n-----END PGP MESSAGE-----';

module.exports.testSecurePollId = "wH2AtbM";