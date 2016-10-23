# Nblog – another blog management system

**Nblog** is a minimalistic blog management system made for developers.

## Features

- Minimalistic design with very clean typo.
- Ultra-easy configuration.
- No database required, write your articles in files.
- Use Markdown to add formatting to your posts (GitHub-flavored Markdown).
- Add images to your posts.
- [Disqus](https://disqus.com) and [Google Analytics](https://analytics.google.com) integration (only if you want).

## Requirements

*Nblog* is basically an [npm](https://www.npmjs.com) package. That's why to use it, everything you need is Node.js, plus of course a Node.js-compatible web hosting service if you plan to make your blog available somewhere.

## Installation

1. Create a new directory on your system.
2. Install *Nblog*: `npm install nblog`
3. Create an *index.js* file, and a *posts* directory, see below.

The *index.js* file is the file you'll run to start the webserver:

```javascript
// index.js
var Nblog = require('nblog');
var blog = new Nblog();
blog.main({
    baseUrl: 'http://localhost:3000',
    title: 'My wonderful blog',
    postsDirectory: __dirname + '/posts'
}).then(function() {}).catch(err => { console.error(err.stack); });
```

These are the basic options that are required to run your blog.

Create a *posts* directory, containing two files: *001-first-post.json* and *001-first-post.md*:

```json
{
    "title": "This is the first post",
    "date": "2016-10-22T16:38:00.000Z"
}
```

```markdown
This is your first post.

<!--readmore-->

This part will be visible only in single post view.

You can use *Markdown* to _write_ your posts!
```

That's it! Now start you webserver: `node index.js`

Your blog is now available at *http://localhost:3000* :)

Note that you can change the post by setting the *POST* environment variable, e.g. `PORT=8080 node index.js`.

## Settings

`baseUrl`: the base URL of your blog, e.g. `"http://example.com"`. It's used to create canonical URLs for the posts.

`title`: the title of your blog.

`description`: a short description of your blog, which will be shown below the title. You can use markdown in it.

`footer`: content that will be shown in the page footer. Put here license info, sharing links, contact info… You can use Markdown here too.

`postsDirectory`: the absolute path of the directory containing your posts. (Use `__dirname` to know the absolute path of *index.js* file.)

`publicDirectory`: the absolute path of a directory that will be served statically by the webserver. For instance, if you set it to `__dirname + '/static'` and the *static* directory contains an *image.jpg* file, then you'll be able to access this file at */public/image.jpg*. Use it to store your images and put them in your posts with Markdown, e.g. `![My image](/public/image.jpg)`.

`disqusId`: the ID of your Disqus account if you want your visitors to be able to post comment on your articles. If your Disqus URL is *http://my-blog.disqus.com*, then your Disqus ID is *my-blog*.

`analyticsId`: the ID of your Google Analytics account, if you want to track visits on your blog.

## Contribute

If you want to contribute you're welcome! Make some pull-request :)

## License

*Nblog* is provided under [GPL-v3.0](https://www.gnu.org/licenses/gpl.html).
