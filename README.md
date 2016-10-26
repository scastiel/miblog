# Miblog – another blog management system

**Miblog** is a minimalistic static blog management system made for developers. By static, understand that it's basically a command line tool which, from a given configuration file and some post files, will generate all a ready-to-deploy directory with HTML files, CSS, images, etc.

## Features

- Minimalistic design with very clean typo.
- Ultra-easy configuration.
- No database required, write your articles in files.
- No server-side process like Node.js, Ruby, PHP... generated content is static and ready to deploy!
- Use Markdown to add formatting to your posts (GitHub-flavored Markdown).
- Add images to your posts.
- [Disqus](https://disqus.com) and [Google Analytics](https://analytics.google.com) integration (only if you want).

## Requirements

*Miblog* is a command line tool availble as an [npm](https://www.npmjs.com) package. That's why to use it, everything you need is Node.js, plus of course a web hosting service if you plan to make your blog available somewhere.

## Quick start

Here is the right way to use *Miblog*. First create a new directory on your system, initialize a *package.json* file (by running `npm init`), then install *Miblog*: `npm install --save miblog`.

In the *package.json* file, add a script which will be used to generate the content of your blog:

```javascript
// ...
"scripts": {
  "generate": "miblog dist"
},
// ...
```

The *dist* parameter to the command *miblog* is the directory where you want the content to be generated.

Next create a *miblog.conf.js* file, which contains the basic configuration for your blog:

```javascript
module.exports = {
    baseUrl: 'http://localhost:3000',
    title: 'My wonderful blog',
    postsDirectory: __dirname + '/posts'
};
```

Finally, create a *posts* directory, containing two files: *001-first-post.json* and *001-first-post.md*:

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

That's it! Now let's generate your blog: `npm run generate`. Everything is generated in the *dist* folder; all you need to do now is running a webserver serving statically your dist directory.

To play with your blog locally, the easiest solution is to use the [http-server](https://github.com/indexzero/http-server) Node module. Install it with `npm install --save http-server`, add a new *script* in your *package.json*: `"start": "http-server dist -p 3000"`, then start the server with `npm start`.

Your blog is now available at *http://localhost:3000* :)

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

*Miblog* is provided under [GPL-v3.0](https://www.gnu.org/licenses/gpl.html).
