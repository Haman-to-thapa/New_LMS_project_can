@echo off
echo This script will clean sensitive files from your Git history.
echo WARNING: This will rewrite your Git history. If you've already pushed to a shared repository,
echo this can cause problems for other contributors.
echo.
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

echo.
echo Step 1: Creating a backup branch of your current state...
git branch backup-before-cleaning

echo.
echo Step 2: Removing sensitive files from Git history...
git filter-branch --force --index-filter ^
"git rm --cached --ignore-unmatch backend/.env backend/.env.backup frontend/.env" ^
--prune-empty --tag-name-filter cat -- --all

echo.
echo Step 3: Forcing garbage collection to remove old objects...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo.
echo Step 4: Creating new .env.example files...
echo # MongoDB Connection > backend\.env.example
echo MONGO_URI=mongodb+srv:/^<username^>:^<password^>@^<cluster^>.mongodb.net/^<dbname^>?retryWrites=true^&w=majority >> backend\.env.example
echo. >> backend\.env.example
echo # Server Configuration >> backend\.env.example
echo PORT=8080 >> backend\.env.example
echo SECRET_KEY=your_secret_key_here >> backend\.env.example
echo NODE_ENV=development >> backend\.env.example
echo. >> backend\.env.example
echo # Frontend URL (for CORS and redirects) >> backend\.env.example
echo FRONTEND_URL=http://localhost:5173 >> backend\.env.example
echo ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000 >> backend\.env.example
echo. >> backend\.env.example
echo # Cloudinary Configuration >> backend\.env.example
echo CLOUD_NAME=your_cloud_name >> backend\.env.example
echo API_KEY=your_api_key >> backend\.env.example
echo API_SECRET=your_api_secret >> backend\.env.example
echo. >> backend\.env.example
echo # Stripe Configuration >> backend\.env.example
echo STRIPE_SECRET_KEY=your_stripe_secret_key >> backend\.env.example
echo STRIPE_PUBLIC_KEY=your_stripe_public_key >> backend\.env.example

echo # API Base URL - Set to your backend URL > frontend\.env.example
echo VITE_API_BASE_URL=http://localhost:8080/api/v1 >> frontend\.env.example
echo. >> frontend\.env.example
echo # Stripe Public Key >> frontend\.env.example
echo VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key >> frontend\.env.example

echo.
echo Step 5: Removing backup files...
del backend\.env.backup

echo.
echo Step 6: Creating a new commit with clean files...
git add .
git commit -m "Clean repository and add example environment files"

echo.
echo IMPORTANT: Your Git history has been rewritten to remove sensitive files.
echo You will need to force push to your GitHub repository:
echo.
echo git push origin main --force
echo.
echo REMEMBER: After pushing, you should immediately:
echo 1. Rotate all your API keys and passwords
echo 2. Update your local .env files with the new credentials
echo.
echo Done! Your repository should now be clean of sensitive information.
