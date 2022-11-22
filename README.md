## Conference steps

## Project setup

1. Generate a Firebase project
2. In the same time, show round StartUI, already generated (on commit #7a2108c39d0f712e5d35e875fbc2f0933e476f83)
3. Show Firebase menus and features around 
4. Create the Database (before saving the configuration!)
5. Checkout to the `conference-setup` branch containing the updated StartUI repo, without firebase code

## User authentication

1. Add firebase configuration json in constants/firebase.ts, don't forget to add `!getApps().length`
2. Import the configuration in `Providers.tsx`
3. Go to the `PageRegister.tsx` page, delete the useCreateAccount hook and create a createAccount function
   1. This function will create a firebase account with email / password, in Firebase Authentication system
   2. At the moment, don't create the user in Database
   3. Don't forget to call the setIsSuccess method
   4. Test and show that the user has been created in firebase
4. Go in `LoginForm.tsx`, and create a `login` method, that will allow to connect. Don't forget to call the onSuccess method. (Spoiler alert, it won't do anything)
5. Go back to the register form to add the user creation in database
6. Go to the login form and add the user retrieving. Don't forget to call the `useAuthContext.updateUser` method.

## Avatar upload
1. Create the `handleImageUpload` function handling upload and progress
2. Create the `fileUploadProgress` state and use it in upload helper
3. In `handleUploadSuccess` callback, get download URL and don't forget to call `setIsSuccess(true)` to go to next page

## Chat
1. Complete the `joinRoom` function that will write to `/rooms/room-1/users/${user.uid}` and call it in useEffect that depends on user
2. Complete the `handleSendMessage` function that will write to `/rooms/room-1/messages`
3. Complete the `handleNewMessages` function that will read with `onChildAdded` function.
4. Show that we need to unsubscribe! (and reset messages to empty array)
5. Load users in `handleNewUsers` and don't forget to unsubscribe

## Moderation
1. Create a function in the `functions/index.js` file, to remove delete messages containing insults.
2. Show that it's not working, because we used the `onChildAdded` function and not `onChildUpdated`
3. Add the listener to `onChildUpdated` and put the logic in common in a function

## What about the security?
1. Everyone can write to any user's data:
```
curl -X PUT 'https://fir-messagingtest-9565d-default-rtdb.europe-west1.firebasedatabase.app/users/2puMIwfonzNdJq8BJf7EnlYh3Ox2.json' -d '{ "avatarUrl": "https://firebasestorage.googleapis.com/v0/b/fir-messagingtest-9565d.appspot.com/o/users%2F2puMIwfonzNdJq8BJf7EnlYh3Ox2%2Favatar.jpg?alt=media&token=d70d8efd-eac5-47cb-9f5d-388428944bcb", "email": "q+8@bearstudio.fr", "uid": "2puMIwfonzNdJq8BJf7EnlYh3Ox2", "username": "Quentin" }'
```
2. Update rules by explaining each one:
```
{
  "rules": {
    "users": {
      "$uid": {
        ".write": "$uid === auth.uid && newData.exists() && (!data.exists() || data.child('uid').val() === newData.child('uid').val())",
        ".read": true
      }
    },
    "rooms": {
      "$roomId": {
        "users": {
          "$uid": {   
          	".read": true,
        		".write": "$uid === auth.uid && newData.exists() && (!data.exists() || (data.child('email').val() === newData.child('email').val() && data.child('uuid').val() === newData.child('uuid').val()))",
          }
        }, 
        "messages": {
          ".read": true,
          "$messageId": {   
        		".write": "newData.exists() && (!data.exists() || (data.child('author').child('uid').val() === newData.child('author').child('uid').val() && newData.child('author').child('uid').val() === auth.uid))",
          }
        }
      }
    }
  }
}
```
3. Add the admin field manually for a user, and explain why it's not secured by security rules
4. Secure it by adding `data.child('isAdmin').val() === newData.child('isAdmin').val()`. Don't forget parenthesis
5. Test with the following request. Don't forget to get a new token by uncommenting the code in `AuthContext.tsx`
```
curl -X PUT 'https://fir-messagingtest-9565d-default-rtdb.europe-west1.firebasedatabase.app/users/2puMIwfonzNdJq8BJf7EnlYh3Ox2.json?auth=<token>' -d '{ "avatarUrl": "https://firebasestorage.googleapis.com/v0/b/fir-messagingtest-9565d.appspot.com/o/users%2F2puMIwfonzNdJq8BJf7EnlYh3Ox2%2Favatar.jpg?alt=media&token=d70d8efd-eac5-47cb-9f5d-388428944bcb", "email": "q+8@bearstudio.fr", "uid": "2puMIwfonzNdJq8BJf7EnlYh3Ox2", "username": "QuentinEdited", "isAdmin": true }'
```
6. Do the same with the storage rules
```
match /{allPaths=**} {
  allow read;
}
match /users/{userUid}/{allImages=**} {
  allow write: if request.auth != null && request.auth.uid == userUid;
}
```

## Extras
1. Add a scheduled function to delete old messages
2. Deploy to Vercel

<h1 align="center"><img src="assets/start-ui-web.svg" alt="Start UI Web" width="300" /></h1>

[![Discord](https://img.shields.io/discord/452798408491663361)](https://go.bearstudio.fr/discord)

🚀 Start UI <small>[web]</small> is an opinionated frontend starter repository created & maintained by the [BearStudio Team](https://www.bearstudio.fr/team) and other contributors.
It represents our team's up-to-date stack that we use when creating web apps for our clients.

## Getting Started

```bash
npx create-start-ui@latest --web myApp
```
That will scaffold a new folder with the latest version of 🚀 Start UI <small>[web]</small> 🎉

Then just go to the created folder and start the dev server.

```bash
cd myApp
yarn dev
```

## Technology

- 🟦 [TypeScript](https://www.typescriptlang.org/)
- ⚛️ [React](https://reactjs.org/)
- ▲ [NextJS](https://nextjs.org/) (with [Static Export](https://nextjs.org/docs/advanced-features/static-html-export))
- 📕 [Storybook](https://storybook.js.org/)
- ⚛️ [React Router](https://reactrouter.com/)
- ⚡️ [Chakra UI](https://chakra-ui.com/)
- ⚛️ [React Query](https://react-query.tanstack.com/)
- 🐜 [Formiz](https://formiz-react.com/)
- 💥 [React Error Boundary](https://github.com/bvaughn/react-error-boundary)
- ⭐️ [React Icons](https://react-icons.github.io/react-icons/)
- 🌍 [React i18next](https://react.i18next.com/)
- 🔽 [React Select](https://react-select.com/)
- 🔢 [React Currency Input Field](https://github.com/cchanxzy/react-currency-input-field)
- ↔ [Axios](https://github.com/axios/axios)
- 📅 [Day.js](https://day.js.org/)
- 👮 [Cypress](https://www.cypress.io/)

👉 [Technology Choices](#technology-choices)

ℹ️ API calls are mapped on a [JHipster](https://www.jhipster.tech/) backend application.

## Features

- Reponsive layout / navigation.
- Sign / Sign Up / Password recovery screens.
- Account profile / Change Password screens.
- Users management admin screens (CRUD).
- Multi-languages (English & French built-in).
- Custom Chakra UI theme with preview of customized components in Storybook.
- Extra UI components with Storybook documentation.
- Fields components for Formiz.
- Dark mode support with Storybook toggle.
- App version & Environment name in the UI.
- API Schema documentation via [Swagger UI React](https://github.com/swagger-api/swagger-ui).
- API Mocking with persisting state via [MirageJS](https://miragejs.com/).

## Installation

```bash
yarn install
yarn build
```

## Development

```bash
yarn dev
```

### Storybook

```bash
yarn storybook
```

### Update theme typing

When adding or updating theme components, component variations, sizes, colors and other theme foundations, you can extend the internal theme typings to provide nice autocomplete.

Just run the following command after updating the theme:

```bash
yarn theme:generate-typing
```

### Generate custom icons components from svg files

Put the custom svg files into the `src/components/Icons/svg-sources` folder and then run the following command:

```bash
yarn theme:generate-icons
```

> ⚠️ All svg icons should be svg files prefixed by `icon-` (example: `icon-externel-link`) with **24x24px** size, only **one shape** and **filled with `#000` color** (will be replaced by `currentColor`).


### Development with [MirageJS](https://miragejs.com/) (mock)

**This is the default behavior.**

Do not set the `NEXT_PUBLIC_API_BASE_URL` variable in the `.env` file at the root of the project.

### Development with a [JHipster](https://www.jhipster.tech/) backend

Create a `.env` file at the root of the project with the following content:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Show hint on development environments

Setup the `NEXT_PUBLIC_DEV_ENV_NAME` env variable with the name of the environment.

```
NEXT_PUBLIC_DEV_ENV_NAME=staging
NEXT_PUBLIC_DEV_ENV_COLOR_SCHEME=teal
```

## API Documentation

API documentation is accessible by admins in the app with [Swagger-UI](https://www.npmjs.com/package/swagger-ui-react).
```
yarn docs:build
```
This will build the json documentation from the main file `/src/mocks/openapi/openapi.yaml`.

## Translations

### Setup the i18n Ally extension

We recommended using the [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) plugin for VS Code for translations management.

Create or edit the `.vscode/settings.json` file with the following settings:

```json
{
  "i18n-ally.localesPaths": ["src/locales"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.enabledFrameworks": ["general", "react", "i18next"],
  "i18n-ally.namespace": true,
  "i18n-ally.defaultNamespace": "common",
  "i18n-ally.extract.autoDetect": true,
  "i18n-ally.keysInUse": ["common.languages.*"]
}
```

### Guidelines for translations

- Use namespaces `t('namespace:translationKey')` and nesting `t('namespace:this.is.nested')`.
```js
// Example for translations available in account.json
t('account:data.firstname.label')
```

- For fields and data translations use a `data` object.
```json
// account.json
{
  "data": {
    "firstname": {
      "label": "First Name",
      "required": "First Name is required",
    },
  }
}
```
```js
// React
t('account:data.firstname.label')
t('account:data.firstname.required')
```

- For user feedbacks, use a `feedbacks` object with `actionSuccess` & `actionError` keys containing each `title` and `description` (optional).
```json
// account.json
{
  "resetPassword": {
    "feedbacks": {
      "confirmSuccess": {
        "title": "Your password has been reset",
        "description": "You can now login"
      },
      "confirmError": {
        "title": "Reset password failed"
      }
    }
  }
}
```
```js
// React
t('account:resetPassword.feedbacks.updateSuccess.title')
t('account:resetPassword.feedbacks.updateSuccess.description')
t('account:resetPassword.feedbacks.updateError.title')
```

- For user actions, use an `actions` object.
```json
// account.json
{
  "resetPassword": {
    "actions": {
      "send": "Send Email",
      "reset": "Reset Password"
    }
  }
}
```
```js
// React
t('account:resetPassword.actions.send')
t('account:resetPassword.actions.reset')
```

- Use the common workspace only for VERY generic translations. By default, use specific namespaces to allow easy update on large code base without unwanted side-effects.

## Production

### NodeJS (recommended)

```bash
yarn install
yarn storybook:build # Optional: Will expose the Storybook at `/storybook`
yarn build
yarn start
```

### Docker

1. Build the Docker image (replace `start-ui-web` with your project name)
```
docker build -t start-ui-web .
```

2. Run the Docker image (replace `start-ui-web` with your project name)
```
docker run -p 80:3000 start-ui-web
```
Application will be exposed on port 80 ([http://localhost](http://localhost))

### Static files

```bash
yarn storybook:build # Optional: Will expose the Storybook at `/storybook/index.html`
yarn static:build
```

Then expose the `/out` folder.

💡 You will need to setup your server to rewrite all `/app/*` urls to serve the `app.html` file.

#### Using Apache as your web server

If you are using [apache](https://httpd.apache.org/) to statically deploy your app, you can use the following configuration for `public/.htaccess` :

```bash
# public/.htaccess
Options -MultiViews
RewriteEngine On

# Rewrite /app/* to app.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule "^app/" "app.html" [QSA,L]
```

---

## Technology Choices

### React

[React](https://reactjs.org/) is a JavaScript library created in 2013 to build
reactive user interfaces. At the time of writing, React is probably the front
end library the most used to create new projects and has a huge community which
is beneficial for the maintainability of the project in terms of developers and
online resources.

[GitHub](https://github.com/facebook/react) · [License MIT](https://github.com/facebook/react/blob/master/LICENSE)

### Next.js

Next.js gives you the best developer experience with all the features you need
for production: hybrid static & server rendering, TypeScript support, smart
bundling, route pre-fetching, and more. No config needed.

[GitHub](https://github.com/vercel/next.js) · [License MIT](https://github.com/vercel/next.js/blob/canary/license.md)

### React Router

Next.js is bundled with its own router, but at the time of writing those lines,
it does not allow nested routes using a shared layout.

[GitHub](https://github.com/ReactTraining/react-router) · [License MIT](https://github.com/ReactTraining/react-router/blob/master/LICENSE)

### TypeScript

JavaScript is a not typed language. [TypeScript](https://www.typescriptlang.org/)
is here to help add static type definition. TypeScript helps a lot when it comes
to types, interfaces and define contract between functions which helps a lot for
a reliable documentation. No worry, the TypeScript adoption is incremental and
writing in TypeScript is not mandatory to use Start UI, but it is a good
practice to do so to avoid bugs in the future.

[GitHub](https://github.com/microsoft/TypeScript) · [License Apache 2.0](https://github.com/microsoft/TypeScript/blob/master/LICENSE.txt)

### React Query

[React Query](https://github.com/tannerlinsley/react-query) is a powerful tool
to do efficient data synchronization for React. No need of Redux
or another global state manager anymore. Usable with [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
[`axios`](https://github.com/axios/axios), or [`graphql-request`](https://github.com/prisma-labs/graphql-request),
React Query will do the work and is agnostic of the method you will use.

[GitHub](https://github.com/tannerlinsley/react-query) · [License MIT](https://github.com/tannerlinsley/react-query/blob/master/LICENSE)

### Storybook

[Storybook](https://storybook.js.org/) is an Open Source tool to help you
develop framework agnostic components in isolation and document them.

[GitHub](https://github.com/storybookjs/storybook) · [License MIT](https://github.com/storybookjs/storybook/blob/next/LICENSE)

### Chakra UI

[Chakra UI](https://chakra-ui.com/) is a simple, modular, composable and
accessible component library that is highly customizable.

[GitHub](https://github.com/chakra-ui/chakra-ui/) · [License MIT](https://github.com/chakra-ui/chakra-ui/blob/main/LICENSE)

### Formiz

To create React forms, there is a lot of libraries out there.
[Formiz](https://formiz-react.com/) will help you create React forms with ease!
Composable, headless & with built-in multi steps.

[GitHub](https://github.com/ivan-dalmet/formiz) · [License MIT](https://github.com/ivan-dalmet/formiz/blob/master/LICENSE)

### Cypress

[Cypress](https://www.cypress.io/) is a tool for end-to-end, component and unit test

[Cypress](https://github.com/cypress-io/cypress) · [License MIT](https://github.com/cypress-io/cypress/blob/develop/LICENSE)
