npm run build
git add dist -f
git commit -m 'adding dist subtree'
git subtree push --prefix dist origin gh-pages2
git push origin `git subtree split --prefix dist main`:gh-pages2 --force
