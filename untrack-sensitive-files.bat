@echo off
echo Untracking sensitive files from Git...

echo Removing .env files from Git tracking (but keeping them locally)...
git rm --cached backend/.env
git rm --cached frontend/.env

echo Creating a commit to remove sensitive files...
git add .gitignore
git commit -m "Remove sensitive files from Git tracking"

echo Done! Sensitive files are now untracked.
echo You can now safely push to GitHub without exposing your credentials.
echo Remember to rotate your API keys and passwords for security.
