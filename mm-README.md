# How to build Prebid.js for MittMedia

0. Remove your local branch with `git branch -d mm-configuration`, then git fetch and checkout to this branch. This is to make sure you have the latest rebased release.
1. Add the modules you need to `mm-modules.json`
2. add the analytics engines you need to `mm-modules.json`
3. Build the project with:

```
gulp build --modules=mm-modules.json
```

# Update guide
Every once in a while this branch needs to be synced up with the origional prebid-js. This can be done while adding or removing adapters.

0. Add Prebid js as a remote with `git remote add origional git@github.com:prebid/Prebid.js.git` (origional, not origin)
1. Fetch the newest release of master with `git pull origional master`
2. Checkout to `mm-configuration` using `git checkout mm-configuration`
3. Git pull if needed, or preferably follow step 0 from how to build.
3. rebase master in to settings with `git rebase master`
4. Do a force push.
5. Build a new release for Sparrow using the command from step 3 in how to build.

WHEN INSTALLING WITH NPM, NEVER EVER COMMIT CHANGES IN `package.json` OR
`package.lock`!
