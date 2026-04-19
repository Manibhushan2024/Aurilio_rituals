# Aurilio Rituals — Shopify Theme

This repository contains the `aurelia-rituals-theme` Shopify theme used for the Aurilio Rituals store.

## Purpose
Theme source for the Shopify store. Includes templates, sections, snippets and assets required to run the storefront.

## Quick deploy (two options)

Option A — Shopify CLI (recommended for local development)

Prerequisites:
- A Shopify store and account
- Shopify CLI installed (see Shopify docs)

Steps:
1. Clone the repo (or pull latest changes):

```bash
git clone https://github.com/Manibhushan2024/Aurilio_rituals.git
cd aurelia-rituals-theme
```

2. Login to your store with Shopify CLI:

```bash
shopify login --store your-store.myshopify.com
```

3. Preview locally while developing:

```bash
shopify theme serve
```

4. Push the theme to the store (do not use `--publish` until you're ready to go live):

```bash
shopify theme push
# To make the pushed theme live:
shopify theme push --publish
```

Option B — GitHub Integration (deploy from a branch)

1. Ensure this repository is on GitHub and the correct branch (e.g. `main`) is up to date.
2. In Shopify admin go to Online Store → Themes → Connect from GitHub (or "Add from GitHub") and follow the prompts to link the repo and branch.
3. Once connected you can pull the theme from the linked branch and publish from Shopify admin.

## Notes and recommendations
- Replace `your-store.myshopify.com` with your actual store domain.
- Keep a backup of `config/settings_data.json` before publishing changes.
- Consider adding a `.gitignore` to exclude local/temporary files.
- For large assets you may want to host images on a CDN or Shopify Files and reference them to keep repo size small.

## Support
If you want, I can:
- add a `.gitignore` file
- add a short `theme_settings.md` documenting important theme settings
- help connect the repository to your Shopify store via GitHub integration or Shopify CLI

--
Generated and added to the theme by your assistant.
