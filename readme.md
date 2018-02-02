# Marvel Dashboard
A dashboard to show what your design team is working on.
This project is an example of how to use the Marvel API.

[Try it out here](https://marvelapp.github.io/Dashboard/)

![Marvel Dashboard](/img/GithubImage.png)

### Run locally
To keep this example project simple, the project uses Javascript & HTML that doesn't have to be compiled.
Therefore you can just download the source code and run it straightway without installing dependencies.

If you want to test the authentication part you need to:
- Run a local webserver (see below)
- Make it accessible on a https address (see below)
- Create a API application here: marvelapp.com/oauth/applications/ (Client Type: confidential, Grant Type: authorization-code)
- While creating your application, use the https address as your redirect url.
- Change the ```clientId``` in ```main.js``` with the your API application client id.

###### Run a local web server:
Use Python, it's pre-installed if you're on a Mac.
```sh
$ python -m SimpleHTTPServer 8080
```

###### Give it an accessible HTTPS web address:
We recommend a tool like [ngrok](https://ngrok.com/)
```sh
$ ngrok http 8080
```

License
----

MIT
