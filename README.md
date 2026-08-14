# Mirrors N Scissors — static site

Quick notes to run and deploy this static site.

Run locally (requires Python 3):

```bash
cd mirrorsNscissors
python -m http.server 3000
# then open http://localhost:3000
```

Prepare & push to GitHub:

```bash
cd mirrorsNscissors
git init
git add .
git commit -m "Initial commit"
# create repo and push (example uses GitHub CLI):
gh repo create mardixgartix-hue/Mirrror-and-scissors --public --source=. --remote=origin --push
```

Deploy to Vercel (CLI):

```bash
npm i -g vercel
vercel login
vercel # follow prompts to link or create project
vercel --prod
```

Or deploy via Vercel dashboard by importing the GitHub repository and selecting the project root.
