# lang="en" - COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)

## Current Version: Final Submission

Run:

> npm install

to download packages.

Run:

> service mysql start

to start mysql.

Then, use:

> mysql < langen_dump.sql

to generate data for the website. (If the dump errors, use the blank copy langen.sql first)

Run:

> npm start

to start the server.

Currently, there is one system admin:

> email: langen2023@gmail.com
> password: !langen123

And Several Normal Users. These users can be purely normal users [1-15] or club managers [1-8].

All the users that are currently managers have the login details of:

For # = [1-8]
> email: #M@langen2023.com
> password: Manager#

All the users that are currently just users have the login details of:

For # = [1-15]
> email: #U@langen2023.com
> password: UserPass#

If login through Firefox does not work becasue of strict-origin-when-cross-origin policy (Google login), please use Google Chrome to test the website.

Note: The home page uses the Unsplash API to deliver photos. Currently, it is setup as a demo app and therefore only allows 50 requests per hour. Once 50 attempts have been made, default images will be used instead.