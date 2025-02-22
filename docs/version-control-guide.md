# Version Control & Authentication Guide 🔐

## Initial Setup 🚀

### Git Configuration

1. **Set up your Git identity**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

2. **Verify your configuration**
```bash
git config --get user.name
git config --get user.email
```

## Authentication Setup 🔑

### GitHub CLI

1. **Check authentication status**
```bash
gh auth status
```

2. **Login if needed**
```bash
gh auth login
```

### SSH Keys

1. **Check existing SSH keys**
```bash
ls -la ~/.ssh
```

2. **Generate new SSH key**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

3. **Add SSH key to ssh-agent**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

4. **Add to GitHub**
- Copy your public key: `cat ~/.ssh/id_ed25519.pub`
- Add it to [GitHub SSH Settings](https://github.com/settings/keys)

## Vercel Integration 🚀

1. **Check Vercel authentication**
```bash
vercel whoami
```

2. **Link project with Vercel**
```bash
vercel link
```

3. **Pull environment variables**
```bash
vercel env pull
```

## Common Git Operations 💻

### Repository Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd promptmack
```

2. **Check remote configuration**
```bash
git remote -v
```

### Daily Workflow

1. **Check status and branch**
```bash
git status
git branch
```

2. **Create and switch to new branch**
```bash
git checkout -b feature/new-feature
```

3. **Stage and commit changes**
```bash
git add .
git commit -m "feat: add new feature"
```

4. **Push changes**
```bash
git push origin feature/new-feature
```

### Keeping Up-to-Date

1. **Update main branch**
```bash
git checkout main
git pull origin main
```

2. **Update feature branch**
```bash
git checkout feature/new-feature
git rebase main
```

## Troubleshooting 🔍

### Git Authentication Issues

1. **Check stored credentials**
```bash
git credential-osxkeychain
```

2. **Reset credentials if needed**
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```

### SSH Issues

1. **Test SSH connection**
```bash
ssh -T git@github.com
```

2. **Debug SSH issues**
```bash
ssh -vT git@github.com
```

## Best Practices 🌟

1. **Commit Messages**
- Use conventional commits format
- Start with type: feat, fix, docs, style, refactor, test, chore
- Example: `feat: add user authentication`

2. **Branch Management**
- Keep branches focused and short-lived
- Regularly rebase with main
- Delete merged branches

3. **Code Review**
- Create descriptive pull requests
- Reference issues in commits and PRs
- Request reviews from team members

## Environment Variables 🔒

1. **Local Development**
- Copy `.env.example` to `.env.local`
- Never commit `.env` files
- Use `vercel env pull` for production variables

2. **Production**
- Manage variables through Vercel dashboard
- Use different variables per environment

## Additional Resources 📚

- [GitHub CLI documentation](https://cli.github.com/manual/)
- [Vercel CLI documentation](https://vercel.com/docs/cli)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git documentation](https://git-scm.com/doc)