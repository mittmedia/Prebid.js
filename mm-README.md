# How to build Prebid.js for MittMedia

0. Remove your local branch with `git branch -d mm-config-${version}-${app}`, 
1. Then git fetch and checkout to this branch. This is to make sure 
   you have the latest rebased release.
1. Add the modules you need to `mm-modules.json`
2. Add the analytics engines you need to `mm-modules.json`
3. Build the project with:

```
npm install && npx gulp build --modules=mm-modules.json
```

# Update guide
Every once in a while this branch needs to be synced up with the origional prebid-js. 
This can be done while adding or removing adapters.

0. Add Prebid js as a remote with 
```
git remote add upstream git@github.com:prebid/Prebid.js.git` (upstream, not origin)
```
1. Fetch the newest HEAD of master with `git pull upstream master`.
2. Go back with `git reset --hard $commitsha` where $commitsha is the sha of the newest release.
3. Update our own master with newest release with `git push -f origin master`
4. Checkout a new branch with the naming scheme mm-config-${version}-${app}. 
`git checkout -b mm-config-${version}-${app}`
5. Cherry-pick our custom changes from the previous version your app used with 
`git cherry-pick $hash1 $hash2....`
6. Build a new release for using the command from step 3 in how to build.
