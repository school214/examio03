# Security notes

- Never commit `.env`, database connection strings, API keys, session secrets, or administrator passwords.
- If a password or secret is exposed, rotate it immediately and invalidate affected sessions.
- Keep the GitHub repository private whenever possible.
- Use HTTPS in production. Vercel supplies HTTPS and secure cookies for production requests.
- Run database migrations from a trusted environment and limit database credentials to the required project.
- Report security issues privately to the project owner rather than publishing credentials or exploit details.
