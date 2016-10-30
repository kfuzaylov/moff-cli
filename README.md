# Moff CLI - The Moff.js command line utility.
Home page: [http://moffjs.com/moff-cli/index.html](http://moffjs.com/moff-cli/index.html "Moff CLI - The Moff.js command line utility")

Overview
-------

Moff CLI optimizes you page by one command. It will generate fully optimized page from your source page.
Generated pages are become lighter and faster and available for viewing on slow connection. It will apply all possible techniques to optimize page, starting from
concatenation, minification and finishing by generation critical css path. Below you can see what exactly do Moff CLI to optimize your page.

Usage
-----

### Install Moff CLI

    > npm install -g moff-cli

### Optimize your page

    > moff api/index.src.html api/index.html

Run this command to optimize your page. You have to run it from the root of your project, because Moff CLI creates `moff-assets` folder in working directory and puts all generated assets into it.

Note: If you do not specify optimized file name then it will be generated as input file name with `moff-` prefix.

What does Moff CLI optimize?
----------------------------

### Concatenate, minify CSS and generates critical path CSS

All your CSS files will be concatenated and minified into one file to reduce <abbr title="The Hypertext Transfer Protocol">HTTP</abbr> requests to server.
Only external (when href starts from `http(s)` or `//`) css files are not processed by CLI, because usually this is <abbr title="Content Delivery Network">CDN</abbr> files which are already cached.

Concatenated files named by MD5 hash of file content. It allows to set maximum expiry date in the HTTP headers and update resources by changed hash in file name.

After CSS files concatenation it generates critical path CSS. It will decrease the time to display content to the screen and additional network latency. Modern browsers block painting content to the screen before loading external CSS. Inlining CSS of view port optimizes time to render.

    <!-- Before -->
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
        <link rel="stylesheet" href="/styles/main.css">
        <link rel="stylesheet" href="/styles/form.css">
        <link rel="stylesheet" href="/styles/popup.css">
    </head>

    <!-- After -->
    <head>
        <style type="text/css">
            .clearfix:after,.container:after,.row:after{clear:both}.col-xs-12,.m-logo_left{float:left}.container_brand,.m-feature{position:relative}
            .m-feature__title-link,a{text-decoration:none}header,main,nav{display:block}a{background-color:transparent;color:#57abc1}
            h1{font-size:2em;margin:.67em 0}img{border:0;vertical-align:middle}*,:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}
            html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-size:10px}
            body{margin:0;font-size:14px;background-color:#fff;font-family:"Open Sans",sans-serif;color:#102025;font-weight:400;line-height:1.52857}
            .m-brand-block,.m-navigation__list-link_active{background-color:#57abc1;color:#fff}.clearfix:after,.clearfix:before{content:" ";display:table}
            @-ms-viewport{width:device-width}.visible-md,.visible-sm{display:none!important}@media (min-width:768px) and (max-width:991px)
        </style>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" rel="preload" as="style" onload="this.rel='stylesheet'">
        <noscript><link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" rel="stylesheet"></noscript>
        <link href="/moff-assets/b288868ee7bdac056132c59c60959af3.css" rel="preload" as="style" onload="this.rel='stylesheet'">
        <noscript><link href="/moff-assets/b288868ee7bdac056132c59c60959af3.css" rel="stylesheet"></noscript>
        <script>!function(e){"use strict";var t=function(t,n,r){function o(e){return i.body?e():void setTimeout(function(){o(e)})}function a(){d.addEventListener&&d.removeEventListener("load",a),d.media=r||"all"}var l,i=e.document,d=i.createElement("link");if(n)l=n;else{var s=(i.body||i.getElementsByTagName("head")[0]).childNodes;l=s[s.length-1]}var u=i.styleSheets;d.rel="stylesheet",d.href=t,d.media="only x",o(function(){l.parentNode.insertBefore(d,n?l:l.nextSibling)});var f=function(e){for(var t=d.href,n=u.length;n--;)if(u[n].href===t)return e();setTimeout(function(){f(e)})};return d.addEventListener&&d.addEventListener("load",a),d.onloadcssdefined=f,f(a),d};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this),function(e){if(e.loadCSS){var t=loadCSS.relpreload={};if(t.support=function(){try{return e.document.createElement("link").relList.supports("preload")}catch(e){return!1}},t.poly=function(){for(var t=e.document.getElementsByTagName("link"),n=0;n&lt;t.length;n++){var r=t[n];"preload"===r.rel&&"style"===r.getAttribute("as")&&(e.loadCSS(r.href,r),r.rel=null)}},!t.support()){t.poly();var n=e.setInterval(t.poly,300);e.addEventListener&&e.addEventListener("load",function(){e.clearInterval(n)}),e.attachEvent&&e.attachEvent("onload",function(){e.clearInterval(n)})}}}(this);</script>
    </head&>

### Concatenate and minify JavaScript

JavaScript files concatenated and minified the same way as CSS files. All files are concatenated and minified except of asynchronous and external ones.
 If script source starts from `http(s)`, `//` or has `async` attribute it will not be precessed by Moff CLI.
Generated files are stored in `moff-assets` folder and renamed by MD5 hash.

    <!-- Before -->
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="/scripts/functions.js"></script>
    <script src="/scripts/registration.js"></script>

    <!-- After -->
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="/moff-assets/s2g886eee74dac056o32c53c60784az2.js"></script>

</p>
### Minify HTML and inlined JavaScript, CSS

Moff CLI minifies HTML of and inlined JavaScript to reduce the size of the page.

    <!-- Before -->
    <style>
    .clearfix:after, .container:after, .row:after {
        clear: both
    }

    .col-xs-12, .m-logo_left {
        float: left
    }

    .container_brand, .m-feature {
        position: relative
    }

    .m-feature__title-link, a {
        text-decoration: none
    }

    header, main, nav {
        display: block
    }

    a {
        background-color: transparent;
        color: #57abc1
    }

    h1 {
        font-size: 2em;
        margin: .67em 0
    }
    </style>
    <header role="banner">
        <div class="container container_header">
            <div class="m-logo m-logo_left">
                <a href="/" title="Moff.js - Home">
                    <img src="/images/logo.png" alt="JavaScript Mobile First framework" class="m-logo__image">
                </a>
            </div>
            <nav role="navigation" class="m-navigation">
                <ul class="m-navigation__list">
                    <li class="m-navigation__list-item"><a class="m-navigation__list-link m-navigation__list-link_active" href="/">Home</a></li>
                    <li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/tutorial/getting-started.html">Tutorials</a></li>
                    <li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/api/index.html">API</a></li>
                    <li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/blog/index.html">Blog</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <script>
        Moff.amd.register({
            id: 'social',
            depend: {
                js: ['https://buttons.github.io/buttons.js', 'https://apis.google.com/js/platform.js']
            },
            afterInclude: function() {
                !function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                    if (!d.getElementById(id)) {
                        js = d.createElement(s);
                        js.id = id;
                        js.src = p + '://platform.twitter.com/widgets.js';
                        fjs.parentNode.insertBefore(js, fjs);
                    }
                }(document, 'script', 'twitter-wjs');
            }
        });
    </script>

    <!-- After -->
    <style>.clearfix:after,.container:after,.row:after{clear:both}.col-xs-12,.m-logo_left{float:left}.container_brand,.m-feature{position:relative}.m-feature__title-link,a{text-decoration:none}header,main,nav{display:block}a{background-color:transparent;color:#57abc1}h1{font-size:2em;margin:.67em 0}</style>
    <header role="banner"><div class="container container_header"><div class="m-logo m-logo_left"><a href="/" title="Moff.js - Home"><img src="/images/logo.png" alt="JavaScript Mobile First framework" class="m-logo__image"></a></div><nav role="navigation" class="m-navigation"><ul class="m-navigation__list"><li class="m-navigation__list-item"><a class="m-navigation__list-link m-navigation__list-link_active" href="/">Home</a></li><li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/tutorial/getting-started.html">Tutorials</a></li><li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/api/index.html">API</a></li><li class="m-navigation__list-item"><a class="m-navigation__list-link" href="/blog/index.html">Blog</a></li></ul></nav></div></header>
    <script>
    Moff.amd.register({id:"social",depend:{js:["https://buttons.github.io/buttons.js","https://apis.google.com/js/platform.js"]},afterInclude:function(){!function(t,e,s){var n,o=t.getElementsByTagName(e)[0],r=/^http:/.test(t.location)?"http":"https";t.getElementById(s)||(n=t.createElement(e),n.id=s,n.src=r+"://platform.twitter.com/widgets.js",o.parentNode.insertBefore(n,o))}(document,"script","twitter-wjs")}});
    </script>

Options
-------

### Examples

Optimize page with specific width and height for critical path css

    > moff api/index.src.html api/index.html -w 320 -h 760
    Page successfully generated!

Print Moff CLI version

    > moff -v
    v0.2.0

| Name | Default | Description                                           |
|------|---------------|-------------------------------------------------|
| -w   | 1170          | Width of view port for critical css generation  |
| -h   | 1000          | Height of view port for critical css generation |
| -v   |               | Current Moff CLI version                        |