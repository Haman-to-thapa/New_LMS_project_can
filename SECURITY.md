# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to [your-email@example.com]. All security vulnerabilities will be promptly addressed.

## API Key Rotation Guide

After exposing API keys or credentials, it's crucial to rotate them immediately. Follow these steps:

### MongoDB

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to Database Access
3. Find your database user
4. Click "Edit"
5. Choose "Edit Password"
6. Set a new strong password
7. Update your `.env` file with the new connection string

### Cloudinary

1. Log in to [Cloudinary Console](https://console.cloudinary.com/)
2. Go to Settings > Security
3. Click "Invalidate API Key"
4. Generate a new API key
5. Update your `.env` file with the new API key and secret

### Stripe

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Go to Developers > API keys
3. Click "Roll API keys"
4. Confirm the action
5. Update your `.env` files with the new API keys

### JWT Secret

1. Generate a new strong random string
2. Update the `SECRET_KEY` in your `.env` file

## Best Practices for Handling Secrets

1. **Never commit secrets to Git**
   - Use `.env` files for local development
   - Ensure `.env` files are in `.gitignore`

2. **Use environment variables in production**
   - Set environment variables in your hosting platform
   - Don't use `.env` files in production

3. **Rotate credentials regularly**
   - Change passwords and API keys periodically
   - Especially after team members leave the project

4. **Use secret management services**
   - Consider AWS Secrets Manager, Azure Key Vault, or similar services
   - These provide better security than `.env` files

5. **Limit API key permissions**
   - Use the principle of least privilege
   - Create separate API keys for different purposes

6. **Monitor for unauthorized access**
   - Enable logging and monitoring
   - Set up alerts for suspicious activity
