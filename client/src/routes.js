import Overview from "./views/Overview.svelte";
import Meme from "./views/Meme.svelte";
import Editor from "./views/Editor.svelte";
import User from "./views/User.svelte";
import LogIn from "./views/LogIn.svelte";
import SignUp from "./views/SignUp.svelte";
import ApiDocs from "./views/ApiDocs.svelte";
import NotFound from "./views/NotFound.svelte";

export default {
	"/": Overview,
	"/meme/:id?/edit": Editor,
	"/meme/:id": Meme,
	"/user/:id?": User,
	"/login": LogIn,
	"/signup": SignUp,
	"/api": ApiDocs,
	// Catch-all (optional, but if present it must be the last)
	"*": NotFound,
};
