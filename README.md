# fetch-instagram

[![CircleCI](https://circleci.com/gh/glennreyes/fetch-instagram.svg?style=shield)](https://circleci.com/gh/glennreyes/fetch-instagram)

A lightweight and universal Instagram API client for Node and your browser.

## Installation & Usage

Install via npm or yarn:

```sh
npm install fetch-instagram --save
# or via yarn
yarn add fetch-instagram
```

Create an instance with your [Instagram access token](https://www.instagram.com/developer/authentication):

```js
import ig from 'fetch-instagram';

const instagram = ig({
  accessToken: '1234567890.12345ab.1234567890abcdef1234567890abcdef',
});
```

Simple fetch of your user data and media:

```js
// https://api.instagram.com/v1/users/self
const users = instagram.users();

users.then(res => console.log(res));
// {
//   "data": {
//     "id": "1234567890",
//     "username": "my_user",
//     "profile_picture": "https://scontent.cdninstagram.com/..../file.jpg",
//     "full_name": "My Name",
//     "bio": "My Bio",
//     "website": "https://mysite.com/",
//     "counts": {
//       "media": 143,
//       "follows": 143,
//       "followed_by": 143
//     }
//   },
//   "meta": { "code":200 }
// }

// https://api.instagram.com/v1/users/self/media/recent
const media = instagram.media();
users.then(res => console.log(res));
// {
//   "pagination": {},
//   "data": [
//     {
//       "id":"1234567890123456789_1234567890",
//       "user": { ... },
//       "images": {
//         "thumbnail": { ... },
//         "low_resolution": { ... },
//         "standard_resolution": { ... }
//       },
//       "created_time": "1234567890",
//       "caption": {
//         "id":"12345678901234567890",
//         "text": "My text",
//         "created_time": "1234567890",
//         "from": { ... }
//       },
//       "user_has_liked": false,
//       "likes": { ... },
//       "tags": [ ... ],
//       "filter": "Normal",
//       "comments": { ... },
//       "type": "image",
//       "link": "https://www.instagram.com/p/12345abcdef/",
//       "location": null,
//       "attribution": null,
//       "users_in_photo": [ ... ]
//     },
//     ...
//   ],
//   "meta":{ "code":200 }
// }
```

## API

### `ig()`
```js
import ig from 'fetch-instagram';

ig(options: {
  accessToken: string
});
```

### `users()`

```js
import { users } from 'fetch-instagram';

users(options: {
  accessToken: string, // Not needed if used as ig().user()
  id: string, // To specify Instagram user-id
});
```

### `media()`

```js
import { media } from 'fetch-instagram';

media(options: {
  accessToken: string, // Not needed if used as ig().media()
  id: string, // To specify Instagram user-id
  size: number, // Media count limit
  type: 'recent'|'liked', // Media sort order
});
```

## License

Licensed under the MIT License, Copyright © 2017 Glenn Reyes. See [LICENSE](./LICENSE) for more information.
