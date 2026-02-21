🔐 Managing Multiple GitHub Accounts, Rewriting History & Fixing Auth Issues

This guide covers:

Handling multiple GitHub accounts (work + personal)

Fixing SSH/HTTPS authentication issues

Changing commit author history

Using git filter-repo safely

Force pushing rewritten history correctly

1️⃣ Problem: Permission Denied While Pushing
Example Error
ERROR: Permission to rahul-parmar-rp/portfolio.git denied to rahul-parmar-bsh.
Root Cause

You are authenticated as one GitHub user, but trying to push to a repository owned by another user.

Authentication method determines identity:

Method Determines Identity
SSH SSH key uploaded to GitHub
HTTPS Username + Personal Access Token
gh CLI Stored GitHub login session
2️⃣ Cleanest Simple Setup (No SSH Complexity)

If you don’t want multiple SSH keys:

Keep:

SSH for work repos

HTTPS for personal repos

Change remote:

git remote add origin https://github.com/<username>/<repo>.git

Push:

git push

Use a GitHub Personal Access Token when prompted.

3️⃣ Changing Commit Author Email (Rewrite History)
Scenario

Commits were created with:

old-email@example.com

But you want:

Your Name <new-email@example.com>
Recommended Tool: git filter-repo

git filter-branch is deprecated. Use git filter-repo.

Install (Mac):

brew install git-filter-repo
Rewrite Author + Committer
git filter-repo --force --commit-callback '
if commit.author_email == b"old-email@example.com":
commit.author_name = b"Your Name"
commit.author_email = b"new-email@example.com"
if commit.committer_email == b"old-email@example.com":
commit.committer_name = b"Your Name"
commit.committer_email = b"new-email@example.com"
'
Why --force?

git filter-repo blocks rewriting unless:

It’s a fresh clone

Or you explicitly allow destructive rewrite

4️⃣ Why Origin Remote Disappears

After running git filter-repo, you’ll see:

NOTICE: Removing 'origin' remote

This is intentional.

It prevents accidental force-pushing to a shared repository.

Fix: Re-add Remote
git remote add origin https://github.com/<username>/<repo>.git

Verify:

git remote -v
5️⃣ Force Pushing Rewritten History

After rewriting history, normal push fails:

! [rejected] main -> main (fetch first)

This happens because commit hashes changed.

Correct fix:

git push --force origin main

Safer version:

git push --force-with-lease origin main
6️⃣ Verify Changes Before Push

Check commit authors:

git log --pretty=format:"%h %an %ae"

Ensure all emails are correct.

7️⃣ Make Sure Future Commits Are Correct

Set global identity:

git config --global user.name "Your Name"
git config --global user.email "new-email@example.com"

Or per-repo:

git config user.name "Your Name"
git config user.email "new-email@example.com"
8️⃣ GitHub Contribution Graph Rules

For commits to appear on your GitHub profile:

Email must be added in GitHub → Settings → Emails

Email must be verified

It must match commit email exactly

9️⃣ When NOT to Rewrite History

Never rewrite history if:

Repo belongs to an organization

Other developers are working on the branch

It’s already merged to shared main branch

Safe scenarios:

Personal portfolio repo

Private sandbox project

Local branch before merge

🔟 Quick Troubleshooting Matrix
Problem Fix
Permission denied Wrong SSH key or account
Remote removed Re-add origin
Push rejected (fetch first) Use --force
Commits not on GitHub graph Email not verified
filter-repo blocked Use --force or fresh clone
🔥 Best Practice Summary

For someone working with:

Work org repos

Personal repos

Recommended setup:

SSH for work

HTTPS for personal

Use git filter-repo for history rewrites

Never expose tokens in remote URLs

Always verify before force push

If you want, I can now turn this into:

📄 Markdown file ready for GitHub repo

📘 Medium-style article

🧠 Internal engineering wiki version

🎯 LinkedIn technical post

🧾 Clean README section for portfolio repo

Tell me which format you want.
