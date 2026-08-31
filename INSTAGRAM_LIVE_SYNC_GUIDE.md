# Dolgins Instagram Live Feed Sync Setup Guide

This guide outlines the step-by-step procedure for connecting the official **@dolgins_jewelry** Instagram account to the Medusa backend for automated live feed synchronization.

---

## Overview of the Architecture

```
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│  @dolgins_jewelry       │       │  Medusa v2 Backend      │       │  Next.js Storefront     │
│  (Instagram Account)    │──────▶│  (Scheduled Cron Sync)  │──────▶│  (Home Page Lookbook)   │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
                                               │
                                               ▼
                                  ┌─────────────────────────┐
                                  │  Medusa Admin Panel     │
                                  │  • Pin Top Posts        │
                                  │  • Hide Irrelevant Posts│
                                  │  • Tag Jewelry Products │
                                  └─────────────────────────┘
```

---

## Step 1: Switch Instagram Account to Professional

Meta APIs only allow media access for **Professional (Business or Creator)** accounts.

1. Open the Instagram mobile app logged into **@dolgins_jewelry**.
2. Go to **Profile** ➔ Tap the **Menu (☰)** in top right ➔ **Settings and privacy**.
3. Scroll to **Account type and tools** ➔ Tap **Switch to professional account**.
4. Choose a category (e.g., *Jewelry / Watches* or *Shopping & Retail*).
5. Select **Business** (or **Creator**).
6. *(Recommended)* Connect it to the official **Dolgins Facebook Page** when prompted.

---

## Step 2: Create a Meta Developer App

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/) and log in with the Facebook account linked to the Dolgins Facebook Page.
2. Click **My Apps** (top right) ➔ Click **Create App**.
3. Select **Other** as the use case ➔ Click **Next**.
4. Select **Business** as the app type ➔ Click **Next**.
5. Set:
   - **App Name**: `Dolgins Storefront Feed`
   - **App Contact Email**: your admin email.
   - **Business Account**: Select Dolgins Business Portfolio if available.
6. Click **Create App**.

---

## Step 3: Add Instagram Graph API & Generate Access Token

1. In your new App Dashboard, scroll down to find **Instagram Graph API** and click **Set Up**.
2. On the left sidebar, navigate to **Tools** ➔ **Graph API Explorer**.
3. In the **Graph API Explorer**:
   - **Meta App**: Select `Dolgins Storefront Feed`.
   - **User or Page**: Select `Get User Access Token` or `Get Page Access Token`.
   - Under **Permissions**, add:
     - `instagram_basic`
     - `pages_show_list`
     - `pages_read_engagement`
4. Click **Generate Access Token** and follow the Facebook login pop-up to authorize access to the Dolgins Instagram account and linked Facebook Page.

---

## Step 4: Exchange for a Long-Lived Token (60 Days)

By default, Graph API Explorer tokens expire in 1–2 hours. Convert it into a **60-Day Long-Lived Token**:

1. Open the [Access Token Debugger Tool](https://developers.facebook.com/tools/debug/accesstoken/).
2. Paste the short-lived token from Step 3 into the input field and click **Debug**.
3. Scroll to the bottom and click **Extend Access Token**.
4. Copy the resulting **Long-Lived Access Token** (valid for 60 days).

---

## Step 5: Configure Medusa Backend Environment

Add the generated credentials to your backend environment file (`backend/.env`):

```bash
# ==========================================
# Instagram Graph API Configuration
# ==========================================
INSTAGRAM_ACCOUNT_ID="YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID"
INSTAGRAM_ACCESS_TOKEN="EAAxxxxxx...[YOUR_LONG_LIVED_TOKEN]..."
```

---

## Step 6: Automated Sync & Token Refresh Flow

Once the environment variable is configured:

1. **Automated Feed Ingestion**:
   - Medusa queries `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` to fetch new posts.
   - New posts are stored in the database (`instagram_post` table) with `is_visible: true`.

2. **Automated Token Refresh**:
   - Medusa calls `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=...` every 30 days.
   - This keeps the token active indefinitely without manual intervention.

3. **Admin Curation in Medusa Dashboard**:
   - All synced posts will automatically appear in your **Instagram Feed** admin tab (`/app/instagram-feed`).
   - Store managers can:
     - Toggle off non-jewelry posts (e.g. holiday announcements).
     - Pin highlight posts to the top of the storefront.
     - Tag specific catalog products ("Vintage Diamond Solitaire Ring") for **Shoppable Looks**.

---

## Troubleshooting & FAQs

### Q: What happens if a token expires?
The backend gracefully falls back to the most recently cached posts in the database. The storefront will never show a broken widget or error message.

### Q: Can we still add manual posts or change images?
**Yes.** The Medusa Admin panel allows both auto-synced posts and custom manual posts side-by-side.

### Q: Do stories or reels sync?
Reels and standard photo/video posts sync automatically. 24-hour temporary stories are excluded by Meta Graph API specifications to preserve storefront quality.
