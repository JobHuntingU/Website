# JobHuntingU Admin & CMS Guide

This guide explains how to manage website content and leads through the Admin Dashboard.

## 🔑 Accessing the Dashboard
- **URL**: `https://jobhuntingu.com/admin` (or `http://localhost:3000/admin` locally)
- **Login**: Use your admin email and password.

---

## 📝 How to Update Website Content

### 1. Page Content (Text Overrides)
The website uses "Content Keys" to manage text without redeploying code. To change text, find the corresponding key in the table below and update its **Value** in the "Page Content" tab.

#### 🏠 Homepage Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `home` | `hero` | `hero_title` | "Stop applying blindly." |
| `home` | `hero` | `hero_subtitle` | "Start getting interviews." |
| `home` | `hero` | `hero_description` | The paragraph explaining the system. |
| `home` | `problem` | `problem_title` | "The job search is broken." |
| `home` | `problem` | `problem_p1` | First paragraph of the problem section. |
| `home` | `problem` | `problem_p2` | Second paragraph of the problem section. |

#### ℹ️ About Page Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `about` | `hero` | `hero_title` | "You shouldn't have to job hunt alone." |
| `about` | `hero` | `hero_description` | The summary paragraph on the about page. |

---

### 2. Careers (Job Postings)
1. Go to the **Careers** tab.
2. Fill out the "Post a New Job" form.
3. **Note on SEO**: The "Job Title" and "Description" are used by Google Jobs. Ensure they are clear for better visibility.
4. Click **Post Job**. It will appear immediately on the `/careers` page.

### 3. Blog Manager (Insights)
1. Go to the **Blog Manager** tab.
2. **Title**: The system automatically generates a URL-friendly "slug" from your title.
3. **Excerpt**: A short summary (2-3 sentences) shown on the main blog list.
4. **Content**: Supports Markdown/HTML for rich text.
5. **Image URL**: Use a high-quality Unsplash link or a hosted image link.

---

## 🚀 Step-by-Step Instructions
1. **Login** to the Admin Dashboard.
2. Select the appropriate **Tab** for what you want to change.
3. To change existing text (Page Content): Click **Edit** next to the key, change the value, and click **Save**.
4. To remove a job or blog: Click the **Delete/Remove** button in its respective table.
5. Refresh the website to see your changes live!

---

## 📈 Managing Leads
1. Look at the **Leads** table in the dashboard.
2. Every time someone fills out the contact form, they appear here.
3. Use the dropdown in the **Status** column to track your progress:
   - **New**: Fresh lead.
   - **Contacted**: You've reached out.
   - **Booked**: Call scheduled.
   - **Closed**: Conversion successful.
   - **Junk**: Spam.

---

## 📊 Website Statistics
To track how many people are visiting the site and how they are using it, we use the following tools:
- **Microsoft Clarity**: Watch session recordings and see where users click. [Login here](https://clarity.microsoft.com/)
- **Google Search Console**: See what people are searching for to find JobHuntingU. [Login here](https://search.google.com/search-console)
