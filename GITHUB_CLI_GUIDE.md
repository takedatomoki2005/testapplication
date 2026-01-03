# Complete GitHub CLI Guide

## Step 1: Install GitHub CLI

### Option A: Install using Homebrew (Recommended for macOS)

**1.1. First, install Homebrew (if not already installed):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
- This will ask for your password
- Follow the on-screen instructions
- Takes about 5-10 minutes

**1.2. Install GitHub CLI:**
```bash
brew install gh
```

**1.3. Verify installation:**
```bash
gh --version
```
You should see something like: `gh version 2.x.x`

### Option B: Download directly (Alternative)

1. Go to: https://github.com/cli/cli/releases/latest
2. Download `gh_*_macOS_amd64.tar.gz` (or Apple Silicon version if you have M1/M2 Mac)
3. Extract and move to `/usr/local/bin/` or add to your PATH

---

## Step 2: Authenticate with GitHub

**2.1. Start authentication:**
```bash
gh auth login
```

**2.2. You'll be asked several questions - answer them as follows:**

**Question 1: "What account do you want to log into?"**
- Choose: `GitHub.com` (press Enter)

**Question 2: "What is your preferred protocol for Git operations?"**
- Choose: `HTTPS` (recommended) or `SSH` if you have SSH keys set up
- Press Enter

**Question 3: "Authenticate Git with your GitHub credentials?"**
- Choose: `Yes` (press Y then Enter)
- This allows Git commands to use GitHub CLI authentication

**Question 4: "How would you like to authenticate GitHub CLI?"**
- Choose: `Login with a web browser` (easiest option)
- Press Enter

**2.3. You'll see:**
```
! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
```

**2.4. Do this:**
1. **Copy the code** (it's shown on screen, like `ABCD-1234`)
2. **Press Enter** - this will open your browser
3. **Paste the code** in the browser
4. **Authorize** GitHub CLI
5. **Return to terminal** - it should say "✓ Authentication complete"

**2.5. Verify authentication:**
```bash
gh auth status
```
You should see: `✓ Logged in to github.com as [your-username]`

---

## Step 3: Check Your Repository Status

**3.1. Navigate to your project:**
```bash
cd /Users/tomokitakeda/Documents/GitHub/testapplication
```

**3.2. Check current status:**
```bash
git status
```

**3.3. Check remote connection:**
```bash
git remote -v
```
Should show: `origin https://github.com/takedatomoki2005/testapplication.git`

---

## Step 4: Push to GitHub

**4.1. Check if there are uncommitted changes:**
```bash
git status
```

**4.2. If there are changes, add and commit them:**
```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Your commit message here"
```

**4.3. Push to GitHub:**
```bash
git push origin main
```

**4.4. Verify on GitHub:**
- Visit: https://github.com/takedatomoki2005/testapplication
- You should see your latest commits

---

## Step 5: Useful GitHub CLI Commands

**Check authentication:**
```bash
gh auth status
```

**View your repositories:**
```bash
gh repo list
```

**View repository details:**
```bash
gh repo view takedatomoki2005/testapplication
```

**Open repository in browser:**
```bash
gh repo view --web
```

**Create a new repository (if needed):**
```bash
gh repo create
```

**Logout (if needed):**
```bash
gh auth logout
```

---

## Troubleshooting

### "gh: command not found"
- Make sure GitHub CLI is installed: `brew install gh`
- Restart your terminal after installation

### "Authentication failed"
- Try: `gh auth login` again
- Make sure you copy the code correctly
- Check your internet connection

### "Permission denied" when pushing
- Make sure you're authenticated: `gh auth status`
- Try: `gh auth refresh`

### "Repository not found"
- Check the repository name: `git remote -v`
- Make sure you have access to the repository

---

## Next Steps After Pushing

Once your code is on GitHub, you can:
1. Deploy to Vercel (connect your GitHub account)
2. Share your repository with others
3. Create branches and pull requests
4. Set up CI/CD pipelines

