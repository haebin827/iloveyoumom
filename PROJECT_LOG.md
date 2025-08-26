# Project Timeline

## April 26, 2025 – MVP Development & Deployment
- Identified need: My mother, who runs a clothing store, wanted a better way to communicate with customers. She was manually writing all customer information in notebooks.
- Goal: Reduce manual effort by quickly delivering a digital solution.
- Action: Built an MVP within 10 hours, tested all flows manually (due to the small project scope, no dedicated testing tools were used).
- Deployment: Successfully deployed the solution to Vercel.

---

## August 20, 2025 – System Upgrade Decision
- Status: My mother was comfortably using the initial solution.
- Issue: Since the system was built in a rush, there were many maintainability issues and security vulnerabilities.
- Decision: Initiated a plan to upgrade and refactor the system.

---

## August 21, 2025 – Requirements Gathering
- Conducted a client meeting (with my mother) to collect requirements for the upgrade.

### Requirements Summary:
1. **Remove unused customer registration fields**
    - Fields like birthday, drink preferences, favorite/avoided colors were rarely used.

2. **Customer data CSV export**
    - Needed for maintaining store records and customer ledgers.

3. **Automated bulk SMS with templates**
    - For event promotions, identical messages had to be sent manually to all customers.
    - New system should support template-based mass messaging.

4. **Automated follow-up SMS after purchase**
    - Send an automatic check-in message one week after purchase (aligned with the store’s 1-week return/exchange policy).
    - This avoids exposing personal phone numbers and reduces manual effort.

5. **Replace “visit” feature with purchase tracking**
    - Instead of tracking visits, provide detailed purchase history.
    - Allows the client to see what items customers purchased and when.
