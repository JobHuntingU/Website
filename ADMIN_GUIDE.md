# JobHuntingU Admin & CMS Guide

This guide explains how to manage website content and leads through the Admin Dashboard.

## 🔑 Accessing the Dashboard
- **URL**: `https://jobhuntingu.com/admin` (or `http://localhost:3000/admin` locally)
- **Login**: Use your admin email and password.

---

## 📝 How to Update Website Content
The website uses "Content Keys." To change text, find the corresponding key in the table below and update its **Value** in the "Page Content" section of the dashboard.

### 🏠 Homepage Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `home` | `hero` | `hero_title` | "Stop applying blindly." |
| `home` | `hero` | `hero_subtitle` | "Start getting interviews." |
| `home` | `hero` | `hero_description` | The paragraph explaining the system. |
| `home` | `problem` | `problem_title` | "The job search is broken." |
| `home` | `problem` | `problem_p1` | First paragraph of the problem section. |
| `home` | `problem` | `problem_p2` | Second paragraph of the problem section. |

### ℹ️ About Page Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `about` | `hero` | `hero_title` | "You shouldn't have to job hunt alone." |
| `about` | `hero` | `hero_description` | The summary paragraph on the about page. |

### 💼 Services Page Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `services` | `tier` | `community_title` | "The Community Hub" |
| `services` | `tier` | `community_subtitle` | "Coming June 27th!" |
| `services` | `tier` | `community_description` | Description for the Hub. |
| `services` | `tier` | `mastermind_title` | "The Mastermind" |
| `services` | `tier` | `mastermind_subtitle` | "Done With You" |
| `services` | `tier` | `mastermind_description` | Description for the Mastermind. |
| `services` | `tier` | `vip_title` | "The VIP Tier" |
| `services` | `tier` | `vip_subtitle` | "Done For You" |
| `services` | `tier` | `vip_description` | Description for the VIP Tier. |

### 📞 Contact Page Content
| Page Name | Section | Key | Default Text / Purpose |
| :--- | :--- | :--- | :--- |
| `contact` | `info` | `contact_email` | `jerry@jobhuntingu.com` |
| `contact` | `info` | `contact_phone` | `+1 (647) 202-8777` |
| `contact` | `info` | `contact_location` | `319 W Hastings St Vancouver, BC, Canada` |

---

## 🚀 Step-by-Step Instructions
1. **Login** to the Admin Dashboard.
2. Scroll to the **Page Content** section.
3. To change existing text: Click **Edit** next to the key.
4. To add a new override: Click **Add New Key** and fill in the Page, Section, and Key from the table above.
5. Enter your new text in the **Value** box.
6. Click **Save Changes**.
7. Refresh the website to see your changes live!

---

## 📈 Managing Leads
1. Look at the **Recent Leads** table in the dashboard.
2. Every time someone fills out the contact form, they appear here.
3. Use the dropdown in the **Status** column to track your progress with each lead:
   - **New**: Fresh lead, hasn't been touched yet.
   - **Contacted**: You've reached out to them.
   - **Booked**: The discovery call is scheduled.
   - **Closed**: They've joined a program or the process is finished.
   - **Junk**: Spam or unrelated messages.
