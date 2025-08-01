# ResQFood Website Deployment Guide

## Option 1: GitHub Pages + Custom Domain (Recommended)

### Step 1: Purchase Domain
**Recommended Registrars:**
- **[Squarespace Domains](https://domains.squarespace.com)** - Clean interface, includes WHOIS privacy (~$20/year)
- **[Namecheap](https://www.namecheap.com)** - Often cheapest option (~$10-15/year)
- **[Cloudflare](https://www.cloudflare.com/products/registrar/)** - At-cost pricing (~$8-12/year)

1. Go to your chosen registrar
2. Search for `resqfood.com` or `resqfood.org`
3. Purchase the domain

### Step 2: Set up GitHub Pages
1. Go to https://github.com/keowoo78/yo
2. Click "Settings" tab
3. Scroll to "Pages" in left sidebar
4. Under "Source": Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 3: Add Custom Domain
1. In GitHub Pages settings, add your domain (e.g., `resqfood.com`)
2. Check "Enforce HTTPS"
3. GitHub will create a CNAME file in your repo

### Step 4: Configure DNS at Domain Registrar
Add these DNS records at your domain registrar:

**For apex domain (resqfood.com):**
```
Type: A
Name: @
Value: 185.199.108.153
```
```
Type: A
Name: @
Value: 185.199.109.153
```
```
Type: A
Name: @
Value: 185.199.110.153
```
```
Type: A
Name: @
Value: 185.199.111.153
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: keowoo78.github.io
```

### Step 5: Wait for DNS Propagation
- DNS changes can take 24-48 hours to fully propagate
- Your site will be available at your custom domain

---

## Option 2: Netlify + Custom Domain

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub account
3. Click "New site from Git"
4. Choose your GitHub repo: keowoo78/yo
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or set to "/")
6. Click "Deploy site"

### Step 2: Add Custom Domain
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., resqfood.com)
4. Follow Netlify's DNS configuration instructions

### Step 3: Configure DNS
Netlify will provide specific DNS records to add at your registrar.

---

## Option 3: Vercel + Custom Domain

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy with default settings

### Step 2: Add Custom Domain
1. In Vercel dashboard, go to project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS as instructed

---

## Important Notes

### Before Deployment:
1. Ensure `index.html` exists (copy from `home.html` if needed)
2. Test all links work correctly
3. Optimize images for web

### Domain Considerations:
- `.com` is more recognizable but may be more expensive
- `.org` is good for non-profits and may be cheaper
- Check trademark issues before purchasing

### SSL Certificate:
- All recommended platforms provide free SSL certificates
- Always enable HTTPS for security and SEO

### Cost Breakdown:
- Domain: $8-20/year (depending on registrar)
  - Squarespace Domains: ~$20/year (includes WHOIS privacy)
  - Namecheap: ~$10-15/year
  - Cloudflare: ~$8-12/year
- Hosting: FREE (with GitHub Pages, Netlify, or Vercel)
- Total: ~$8-20/year

## Recommended Approach:
1. Start with GitHub Pages (free, simple)
2. Purchase domain from Namecheap or Cloudflare
3. Configure DNS as shown above
4. Enable HTTPS in GitHub Pages settings

Your website will be live at your custom domain within 24-48 hours!