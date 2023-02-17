import {FormStrategy} from "remix-auth-form";
import {Authenticator} from "remix-auth";
import {sessionStorage} from "~/services/session.server";

interface User {
    username: string;
    password: string;
}

function login(username: string, password: string) {
    // this is where you would check the database or whatever
    // to see if the username and password are valid
    // for this example we'll just check the users.json file
    // and return the user if it exists
    let users = require("~/users.json");
    return users.users.find(
        (user: User) => user.username === username && user.password === password
    );
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        let username = form.get("username") as string;
        let password = form.get("password") as string;
        let user = await login(username, password);
        // the type of this user must match the type you pass to the Authenticator
        // the strategy will automatically inherit the type if you instantiate
        // directly inside the `use` method
        return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
);