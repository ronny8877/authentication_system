import * as shell from "shelljs";
// Copy all the view templates and assets in the public folder
shell.cp("-R", ["./source/startup/firebase.secrate.json"], "build/source/startup");
shell.cp("-R", ["./source/swagger_output.json"], "build/source");

console.log("Files copied")